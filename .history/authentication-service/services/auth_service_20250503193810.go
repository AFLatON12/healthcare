package services

import (
	"errors"
	"log"
	"regexp"
	"strings"
	"time"

	"healthcare/authentication-service/controllers"
	"healthcare/authentication-service/models"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// AuthService struct definition
type AuthService struct {
	superAdminCtrl *controllers.SuperAdminController
	adminCtrl      *controllers.AdminController
	doctorCtrl     *controllers.DoctorController
	patientCtrl    *controllers.PatientController
	jwtSecret      string
}

// Claims struct for JWT
type Claims struct {
	UserID      primitive.ObjectID `json:"user_id"`
	Email       string             `json:"email"`
	Role        string             `json:"role"`
	Permissions []string           `json:"permissions"`
	jwt.StandardClaims
}

// Error variables
var (
	ErrInvalidEmail       = errors.New("invalid email format")
	ErrAccountLocked      = errors.New("account is locked due to multiple failed login attempts")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrDoctorNotApproved  = errors.New("doctor account not approved")
	ErrPatientNotApproved = errors.New("patient account not approved")
	ErrUserAlreadyExists  = errors.New("user already exists")
)

// LoginAttempt struct for tracking login attempts
type LoginAttempt struct {
	Email     string
	Timestamp time.Time
	Success   bool
}

var loginAttempts = make(map[string][]LoginAttempt)

// NewAuthService constructor
func NewAuthService(superAdminCtrl *controllers.SuperAdminController, adminCtrl *controllers.AdminController, doctorCtrl *controllers.DoctorController, patientCtrl *controllers.PatientController, jwtSecret string) *AuthService {
	return &AuthService{
		superAdminCtrl: superAdminCtrl,
		adminCtrl:      adminCtrl,
		doctorCtrl:     doctorCtrl,
		patientCtrl:    patientCtrl,
		jwtSecret:      jwtSecret,
	}
}

func (s *AuthService) InitializeSuperAdmin(email, password string) error {
	// Check if super admin exists
	if _, err := s.superAdminCtrl.GetByEmail(email); err == nil {
		return errors.New("super admin already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Create super admin
	superAdmin := &models.SuperAdmin{
		Username:     "superadmin",
		Email:        email,
		PasswordHash: string(hashedPassword),
		Permissions:  permissionsToStrings(models.DefaultSuperAdminPermissions()),
	}

	return s.superAdminCtrl.Create(superAdmin)
}

func (s *AuthService) CreateAdmin(creatorID primitive.ObjectID, email, password string) error {
	log.Printf("[DEBUG] Starting CreateAdmin with email: %s", email)

	// Validate email format
	if !strings.Contains(email, "@") {
		log.Printf("[ERROR] Invalid email format: %s", email)
		return errors.New("invalid email format")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("[ERROR] Password hashing failed: %s", err.Error())
		return err
	}

	// Create admin with default permissions
	admin := &models.Admin{
		Username:     email[:strings.Index(email, "@")],
		Email:        email,
		PasswordHash: string(hashedPassword),
		CreatedBy:    creatorID,
		Permissions:  permissionsToStrings(models.DefaultAdminPermissions()),
	}

	if err := s.adminCtrl.Create(admin); err != nil {
		log.Printf("[ERROR] Admin creation failed: %s", err.Error())
		return err
	}

	log.Printf("[DEBUG] Admin created successfully: %s", email)
	return nil
}

func (s *AuthService) ListAdmins() ([]*models.Admin, error) {
	return s.adminCtrl.List()
}

func (s *AuthService) GetAdmin(adminID primitive.ObjectID) (*models.Admin, error) {
	return s.adminCtrl.GetByID(adminID)
}

func (s *AuthService) UpdateAdmin(adminID primitive.ObjectID, admin *models.Admin) error {
	return s.adminCtrl.Update(adminID, admin)
}

func (s *AuthService) DeleteAdmin(adminID primitive.ObjectID) error {
	return s.adminCtrl.Delete(adminID)
}

func (s *AuthService) validatePassword(password string) error {
	if len(password) < 6 {
		return errors.New("password must be at least 6 characters long")
	}
	// Add more password validation rules here if needed
	return nil
}

func (s *AuthService) RegisterDoctor(doctor *models.Doctor, password string) error {
	// Validate email and password
	if err := s.validateEmail(doctor.Email); err != nil {
		return err
	}
	if err := s.validatePassword(password); err != nil {
		return err
	}

	// Check if doctor already exists
	if _, err := s.doctorCtrl.GetByEmail(doctor.Email); err == nil {
		return ErrUserAlreadyExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Set password hash
	doctor.PasswordHash = string(hashedPassword)

	// Create doctor
	if err := s.doctorCtrl.Create(doctor); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) RegisterPatient(email, password, name, phone, address, dateOfBirth, gender, insuranceProvider string) error {
	log.Printf("[DEBUG] Registering patient with email: %s", email)
	if err := s.validateEmail(email); err != nil {
		log.Printf("[DEBUG] Email validation failed: %s", err.Error())
		return err
	}

	if len(password) < 6 {
		log.Printf("[DEBUG] Password validation failed: too short")
		return errors.New("password must be at least 6 characters long")
	}

	if _, err := s.patientCtrl.GetByEmail(email); err == nil {
		log.Printf("[DEBUG] Patient already exists with email: %s", email)
		return ErrUserAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("[DEBUG] Password hashing failed: %s", err.Error())
		return err
	}

	dob, err := time.Parse("2006-01-02", dateOfBirth)
	if err != nil {
		log.Printf("[DEBUG] Date of birth parsing failed: %s", err.Error())
		return errors.New("invalid date format")
	}

	patient := &models.Patient{
		Name:              name,
		Email:             email,
		PasswordHash:      string(hashedPassword),
		Phone:             phone,
		Address:           address,
		DateOfBirth:       dob,
		Gender:            models.Gender(gender),
		InsuranceProvider: insuranceProvider,
		MedicalHistory:    []string{},
		IsApproved:        true,
		CreatedAt:         time.Now(),
	}

	if err := s.patientCtrl.Create(patient); err != nil {
		log.Printf("[DEBUG] Patient creation failed: %s", err.Error())
		return err
	}

	log.Printf("[DEBUG] Patient registered successfully: %s", email)
	return nil
}

func (s *AuthService) ListDoctors() ([]*models.Doctor, error) {
	return s.doctorCtrl.List(nil)
}

func (s *AuthService) ListApprovedDoctors() ([]*models.Doctor, error) {
	return s.doctorCtrl.ListApproved()
}

func (s *AuthService) ListAvailableDoctors() ([]*models.Doctor, error) {
	return s.doctorCtrl.ListAvailable()
}

func (s *AuthService) ListPendingDoctors() ([]*models.Doctor, error) {
	return s.doctorCtrl.ListPending()
}

func (s *AuthService) GetDoctor(doctorID primitive.ObjectID) (*models.Doctor, error) {
	return s.doctorCtrl.GetByID(doctorID)
}

func (s *AuthService) UpdateDoctor(doctorID primitive.ObjectID, doctor *models.Doctor) error {
	return s.doctorCtrl.Update(doctorID, doctor)
}

func (s *AuthService) ApproveDoctor(doctorID primitive.ObjectID) error {
	doctor, err := s.doctorCtrl.GetByID(doctorID)
	if err != nil {
		return err
	}

	doctor.IsApproved = true
	doctor.Available = true
	return s.doctorCtrl.Update(doctorID, doctor)
}

func (s *AuthService) RejectDoctor(doctorID primitive.ObjectID) error {
	doctor, err := s.doctorCtrl.GetByID(doctorID)
	if err != nil {
		return err
	}

	doctor.IsApproved = false
	doctor.Available = false
	return s.doctorCtrl.Update(doctorID, doctor)
}

func (s *AuthService) ListPatients() ([]*models.Patient, error) {
	return s.patientCtrl.List()
}

func (s *AuthService) GetPatient(patientID primitive.ObjectID) (*models.Patient, error) {
	return s.patientCtrl.GetByID(patientID)
}

func (s *AuthService) GetPatientHistory(patientID primitive.ObjectID) ([]string, error) {
	patient, err := s.patientCtrl.GetByID(patientID)
	if err != nil {
		return nil, err
	}
	return patient.MedicalHistory, nil
}

func (s *AuthService) AddPatientHistory(patientID primitive.ObjectID, entry string) error {
	patient, err := s.patientCtrl.GetByID(patientID)
	if err != nil {
		return err
	}
	patient.MedicalHistory = append(patient.MedicalHistory, entry)
	return s.patientCtrl.Update(patientID, patient)
}

type SystemConfig struct {
	MaintenanceMode bool   `json:"maintenance_mode"`
	Version         string `json:"version"`
}

func (s *AuthService) GetSystemConfig() SystemConfig {
	// Return current system config
	return SystemConfig{
		MaintenanceMode: false,
		Version:         "1.0.0",
	}
}

func (s *AuthService) UpdateSystemConfig(config SystemConfig) error {
	// Implementation to update system config
	// For now, just accept the config without storing
	return nil
}

func (s *AuthService) GetSystemMetrics() (interface{}, error) {
	// Implementation to get system metrics
	return nil, nil
}

func (s *AuthService) GetSystemLogs() (interface{}, error) {
	// Implementation to get system logs
	return nil, nil
}

func (s *AuthService) UpdateAdminPermissions(adminID primitive.ObjectID, permissions []string) error {
	// Implementation to update admin permissions
	return nil
}

func (s *AuthService) RefreshToken(tokenString string) (string, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.jwtSecret), nil
	})

	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", errors.New("invalid token")
	}

	// Create new token with extended expiration
	newClaims := Claims{
		UserID:      claims.UserID,
		Email:       claims.Email,
		Role:        claims.Role,
		Permissions: claims.Permissions,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(4 * time.Hour).Unix(), // 4 hours expiration
			IssuedAt:  time.Now().Unix(),
			NotBefore: time.Now().Unix(),
			Subject:   claims.UserID.Hex(),
		},
	}

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, newClaims)
	return newToken.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) RevokeToken(token string) error {
	// Implementation to revoke JWT token
	return nil
}

