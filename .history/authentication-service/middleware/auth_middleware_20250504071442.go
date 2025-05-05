package middleware

import (
	"log"
	"net/http"
	"strings"

	"healthcare/authentication-service/services"

	"github.com/gin-gonic/gin"
)

func GinJWTMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("[DEBUG] Incoming request: %s %s", c.Request.Method, c.Request.URL.Path)
		authHeader := c.GetHeader("Authorization")
		// Add support for session and API key validation
		if authHeader == "" {
			sessionID, err := c.Cookie("session_id")
			if err == nil {
				log.Printf("[DEBUG] Validating session ID: %s", sessionID)
				userID, err := authService.ValidateSession(sessionID)
				if err == nil {
					log.Printf("[DEBUG] Session validated successfully for user: %s", userID)
					c.Set("user_id", userID)
					c.Next()
					return
				}
			}

			apiKey := c.GetHeader("X-API-Key")
			if apiKey != "" {
				log.Printf("[DEBUG] Validating API key: %s", apiKey)
				userID, err := authService.ValidateAPIKey(apiKey)
				if err == nil {
					log.Printf("[DEBUG] API key validated successfully for user: %s", userID)
					c.Set("user_id", userID)
					c.Next()
					return
				}
			}

			log.Printf("[DEBUG] Missing or invalid authentication")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			log.Printf("[DEBUG] Invalid Authorization header format")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		token := parts[1]
		log.Printf("[DEBUG] Extracted token: %s", token)
		claims, err := authService.ValidateToken(token)
		if err != nil {
			log.Printf("[DEBUG] Token validation failed: %s", err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token: " + err.Error()})
			return
		}

		log.Printf("[DEBUG] Token validated successfully: %+v", claims)
		// Add debug logs to print token and claims
		log.Printf("[DEBUG] Token: %s", token)
		log.Printf("[DEBUG] Claims: %+v", claims)
		c.Set("claims", claims)
		c.Next()
	}
}
