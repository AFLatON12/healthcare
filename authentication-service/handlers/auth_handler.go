package handlers

import (
	"encoding/json"
	"net/http"

	"healthcare/authentication-service/models"
	"healthcare/authentication-service/services"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthHandler struct {
	authService *services.AuthService
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		ID          string   `json:"id"`
		Email       string   `json:"email"`
		Role        string   `json:"role"`
		Permissions []string `json:"permissions"`
	} `json:"user"`
}

type InitializeSuperAdminRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type CreateAdminRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type RegisterDoctorRequest struct {
	Email           string   `json:"email"`
	Password        string   `json:"password"`
	Name            string   `json:"name"`
	Specialization  string   `json:"specialization"`
	LicenseNumber   string   `json:"license_number"`
	Qualifications  []string `json:"qualifications"`
	ExperienceYears int      `json:"experience_years"`
}

type RefreshTokenRequest struct {
	Token string `json:"token"`
}

type RefreshTokenResponse struct {
	Token string `json:"token"`
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	claims, err := h.authService.ValidateToken(token)
	if err != nil {
		http.Error(w, "Error validating token", http.StatusInternalServerError)
		return
	}

	response := LoginResponse{
		Token: token,
	}
	response.User.ID = claims.UserID.Hex()
	response.User.Email = claims.Email
	response.User.Role = claims.Role
	response.User.Permissions = claims.Permissions

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (h *AuthHandler) InitializeSuperAdmin(w http.ResponseWriter, r *http.Request) {
	var req InitializeSuperAdminRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.authService.InitializeSuperAdmin(req.Email, req.Password); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Login the super admin to get the token
	token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	claims, err := h.authService.ValidateToken(token)
	if err != nil {
		http.Error(w, "Error validating token", http.StatusInternalServerError)
		return
	}

	response := LoginResponse{
		Token: token,
	}
	response.User.ID = claims.UserID.Hex()
	response.User.Email = claims.Email
	response.User.Role = claims.Role
	response.User.Permissions = claims.Permissions

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *AuthHandler) CreateAdmin(w http.ResponseWriter, r *http.Request) {
	var req CreateAdminRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get the creator's ID from the context (set by auth middleware)
	claims := r.Context().Value("claims").(*services.Claims)
	if claims == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err := h.authService.CreateAdmin(claims.UserID, req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admin created successfully",
		"email":   req.Email,
	})
}

func (h *AuthHandler) ListAdmins(w http.ResponseWriter, r *http.Request) {
	admins, err := h.authService.ListAdmins()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"admins": admins,
		"total":  len(admins),
	})
}

func (h *AuthHandler) GetAdmin(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	adminID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid admin ID", http.StatusBadRequest)
		return
	}

	admin, err := h.authService.GetAdmin(adminID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(admin)
}

func (h *AuthHandler) UpdateAdmin(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	adminID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid admin ID", http.StatusBadRequest)
		return
	}

	var updateReq struct {
		Name        string   `json:"name"`
		Permissions []string `json:"permissions"`
	}
	if err := json.NewDecoder(r.Body).Decode(&updateReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	admin, err := h.authService.GetAdmin(adminID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	admin.Username = updateReq.Name
	if updateReq.Permissions != nil {
		admin.Permissions = updateReq.Permissions
	}

	if err := h.authService.UpdateAdmin(adminID, admin); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admin updated successfully",
	})
}

func (h *AuthHandler) DeleteAdmin(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	adminID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid admin ID", http.StatusBadRequest)
		return
	}

	if err := h.authService.DeleteAdmin(adminID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admin deleted successfully",
	})
}

func (h *AuthHandler) RegisterDoctor(w http.ResponseWriter, r *http.Request) {
	var req RegisterDoctorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Email == "" || req.Password == "" || req.Name == "" || req.Specialization == "" || req.LicenseNumber == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	doctor := &models.Doctor{
		Email:           req.Email,
		Name:            req.Name,
		Specialization:  req.Specialization,
		LicenseNumber:   req.LicenseNumber,
		Qualifications:  req.Qualifications,
		ExperienceYears: req.ExperienceYears,
		IsApproved:      false,
		Available:       true,
	}

	if err := h.authService.RegisterDoctor(doctor, req.Password); err != nil {
		http.Error(w, "Failed to register doctor: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Doctor registration successful. Awaiting approval.",
		"doctor": map[string]interface{}{
			"email":            doctor.Email,
			"name":             doctor.Name,
			"specialization":   doctor.Specialization,
			"license_number":   doctor.LicenseNumber,
			"qualifications":   doctor.Qualifications,
			"experience_years": doctor.ExperienceYears,
		},
	})
}

func (h *AuthHandler) ListDoctors(w http.ResponseWriter, r *http.Request) {
	// Get query parameters for filtering
	query := r.URL.Query()
	filter := bson.M{}

	if approved := query.Get("approved"); approved != "" {
		filter["is_approved"] = approved == "true"
	}
	if available := query.Get("available"); available != "" {
		filter["available"] = available == "true"
	}
	if specialization := query.Get("specialization"); specialization != "" {
		filter["specialization"] = specialization
	}

	doctors, err := h.authService.ListDoctors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"doctors": doctors,
		"total":   len(doctors),
	})
}

func (h *AuthHandler) ListApprovedDoctors(w http.ResponseWriter, r *http.Request) {
	doctors, err := h.authService.ListApprovedDoctors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"doctors": doctors,
		"total":   len(doctors),
	})
}