func (as *AuthService) validateEmail(email string) error {
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	if !emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}
	return nil
}

func (as *AuthService) isAccountLocked(email string) bool {
	attempts := loginAttempts[email]
	if len(attempts) < 5 {
		return false
	}

	// Check last 5 attempts within 15 minutes
	recentAttempts := 0
	fifteenMinutesAgo := time.Now().Add(-15 * time.Minute)

	for i := len(attempts) - 1; i >= 0 && i >= len(attempts)-5; i-- {
		if !attempts[i].Success && attempts[i].Timestamp.After(fifteenMinutesAgo) {
			recentAttempts++
		}
	}

	return recentAttempts >= 5
}

func (as *AuthService) recordLoginAttempt(email string, success bool) {
	attempt := LoginAttempt{
		Email:     email,
		Timestamp: time.Now(),
		Success:   success,
	}

	attempts := loginAttempts[email]
	// Keep only last 10 attempts
	if len(attempts) >= 10 {
		attempts = attempts[1:]
	}
	attempts = append(attempts, attempt)
	loginAttempts[email] = attempts
}

func (as *AuthService) Login(email, password string) (string, error) {
	if err := as.validateEmail(email); err != nil {
		return "", err
	}

	if as.isAccountLocked(email) {
		return "", ErrAccountLocked
	}

	// Try super admin
	if superAdmin, err := as.superAdminCtrl.GetByEmail(email); err == nil {
		if err := bcrypt.CompareHashAndPassword([]byte(superAdmin.PasswordHash), []byte(password)); err == nil {
			as.recordLoginAttempt(email, true)
			permissions := models.DefaultSuperAdminPermissions()
			return as.GenerateToken(superAdmin.ID, email, "super_admin", permissionsToStrings(permissions))
		}
	}

	// Try admin
	if admin, err := as.adminCtrl.GetByEmail(email); err == nil {
		if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)); err == nil {
			as.recordLoginAttempt(email, true)
			return as.GenerateToken(admin.ID, email, "admin", admin.Permissions)
		}
	}

	// Try doctor
	if doctor, err := as.doctorCtrl.GetByEmail(email); err == nil {
		if err := bcrypt.CompareHashAndPassword([]byte(doctor.PasswordHash), []byte(password)); err == nil {
			if !doctor.IsApproved {
				return "", ErrDoctorNotApproved
			}
			as.recordLoginAttempt(email, true)
			return as.GenerateToken(doctor.ID, email, "doctor", []string{"doctor:self"})
		}
	}

	// Try patient
	if patient, err := as.patientCtrl.GetByEmail(email); err == nil {
		if err := bcrypt.CompareHashAndPassword([]byte(patient.PasswordHash), []byte(password)); err == nil {
			if !patient.IsApproved {
				return "", ErrPatientNotApproved
			}
			as.recordLoginAttempt(email, true)
			return as.GenerateToken(patient.ID, email, "patient", []string{"patient:self", "patient:view"})
		}
	}

	as.recordLoginAttempt(email, false)
	return "", ErrInvalidCredentials
}

