package routes

import (
	"healthcare/authentication-service/handlers"

	"net/http"

	"github.com/gin-gonic/gin"
)

// wrapHandler converts a net/http handler func to gin.HandlerFunc
func wrapHandler(h func(http.ResponseWriter, *http.Request)) gin.HandlerFunc {
	return func(c *gin.Context) {
		h(c.Writer, c.Request)
	}
}

// Gin middleware for CORS
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

// Gin middleware for logging
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Log request details
		c.Next()
	}
}

func RegisterRoutes(router *gin.Engine, authHandler *handlers.AuthHandler, healthHandler *handlers.HealthHandler, socialAuthHandler *handlers.SocialAuthHandler) {
	// Apply global middleware
	router.Use(CORSMiddleware())
	router.Use(LoggingMiddleware())

	// Health check endpoints
	router.GET("/health", wrapHandler(healthHandler.Check))
	router.GET("/api/v1/health", wrapHandler(healthHandler.Check))

	api := router.Group("/api/v1")

	// Public Authentication Routes
	auth := api.Group("/auth")
	{
		auth.POST("/login", wrapHandler(authHandler.Login))
		auth.POST("/initialize-super-admin", wrapHandler(authHandler.InitializeSuperAdmin))
		auth.POST("/refresh", wrapHandler(authHandler.RefreshToken))
		auth.POST("/revoke", wrapHandler(authHandler.RevokeToken))
		auth.GET("/google", wrapHandler(socialAuthHandler.GoogleLogin))
		auth.GET("/google/callback", wrapHandler(socialAuthHandler.GoogleCallback))
		auth.GET("/facebook", wrapHandler(socialAuthHandler.FacebookLogin))
		auth.GET("/facebook/callback", wrapHandler(socialAuthHandler.FacebookCallback))
	}
}
