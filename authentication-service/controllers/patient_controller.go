package controllers

import (
	"auth-service/db"
	"auth-service/middleware"
	"auth-service/models"
	"auth-service/utils"
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// PatientZoneHandler returns basic profile data for patient
func PatientZoneHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var patient models.Patient
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&patient)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "❌ Patient not found")
		return
	}
	FullName := patient.FirstName + " " + patient.LastName

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "✅ Welcome Patient",
		"profile": map[string]string{
			"name":  FullName,
			"email": patient.Email,
			"role":  patient.Role,
		},
	})
}

// PatientRegisterHandler handles patient registration
func PatientRegisterHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		Email       string `json:"email"`
		Password    string `json:"password"`
		DateOfBirth string `json:"dob"`
		PhoneNumber string `json:"phone_number"`
		Address     string `json:"address"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	// ✅ Basic Validation
	if body.FirstName == "" || body.LastName == "" || body.Email == "" || body.Password == "" || !strings.Contains(body.Email, "@") || len(body.Password) < 8 {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input data")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// ✅ Check if email already exists
	var existingUser models.Patient
	err = collection.FindOne(ctx, bson.M{"email": body.Email}).Decode(&existingUser)
	if err == nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Email already registered")
		return
	}

	// ✅ Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 14)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error hashing password")
		return
	}

	// ✅ Create new Patient
	newPatient := models.Patient{
		ID:          primitive.NewObjectID(),
		FirstName:   body.FirstName,
		LastName:    body.LastName,
		Email:       body.Email,
		Password:    string(hashedPassword),
		DateOfBirth: body.DateOfBirth,
		PhoneNumber: body.PhoneNumber,
		Address:     body.Address,
		Role:        "patient", // Automatically set role
		CreatedAt:   time.Now(),
	}

	_, err = collection.InsertOne(ctx, newPatient)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to register patient")
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message":    "✅ Patient registered successfully",
		"patient_id": newPatient.ID.Hex(),
	})
}

// ProfileHandler returns the profile of the logged-in patient
func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := utils.ExtractUserIDFromRequest(r)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var patient models.Patient // ✅ بدل User هنا
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&patient)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "❌ Patient not found")
		return
	}

	patient.Password = "" // مهم نشيل الباسورد قبل الإرسال

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(patient)
}

// ChangePasswordHandler allows a patient to change their password
func ChangePasswordHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := utils.ExtractUserIDFromRequest(r)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	var body struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}

	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.CurrentPassword == "" || body.NewPassword == "" || len(body.NewPassword) < 8 {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid password input")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var patient models.Patient // ✅ بدل User هنا
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&patient)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "❌ Patient not found")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(patient.Password), []byte(body.CurrentPassword))
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "❌ Incorrect current password")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), 14)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error hashing new password")
		return
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{
		"$set": bson.M{"password": string(hashedPassword)},
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to update password")
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Password changed successfully",
	})
}

func UpdatePatientProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	var body struct {
		PhoneNumber string `json:"phone_number"`
		Address     string `json:"address"`
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
		"phone_number": body.PhoneNumber,
		"address":      body.Address,
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