func (h *AuthHandler) ListAvailableDoctors(w http.ResponseWriter, r *http.Request) {
	doctors, err := h.authService.ListAvailableDoctors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"doctors": doctors,
		"total":   len(doctors),
	})
}

func (h *AuthHandler) ListPendingDoctors(w http.ResponseWriter, r *http.Request) {
	doctors, err := h.authService.ListPendingDoctors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"doctors": doctors,
		"total":   len(doctors),
	})
}

func (h *AuthHandler) GetDoctor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	doctorID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	doctor, err := h.authService.GetDoctor(doctorID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(doctor)
}

func (h *AuthHandler) UpdateDoctor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	doctorID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	var updateReq struct {
		Name            string   `json:"name"`
		Specialization  string   `json:"specialization"`
		LicenseNumber   string   `json:"license_number"`
		Qualifications  []string `json:"qualifications"`
		ExperienceYears int      `json:"experience_years"`
		Phone           string   `json:"phone"`
		Bio             string   `json:"bio"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updateReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	doctor, err := h.authService.GetDoctor(doctorID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Update fields
	doctor.Name = updateReq.Name
	doctor.Specialization = updateReq.Specialization
	doctor.LicenseNumber = updateReq.LicenseNumber
	doctor.Qualifications = updateReq.Qualifications
	doctor.ExperienceYears = updateReq.ExperienceYears
	doctor.Phone = updateReq.Phone
	doctor.Bio = updateReq.Bio

	if err := h.authService.UpdateDoctor(doctorID, doctor); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Doctor updated successfully",
	})
}

func (h *AuthHandler) ApproveDoctor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	doctorID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	if err := h.authService.ApproveDoctor(doctorID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Doctor approved successfully",
	})
}

func (h *AuthHandler) RejectDoctor(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	doctorID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	if err := h.authService.RejectDoctor(doctorID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Doctor rejected successfully",
	})
}

func (h *AuthHandler) RegisterPatient(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email             string `json:"email"`
		Password          string `json:"password"`
		Name              string `json:"name"`
		Phone             string `json:"phone"`
		Address           string `json:"address"`
		DateOfBirth       string `json:"date_of_birth"`
		Gender            string `json:"gender"`
		InsuranceProvider string `json:"insurance_provider"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	err := h.authService.RegisterPatient(
		req.Email,
		req.Password,
		req.Name,
		req.Phone,
		req.Address,
		req.DateOfBirth,
		req.Gender,
		req.InsuranceProvider,
	)
	if err != nil {
		http.Error(w, "Failed to register patient: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Automatically login the patient after registration to generate token and user info
	token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		http.Error(w, "Failed to login after registration: "+err.Error(), http.StatusInternalServerError)
		return
	}

	claims, err := h.authService.ValidateToken(token)
	if err != nil {
		http.Error(w, "Error validating token", http.StatusInternalServerError)
		return
	}

	response := LoginResponse{
		Token: token,
	}
	response.User.ID = claims.UserID.Hex()
	response.User.Email = claims.Email
	response.User.Role = claims.Role
	response.User.Permissions = claims.Permissions

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *AuthHandler) ListPatients(w http.ResponseWriter, r *http.Request) {
	patients, err := h.authService.ListPatients()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"patients": patients,
		"total":    len(patients),
	})
}

func (h *AuthHandler) GetPatient(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	patientID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	patient, err := h.authService.GetPatient(patientID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(patient)
}

func (h *AuthHandler) GetPatientHistory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	patientID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	history, err := h.authService.GetPatientHistory(patientID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"history": history,
	})
}

func (h *AuthHandler) AddPatientHistory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	patientID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Entry string `json:"entry"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.authService.AddPatientHistory(patientID, req.Entry); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "History entry added successfully",
	})
}

func (h *AuthHandler) GetSystemConfig(w http.ResponseWriter, r *http.Request) {
	config := h.authService.GetSystemConfig()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(config)
}

func (h *AuthHandler) UpdateSystemConfig(w http.ResponseWriter, r *http.Request) {
	var config services.SystemConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	h.authService.UpdateSystemConfig(config)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "System configuration updated successfully",
	})
}

func (h *AuthHandler) GetSystemMetrics(w http.ResponseWriter, r *http.Request) {
	metrics, err := h.authService.GetSystemMetrics()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(metrics)
}

func (h *AuthHandler) GetSystemLogs(w http.ResponseWriter, r *http.Request) {
	logs, err := h.authService.GetSystemLogs()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"logs": logs,
	})
}

func (h *AuthHandler) UpdateAdminPermissions(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	adminID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, "Invalid admin ID", http.StatusBadRequest)
		return
	}

	var updateReq struct {
		Permissions []string `json:"permissions"`
	}
	if err := json.NewDecoder(r.Body).Decode(&updateReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.authService.UpdateAdminPermissions(adminID, updateReq.Permissions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Admin permissions updated successfully",
	})
}

func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req RefreshTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	newToken, err := h.authService.RefreshToken(req.Token)
	if err != nil {
		http.Error(w, "Failed to refresh token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(RefreshTokenResponse{
		Token: newToken,
	})
}

func (h *AuthHandler) RevokeToken(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.authService.RevokeToken(req.Token); err != nil {
		http.Error(w, "Failed to revoke token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Token revoked successfully",
	})
}
