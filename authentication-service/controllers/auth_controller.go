package controllers

import (
	"auth-service/db"
	"auth-service/models"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid input",
		})
		return
	}

	// ✅ Basic validation
	if user.Name == "" || user.Email == "" || user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ All fields are required",
		})
		return
	}

	// ✅ Validate email format (basic check)
	if !strings.Contains(user.Email, "@") {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid email format",
		})
		return
	}

	// ✅ Validate role
	validRoles := map[string]bool{
		"admin":   true,
		"doctor":  true,
		"patient": true,
	}

	if !validRoles[user.Role] {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid role. Must be 'admin', 'doctor', or 'patient'",
		})
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check if user exists
	var existingUser models.User
	err = collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Email already exists",
		})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Error hashing password",
		})
		return
	}
	user.Password = string(hashedPassword)
	user.ID = primitive.NewObjectID()

	// Insert user
	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		log.Println("❌ DB insert error:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Error saving user",
		})
		return
	}

	// Return success
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ User registered successfully",
		"id":      user.ID.Hex(),
	})

}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil || creds.Email == "" || creds.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Email and password are required",
		})
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err = collection.FindOne(ctx, bson.M{"email": creds.Email}).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Email not found",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Incorrect password",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.Hex(),
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	secret := os.Getenv("JWT_SECRET")
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Failed to generate token",
		})
		return
	}

	// Set cookie with proper settings
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   86400, // 24 hours in seconds
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Login successful",
		"role":    user.Role,
	})
}

func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Missing token cookie",
		})
		return
	}
	tokenStr := cookie.Value

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid or expired token",
		})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to extract claims",
		})
		return
	}

	email := claims["email"].(string)
	userID := claims["user_id"].(string)
	role := claims["role"].(string)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "👤 Authenticated profile data",
		"user_id": userID,
		"email":   email,
		"role":    role, // ✅ هنا
	})
}
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "", // مسح التوكن
		Path:     "/",
		Expires:  time.Unix(0, 0), // تاريخ منتهي
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
	json.NewEncoder(w).Encode(map[string]string{
		"message": "👋 Logged out successfully",
	})
}
func DoctorZoneHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{
		"message": "🩺 Welcome Doctor! This area is restricted.",
	})
}
func PatientZoneHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{
		"message": "🧑‍⚕️ Welcome Patient! This is your private zone.",
	})
}
func ChangePasswordHandler(w http.ResponseWriter, r *http.Request) {
	// 1. فك التوكن من الكوكي
	cookie, err := r.Cookie("token")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Missing token",
		})

		return
	}
	tokenStr := cookie.Value

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid token",
		})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid claims",
		})
		return
	}

	userID := claims["user_id"].(string)
	uid, _ := primitive.ObjectIDFromHex(userID)

	// 2. استقبل البيانات من الطلب
	var body struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.CurrentPassword == "" || body.NewPassword == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid input",
		})
		return
	}

	// 3. تحقق من المستخدم وكلمة السر الحالية
	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err = collection.FindOne(ctx, bson.M{"_id": uid}).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ User not found",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.CurrentPassword))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Incorrect current password",
		})
		return
	}

	// 4. شفر الباسورد الجديدة وحدثها
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), 14)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Error hashing new password",
		})
		return
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": uid}, bson.M{
		"$set": bson.M{"password": string(hashedPassword)},
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Failed to update password",
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Password changed successfully",
	})
}

func AdminZoneHandler(w http.ResponseWriter, r *http.Request) {
	// ✅ التحقق من أن المستخدم أدمن
	userID, ok := r.Context().Value("userID").(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ User ID not found in context",
		})
		return
	}

	collection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Invalid user ID format",
		})
		return
	}

	var user models.User
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ User not found",
		})
		return
	}

	if user.Role != "admin" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "❌ Access denied. Admin role required",
		})
		return
	}

	// ✅ إرجاع بيانات منطقة الأدمن
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "✅ Welcome to Admin Zone",
		"user": map[string]interface{}{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
