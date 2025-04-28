package controllers

import (
	"auth-service/db"
	"auth-service/middleware"
	"auth-service/models"
	"auth-service/utils"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// SuperAdminZoneHandler returns basic profile data for super admin
func SuperAdminZoneHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil || user.Role != "super_admin" {
		utils.RespondWithError(w, http.StatusForbidden, "❌ Unauthorized access")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "✅ Welcome SuperAdmin!",
		"profile": map[string]string{
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

// AdminZoneHandler returns basic profile data for admin
func AdminZoneHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var admin models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&admin)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "❌ Admin not found")
		return
	}
	FullName := admin.Name
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "✅ Welcome Admin",
		"profile": map[string]string{
			"name":  FullName,
			"email": admin.Email,
			"role":  admin.Role,
		},
	})
}

// UpdateAdminProfileHandler allows an admin to update their email and password
func UpdateAdminProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	var body struct {
		NewEmail    string `json:"new_email"`
		NewPassword string `json:"new_password"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.NewEmail == "" || body.NewPassword == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), 14)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error hashing password")
		return
	}

	update := bson.M{
		"email":    body.NewEmail,
		"password": string(hashedPassword),
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

// CreateDefaultSuperAdmin creates a super admin if none exists
func CreateDefaultSuperAdmin() {
	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingAdmin models.User
	err := collection.FindOne(ctx, bson.M{"role": "super_admin"}).Decode(&existingAdmin)
	if err == nil {
		fmt.Println("✅ Super Admin already exists")
		return
	}

	defaultPassword := os.Getenv("DEFAULT_ADMIN_PASSWORD")
	if defaultPassword == "" {
		defaultPassword = "admin1234" // fallback لو متغير البيئة مش موجود
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), 14)
	if err != nil {
		fmt.Println("❌ Failed to hash default admin password:", err)
		return
	}

	superAdmin := models.User{
		ID:        primitive.NewObjectID(),
		Name:      "Super Admin",
		Email:     "admin@test.com",
		Password:  string(hashedPassword),
		Role:      "super_admin",
		CreatedAt: time.Now(),
	}

	_, err = collection.InsertOne(ctx, superAdmin)
	if err != nil {
		fmt.Println("❌ Failed to create Super Admin:", err)
		return
	}

	fmt.Println("✅ Default Super Admin created successfully")
}
func CreateAdminHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Double check لو السوبر ادمين فعلا سوبر ادمين
	var superAdmin models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&superAdmin)
	if err != nil || superAdmin.Role != "super_admin" {
		utils.RespondWithError(w, http.StatusForbidden, "❌ Unauthorized access")
		return
	}

	var body struct {
		Name        string   `json:"name"`
		Email       string   `json:"email"`
		Password    string   `json:"password"`
		Permissions []string `json:"permissions"`
	}
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.Name == "" || body.Email == "" || body.Password == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	// Check email
	var existingUser models.User
	err = collection.FindOne(ctx, bson.M{"email": body.Email}).Decode(&existingUser)
	if err == nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Email already registered")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 14)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error hashing password")
		return
	}

	newAdmin := models.User{
		ID:          primitive.NewObjectID(),
		Name:        body.Name,
		Email:       body.Email,
		Password:    string(hashedPassword),
		Role:        "admin",
		Permissions: body.Permissions,
		CreatedAt:   time.Now(),
	}

	_, err = collection.InsertOne(ctx, newAdmin)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to create admin")
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message":  "✅ Admin created successfully",
		"admin_id": newAdmin.ID.Hex(),
	})
}

func AddPermissionHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Double check: هل اللي بيطلب فعلا سوبر أدمين
	var superAdmin models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&superAdmin)
	if err != nil || superAdmin.Role != "super_admin" {
		utils.RespondWithError(w, http.StatusForbidden, "❌ Unauthorized access")
		return
	}

	// Read body
	var body struct {
		AdminID    string `json:"admin_id"`
		Permission string `json:"permission"`
	}
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.AdminID == "" || body.Permission == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	targetObjID, _ := primitive.ObjectIDFromHex(body.AdminID)

	// Add permission to the admin
	_, err = collection.UpdateOne(ctx, bson.M{"_id": targetObjID}, bson.M{
		"$addToSet": bson.M{"permissions": body.Permission},
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to add permission")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Permission added successfully",
	})
}
func RemovePermissionHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var superAdmin models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&superAdmin)
	if err != nil || superAdmin.Role != "super_admin" {
		utils.RespondWithError(w, http.StatusForbidden, "❌ Unauthorized access")
		return
	}

	var body struct {
		AdminID    string `json:"admin_id"`
		Permission string `json:"permission"`
	}
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.AdminID == "" || body.Permission == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	targetObjID, _ := primitive.ObjectIDFromHex(body.AdminID)

	// Remove permission
	_, err = collection.UpdateOne(ctx, bson.M{"_id": targetObjID}, bson.M{
		"$pull": bson.M{"permissions": body.Permission},
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to remove permission")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Permission removed successfully",
	})
}
func UpdatePermissionsHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid user ID")
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var superAdmin models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&superAdmin)
	if err != nil || superAdmin.Role != "super_admin" {
		utils.RespondWithError(w, http.StatusForbidden, "❌ Unauthorized access")
		return
	}

	var body struct {
		AdminID     string   `json:"admin_id"`
		Permissions []string `json:"permissions"`
	}
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.AdminID == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	targetObjID, _ := primitive.ObjectIDFromHex(body.AdminID)

	// Set new permissions
	_, err = collection.UpdateOne(ctx, bson.M{"_id": targetObjID}, bson.M{
		"$set": bson.M{"permissions": body.Permissions},
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to update permissions")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Permissions updated successfully",
	})
}

