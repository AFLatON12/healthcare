package controllers

import (
    "auth-service/db"
    "auth-service/models"
    "auth-service/utils"
    "context"
    "encoding/json"
    "net/http"
    "os"
    "strings"
    "time"
    "fmt"
    "auth-service/mailer"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "golang.org/x/crypto/bcrypt"
)

// LoginHandler handles user login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var credentials struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    err := json.NewDecoder(r.Body).Decode(&credentials)
    if err != nil {
        utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
        return
    }

    if credentials.Email == "" || credentials.Password == "" || !strings.Contains(credentials.Email, "@") || len(credentials.Password) < 8 {
        utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid email or weak password")
        return
    }

    collection := db.GetCollection("authdb", "users")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    var user models.User
    err = collection.FindOne(ctx, bson.M{"email": credentials.Email}).Decode(&user)
    if err != nil {
        utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid credentials")
        return
    }

    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password))
    if err != nil {
        utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid credentials")
        return
    }

    token, err := utils.GenerateToken(user.ID.Hex(), user.Role)
    if err != nil {
        utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error generating token")
        return
    }

    // ✅ Set secure cookie correctly
    isProduction := os.Getenv("ENV") == "production"

    http.SetCookie(w, &http.Cookie{
        Name:     "token",
        Value:    token,
        Path:     "/",
        HttpOnly: true,
        Secure:   isProduction, // Secure true only in Production
        SameSite: http.SameSiteLaxMode,
        MaxAge:   86400,
        Expires:  time.Now().Add(24 * time.Hour),
    })

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "message": "✅ Login successful",
        "role":    user.Role,
    })
}

// LogoutHandler handles user logout
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
    isProduction := os.Getenv("ENV") == "production"

    http.SetCookie(w, &http.Cookie{
        Name:     "token",
        Value:    "",
        Path:     "/",
        HttpOnly: true,
        Secure:   isProduction,
        SameSite: http.SameSiteLaxMode,
        MaxAge:   -1,
        Expires:  time.Now().Add(-1 * time.Hour), // Expire immediately
    })

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "message": "✅ Logout successful",
    })
}
func ForgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email string `json:"email"`
	}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.Email == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	usersCollection := db.GetCollection("authdb", "users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err = usersCollection.FindOne(ctx, bson.M{"email": body.Email}).Decode(&user)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "❌ Email not found")
		return
	}

	// Generate Reset Token
	token, err := utils.GenerateRandomToken(32)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to generate reset token")
		return
	}

	resetCollection := db.GetCollection("authdb", "password_reset_tokens")
	resetToken := models.PasswordResetToken{
		ID:        primitive.NewObjectID(),
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: time.Now().Add(30 * time.Minute),
	}

	_, err = resetCollection.InsertOne(ctx, resetToken)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to save reset token")
		return
	}

	// Send Reset Email
	mailerService, _ := mailer.NewMailer()

	resetLink := fmt.Sprintf("%s/reset-password?token=%s", os.Getenv("FRONTEND_URL"), token)
	bodyContent := fmt.Sprintf(`
		<html>
			<body>
				<h2>Reset Your Password</h2>
				<p>Click the link below to reset your password:</p>
				<a href="%s">%s</a>
				<p>This link will expire in 30 minutes.</p>
			</body>
		</html>
	`, resetLink, resetLink)

	err = mailerService.SendMail(user.Email, "Password Reset Request", bodyContent)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to send reset email")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Password reset email sent successfully",
	})
}
func ResetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil || body.Token == "" || body.NewPassword == "" || len(body.NewPassword) < 8 {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid input")
		return
	}

	resetCollection := db.GetCollection("authdb", "password_reset_tokens")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var resetToken models.PasswordResetToken
	err = resetCollection.FindOne(ctx, bson.M{"token": body.Token}).Decode(&resetToken)
	if err != nil || time.Now().After(resetToken.ExpiresAt) {
		utils.RespondWithError(w, http.StatusBadRequest, "❌ Invalid or expired token")
		return
	}

	usersCollection := db.GetCollection("authdb", "users")

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), 14)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Error hashing new password")
		return
	}

	_, err = usersCollection.UpdateOne(ctx, bson.M{"_id": resetToken.UserID}, bson.M{
		"$set": bson.M{"password": string(hashedPassword)},
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "❌ Failed to update password")
		return
	}

	// Delete used token
	_, _ = resetCollection.DeleteOne(ctx, bson.M{"_id": resetToken.ID})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Password reset successful",
	})
}


