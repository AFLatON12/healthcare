package routes

import (
	"healthcare/authentication-service/handlers"
	"healthcare/authentication-service/models"
	"healthcare/authentication-service/services"

	"net/http"

	"github.com/gin-gonic/gin"
)

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

// Gin middleware for permission check
func RequirePermission(authService *services.AuthService, permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("claims")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userClaims := claims.(*services.Claims)

		if userClaims.Role == "patient" {
			patientID := c.Param("id")
			if patientID == userClaims.UserID.Hex() {
				c.Next()
				return
			}
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: patients can only access their own data"})
			return
		}

		if !authService.HasPermission(userClaims, permission) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient permissions"})
			return
		}

		c.Next()
	}
}

// Gin middleware for role check
func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("claims")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userClaims := claims.(*services.Claims)

		if userClaims.Role != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient role"})
			return
		}

		c.Next()
	}
}

func RegisterRoutes(router *gin.Engine, authHandler *handlers.AuthHandler, healthHandler *handlers.HealthHandler, socialAuthHandler *handlers.SocialAuthHandler, authService *services.AuthService) {
	// Apply global middleware
	router.Use(CORSMiddleware())
	router.Use(LoggingMiddleware())

	// Health check endpoints
	router.GET("/health", healthHandler.Check)
	router.GET("/api/v1/health", healthHandler.Check)

	api := router.Group("/api/v1")

	// Public Authentication Routes
	auth := api.Group("/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/initialize-super-admin", authHandler.InitializeSuperAdmin)
		auth.POST("/refresh", authHandler.RefreshToken)
		auth.POST("/revoke", authHandler.RevokeToken)
		auth.GET("/google", socialAuthHandler.GoogleLogin)
		auth.GET("/google/callback", socialAuthHandler.GoogleCallback)
		auth.GET("/facebook", socialAuthHandler.FacebookLogin)
		auth.GET("/facebook/callback", socialAuthHandler.FacebookCallback)
	}

	// Admin Management Routes
	admins := api.Group("/admins")
	admins.Use(RequirePermission(authService, string(models.PermissionAdminCreate)))
	{
		admins.POST("", authHandler.CreateAdmin)
		admins.GET("", RequirePermission(authService, string(models.PermissionAdminList)), authHandler.ListAdmins)
		admins.GET("/:id", RequirePermission(authService, string(models.PermissionAdminView)), authHandler.GetAdmin)
		admins.PUT("/:id", RequirePermission(authService, string(models.PermissionAdminUpdate)), authHandler.UpdateAdmin)
		admins.DELETE("/:id", RequirePermission(authService, string(models.PermissionAdminDelete)), authHandler.DeleteAdmin)
		admins.PUT("/:id/permissions", RequireRole("super_admin"), authHandler.UpdateAdminPermissions)
	}

	// Doctor Management Routes
	doctors := api.Group("/doctors")
	doctors.POST("/register", authHandler.RegisterDoctor)
	doctors.GET("", RequirePermission(authService, string(models.PermissionDoctorList)), authHandler.ListDoctors)
	doctors.GET("/pending", RequirePermission(authService, string(models.PermissionDoctorList)), authHandler.ListPendingDoctors)
	doctors.GET("/:id", RequirePermission(authService, string(models.PermissionDoctorView)), authHandler.GetDoctor)
	doctors.POST("/:id/approve", RequirePermission(authService, string(models.PermissionDoctorApprove)), authHandler.ApproveDoctor)
	doctors.POST("/:id/reject", RequirePermission(authService, string(models.PermissionDoctorReject)), authHandler.RejectDoctor)
	doctors.PUT("/:id", RequirePermission(authService, string(models.PermissionDoctorUpdate)), authHandler.UpdateDoctor)

	// Patient Management Routes
	patients := api.Group("/patients")
	patients.POST("/register", authHandler.RegisterPatient)
	patients.GET("", RequirePermission(authService, string(models.PermissionPatientList)), authHandler.ListPatients)
	patients.GET("/:id", RequirePermission(authService, string(models.PermissionPatientView)), authHandler.GetPatient)
	patients.GET("/:id/history", RequirePermission(authService, string(models.PermissionPatientHistory)), authHandler.GetPatientHistory)
	patients.POST("/:id/history", RequirePermission(authService, string(models.PermissionPatientHistory)), authHandler.AddPatientHistory)

	// System Management Routes
	system := api.Group("/system")
	system.GET("/config", RequirePermission(authService, string(models.PermissionSystemConfig)), authHandler.GetSystemConfig)
	system.PUT("/config", RequirePermission(authService, string(models.PermissionSystemConfig)), authHandler.UpdateSystemConfig)
	system.GET("/metrics", RequirePermission(authService, string(models.PermissionSystemMetrics)), authHandler.GetSystemMetrics)
	system.GET("/logs", RequirePermission(authService, string(models.PermissionSystemLogs)), authHandler.GetSystemLogs)
}
