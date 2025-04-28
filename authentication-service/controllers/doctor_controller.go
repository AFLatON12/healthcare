package controllers

import (
	"auth-service/db"
	"auth-service/middleware"
	"auth-service/models"
	"auth-service/uploader"
	"auth-service/utils"
	"context"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// DoctorZoneHandler returns basic profile data for doctor
func DoctorZoneHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var doctor models.Doctor
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&doctor)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "❌ Doctor not found")
		return
	}
	FullName := doctor.FirstName + " " + doctor.LastName

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "✅ Welcome Doctor",
		"profile": map[string]string{
			"name":  FullName,
			"email": doctor.Email,
			"role":  doctor.Role,
		},
	})
}

// DoctorRegisterHandler handles doctor registration
func DoctorRegisterHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Could not parse multipart form")
		return
	}

	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	email := r.FormValue("email")
	password := r.FormValue("password")
	phoneNumber := r.FormValue("phone_number")
	dob := r.FormValue("dob")
	gender := r.FormValue("gender")
	address := r.FormValue("address")
	specialization := r.FormValue("specialization")
	licenseNumber := r.FormValue("license_number")
	experienceYears := r.FormValue("experience_years")
	education := r.FormValue("education")
	currentWorkplace := r.FormValue("current_workplace")
	languagesSpoken := r.FormValue("languages_spoken")
	availability := r.FormValue("availability")

	// ✅ Basic validation
	if firstName == "" || lastName == "" || email == "" || password == "" || !strings.Contains(email, "@") || len(password) < 8 {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input data")
		return
	}

	collection := db.GetCollection(os.Getenv("DB_NAME"), "doctors")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// ✅ Check if email already exists
	var existingDoctor models.Doctor
	err = collection.FindOne(ctx, bson.M{"email": email}).Decode(&existingDoctor)
	if err == nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Email already registered")
		return
	}

	// ✅ Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error hashing password")
		return
	}

	file, fileHeader, err := r.FormFile("resume")
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Error uploading file")
		return
	}
	defer file.Close()

	// ✅ Check file type is PDF
	if !isPDF(fileHeader) {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Only PDF files are allowed for resume")
		return
	}

	tempFile, err := os.CreateTemp("uploads", "resume-*.pdf")
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error creating temp file")
		return
	}
	defer os.Remove(tempFile.Name())
	defer tempFile.Close()

	_, err = io.Copy(tempFile, file)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error saving uploaded file")
		return
	}

	uploaderService, err := uploader.NewUploader()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to initialize uploader")
		return
	}

	uploadResult, err := uploaderService.UploadPDFToCloudinary(tempFile.Name())
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to upload resume")
		return
	}

	newDoctor := models.Doctor{
		ID:               primitive.NewObjectID(),
		FirstName:        firstName,
		LastName:         lastName,
		Email:            email,
		Password:         string(hashedPassword),
		PhoneNumber:      phoneNumber,
		DateOfBirth:      dob,
		Gender:           gender,
		Address:          address,
		Specialization:   specialization,
		LicenseNumber:    licenseNumber,
		ExperienceYears:  experienceYears,
		Education:        education,
		CurrentWorkplace: currentWorkplace,
		LanguagesSpoken:  languagesSpoken,
		Availability:     availability,
		ResumeURL:        uploadResult.SecureURL,
		ResumePublicID:   uploadResult.PublicID,
		Role:             "pending_doctor",
		CreatedAt:        time.Now(),
	}

	_, err = collection.InsertOne(ctx, newDoctor)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to save doctor")
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message":   "✅ Doctor registration submitted successfully",
		"doctor_id": newDoctor.ID.Hex(),
	})
}

// Helper to check if uploaded file is a PDF
func isPDF(fileHeader *multipart.FileHeader) bool {
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	return ext == ".pdf"
}

func UpdateDoctorProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	var body struct {
		PhoneNumber      string `json:"phone_number"`
		Address          string `json:"address"`
		ExperienceYears  string `json:"experience_years"`
		Education        string `json:"education"`
		CurrentWorkplace string `json:"current_workplace"`
		LanguagesSpoken  string `json:"languages_spoken"`
		Availability     string `json:"availability"`
	}

	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"phone_number":      body.PhoneNumber,
		"address":           body.Address,
		"experience_years":  body.ExperienceYears,
		"education":         body.Education,
		"current_workplace": body.CurrentWorkplace,
		"languages_spoken":  body.LanguagesSpoken,
		"availability":      body.Availability,
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": update})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to update profile")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Profile updated successfully",
	})
}