func (as *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	log.Printf("[DEBUG] Validating token: %s", tokenString)
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Printf("[DEBUG] Unexpected signing method: %v", token.Method)
			return nil, errors.New("unexpected signing method")
		}
		return []byte(as.jwtSecret), nil
	})

	if err != nil {
		log.Printf("[DEBUG] Token parsing error: %s", err.Error())
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, errors.New("malformed token")
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				return nil, errors.New("token is either expired or not active yet")
			} else {
				return nil, errors.New("token validation error")
			}
		}
		return nil, err
	}

	if !token.Valid {
		log.Printf("[DEBUG] Token is invalid")
		return nil, errors.New("invalid token")
	}

	if claims.UserID.IsZero() {
		log.Printf("[DEBUG] Invalid user ID in token claims")
		return nil, errors.New("invalid user ID in token")
	}

	if claims.Email == "" {
		log.Printf("[DEBUG] Invalid email in token claims")
		return nil, errors.New("invalid email in token")
	}

	if claims.Role == "" {
		log.Printf("[DEBUG] Invalid role in token claims")
		return nil, errors.New("invalid role in token")
	}

	log.Printf("[DEBUG] Token validated successfully: %+v", claims)
	return claims, nil
}

func (as *AuthService) HasPermission(claims *Claims, requiredPermission string) bool {
	if claims.Role == "super_admin" {
		return true
	}

	for _, permission := range claims.Permissions {
		if permission == requiredPermission {
			return true
		}
	}
	return false
}

func (as *AuthService) GenerateToken(userID primitive.ObjectID, email, role string, permissions []string) (string, error) {
	// Set token expiration based on role
	var expiration time.Duration
	switch role {
	case "super_admin":
		expiration = 24 * time.Hour // 24 hours for super admin
	case "admin":
		expiration = 12 * time.Hour // 12 hours for admin
	case "doctor":
		expiration = 8 * time.Hour // 8 hours for doctors
	case "patient":
		expiration = 4 * time.Hour // 4 hours for patients
	default:
		expiration = 1 * time.Hour // 1 hour default
	}

	claims := Claims{
		UserID:      userID,
		Email:       email,
		Role:        role,
		Permissions: permissions,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(expiration).Unix(), // Set expiration time
			IssuedAt:  time.Now().Unix(),                 // Set issued at time
			NotBefore: time.Now().Unix(),                 // Set not before time
			Subject:   userID.Hex(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(as.jwtSecret))
}

func permissionsToStrings(permissions []models.Permission) []string {
	result := make([]string, len(permissions))
	for i, p := range permissions {
		result[i] = string(p)
	}
	return result
}
