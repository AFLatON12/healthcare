package routes

import (
	"github.com/gorilla/mux"
	"healthcare/authentication-service/handlers"
	"healthcare/authentication-service/middleware"
	"healthcare/authentication-service/models"
	"healthcare/authentication-service/services"
	"net/http"
)

func RegisterRoutes(router *mux.Router, authHandler *handlers.AuthHandler, healthHandler *handlers.HealthHandler, socialAuthHandler *handlers.SocialAuthHandler, authService *services.AuthService, patientCtrl *services.PatientController) {
	// Add global middleware
	router.Use(corsMiddleware)
	router.Use(loggingMiddleware)

	// Health check endpoint
	router.HandleFunc("/health", healthHandler.Check).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/v1/health", healthHandler.Check).Methods("GET", "OPTIONS")

	// API versioning prefix
	api := router.PathPrefix("/api/v1").Subrouter()

	// Public Authentication Routes
	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/login", authHandler.Login).Methods("POST")
	auth.HandleFunc("/initialize-super-admin", authHandler.InitializeSuperAdmin).Methods("POST")
	auth.HandleFunc("/refresh", authHandler.RefreshToken).Methods("POST")
	auth.HandleFunc("/revoke", authHandler.RevokeToken).Methods("POST")
	auth.HandleFunc("/google", socialAuthHandler.GoogleLogin).Methods("GET")
	auth.HandleFunc("/google/callback", socialAuthHandler.GoogleCallback).Methods("GET")
	auth.HandleFunc("/facebook", socialAuthHandler.FacebookLogin).Methods("GET")
	auth.HandleFunc("/facebook/callback", socialAuthHandler.FacebookCallback).Methods("GET")

	// Admin Management Routes
	admins := api.PathPrefix("/admins").Subrouter()
	admins.Handle("", middleware.RequirePermission(authService, string(models.PermissionAdminCreate))(http.HandlerFunc(authHandler.CreateAdmin))).Methods("POST")
	admins.Handle("", middleware.RequirePermission(authService, string(models.PermissionAdminList))(http.HandlerFunc(authHandler.ListAdmins))).Methods("GET")
	admins.Handle("/{id}", middleware.RequirePermission(authService, string(models.PermissionAdminView))(http.HandlerFunc(authHandler.GetAdmin))).Methods("GET")
	admins.Handle("/{id}", middleware.RequirePermission(authService, string(models.PermissionAdminUpdate))(http.HandlerFunc(authHandler.UpdateAdmin))).Methods("PUT")
	admins.Handle("/{id}", middleware.RequirePermission(authService, string(models.PermissionAdminDelete))(http.HandlerFunc(authHandler.DeleteAdmin))).Methods("DELETE")
	admins.Handle("/{id}/permissions", middleware.RequireRole("super_admin")(http.HandlerFunc(authHandler.UpdateAdminPermissions))).Methods("PUT")

	// Doctor Management Routes
	doctors := api.PathPrefix("/doctors").Subrouter()
	doctors.HandleFunc("/register", authHandler.RegisterDoctor).Methods("POST")
	doctors.Handle("", middleware.RequirePermission(authService, string(models.PermissionDoctorList))(http.HandlerFunc(authHandler.ListDoctors))).Methods("GET")
	doctors.Handle("/pending", middleware.RequirePermission(authService, string(models.PermissionDoctorList))(http.HandlerFunc(authHandler.ListPendingDoctors))).Methods("GET")
	doctors.Handle("/{id}", middleware.RequirePermission(authService, string(models.PermissionDoctorView))(http.HandlerFunc(authHandler.GetDoctor))).Methods("GET")
	doctors.Handle("/{id}/approve", middleware.RequirePermission(authService, string(models.PermissionDoctorApprove))(http.HandlerFunc(authHandler.ApproveDoctor))).Methods("POST")
	doctors.Handle("/{id}/reject", middleware.RequirePermission(authService, string(models.PermissionDoctorReject))(http.HandlerFunc(authHandler.RejectDoctor))).Methods("POST")
	doctors.Handle("/{id}", middleware.RequirePermission(authService, string(models.PermissionDoctorUpdate))(http.HandlerFunc(authHandler.UpdateDoctor))).Methods("PUT")

	// Patient Management Routes
	patients := api.PathPrefix("/patients").Subrouter()
	patients.HandleFunc("/register", authHandler.RegisterPatient).Methods("POST")
	patients.Handle("", middleware.RequirePermission(authService, string(models.PermissionPatientList))(http.HandlerFunc(authHandler.ListPatients))).Methods("GET")
	patients.Handle("/{id}", middleware.RequirePermission(authService, string(models.PermissionPatientView))(http.HandlerFunc(authHandler.GetPatient))).Methods("GET")
	patients.Handle("/{id}/history", middleware.RequirePermission(authService, string(models.PermissionPatientHistory))(http.HandlerFunc(authHandler.GetPatientHistory))).Methods("GET")
	patients.Handle("/{id}/history", middleware.RequirePermission(authService, string(models.PermissionPatientHistory))(http.HandlerFunc(authHandler.AddPatientHistory))).Methods("POST")

	// System Management Routes
	system := api.PathPrefix("/system").Subrouter()
	system.Handle("/config", middleware.RequirePermission(authService, string(models.PermissionSystemConfig))(http.HandlerFunc(authHandler.GetSystemConfig))).Methods("GET")
	system.Handle("/config", middleware.RequirePermission(authService, string(models.PermissionSystemConfig))(http.HandlerFunc(authHandler.UpdateSystemConfig))).Methods("PUT")
	system.Handle("/metrics", middleware.RequirePermission(authService, string(models.PermissionSystemMetrics))(http.HandlerFunc(authHandler.GetSystemMetrics))).Methods("GET")
	system.Handle("/logs", middleware.RequirePermission(authService, string(models.PermissionSystemLogs))(http.HandlerFunc(authHandler.GetSystemLogs))).Methods("GET")

	// Register test user routes
	routes.RegisterTestUsersRoutes(router, patientCtrl)
}