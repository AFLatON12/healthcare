package middleware

import (
	"context"
	"log"
	"net/http"
	"strings"

	"healthcare/authentication-service/services"

	"github.com/gorilla/mux"
)

type contextKey string

const ClaimsContextKey = contextKey("claims")

func AuthMiddleware(authService *services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("[DEBUG] Incoming request: %s %s", r.Method, r.URL.Path)
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				log.Printf("[DEBUG] Missing Authorization header")
				http.Error(w, "Authorization header required", http.StatusUnauthorized)
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				log.Printf("[DEBUG] Invalid Authorization header format")
				http.Error(w, "Authorization header format must be Bearer {token}", http.StatusUnauthorized)
				return
			}

			token := parts[1]
			log.Printf("[DEBUG] Extracted token: %s", token)
			claims, err := authService.ValidateToken(token)
			if err != nil {
				log.Printf("[DEBUG] Token validation failed: %s", err.Error())
				http.Error(w, "Invalid or expired token: "+err.Error(), http.StatusUnauthorized)
				return
			}

			log.Printf("[DEBUG] Token validated successfully: %+v", claims)
			ctx := context.WithValue(r.Context(), ClaimsContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequirePermission middleware to check for specific permission
func RequirePermission(authService *services.AuthService, permission string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(ClaimsContextKey).(*services.Claims)
			if !ok || claims == nil {
				log.Printf("[DEBUG] Missing or invalid claims in context")
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			log.Printf("[DEBUG] Checking permissions for role: %s", claims.Role)
			if claims.Role == "patient" {
				vars := mux.Vars(r)
				patientIDStr, exists := vars["id"]
				if exists && patientIDStr == claims.UserID.Hex() {
					log.Printf("[DEBUG] Patient accessing own data")
					next.ServeHTTP(w, r)
					return
				}
				log.Printf("[DEBUG] Patient attempting to access unauthorized data")
				http.Error(w, "Forbidden: patients can only access their own data", http.StatusForbidden)
				return
			}

			log.Printf("[DEBUG] Required permission: %s", permission)
			log.Printf("[DEBUG] User permissions: %v", claims.Permissions)
			if !authService.HasPermission(claims, permission) {
				log.Printf("[DEBUG] Insufficient permissions: required=%s, user_permissions=%v", permission, claims.Permissions)
				http.Error(w, "Forbidden: insufficient permissions", http.StatusForbidden)
				return
			}

			log.Printf("[DEBUG] Permission check passed")
			next.ServeHTTP(w, r)
		})
	}
}

// RequireRole middleware to check for specific role
func RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(ClaimsContextKey).(*services.Claims)
			if !ok || claims == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			if claims.Role != role {
				http.Error(w, "Forbidden: insufficient role", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
