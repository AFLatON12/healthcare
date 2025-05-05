package middleware

import (
	"context"
	"net/http"
	"strings"

	"appointment-service/clients"

	"github.com/gin-gonic/gin"
)

type contextKey string

const ClaimsContextKey = contextKey("claims")

func AuthMiddleware(authClient *clients.AuthClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		token := parts[1]
		valid, err := authClient.VerifyToken(token)
		if err != nil || !valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Optionally, get user info and set in context if needed
		userInfo, err := authClient.GetUserInfo(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Failed to get user info"})
			return
		}

		ctx := context.WithValue(c.Request.Context(), ClaimsContextKey, userInfo)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
