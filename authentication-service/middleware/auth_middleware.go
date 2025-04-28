package middleware

import (
	"auth-service/utils"
	"context"
	"fmt"
	"net/http"
	"os"
	"time"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"auth-service/models"
	"auth-service/db"
)

// contextKey defines a custom key type to avoid context collisions
type contextKey string

// UserIDKey is the context key for userID
var UserIDKey = contextKey("userID")

// RequireAuth checks if a valid JWT token exists in the request cookies
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Missing token cookie")
			return
		}

		tokenStr := cookie.Value

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("❌ Unexpected signing method")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid or expired token")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid claims")
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid user ID in token")
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequireRole checks if the user has the required role
func RequireRole(role string, next http.HandlerFunc) http.HandlerFunc {
	return RequireRoles([]string{role}, next)
}

// RequireRoles allows multiple roles to access a route
func RequireRoles(allowedRoles []string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Missing token cookie")
			return
		}
		tokenStr := cookie.Value

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("❌ Unexpected signing method")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid or expired token")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid claims")
			return
		}

		userRole, ok := claims["role"].(string)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid role in token")
			return
		}

		authorized := false
		for _, allowedRole := range allowedRoles {
			if userRole == allowedRole {
				authorized = true
				break
			}
		}

		if !authorized {
			utils.RespondWithError(w, http.StatusForbidden, "⛔ Access denied: insufficient role")
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid user ID in token")
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
func RequirePermission(permission string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(UserIDKey).(string)
		objID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ Invalid user ID")
			return
		}

		collection := db.GetCollection("authdb", "users")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var user models.User
		err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
		if err != nil {
			utils.RespondWithError(w, http.StatusUnauthorized, "❌ User not found")
			return
		}

		// Check if user has required permission
		for _, p := range user.Permissions {
			if p == permission {
				next(w, r)
				return
			}
		}

		utils.RespondWithError(w, http.StatusForbidden, "⛔ Access denied: insufficient permissions")
	}
}
