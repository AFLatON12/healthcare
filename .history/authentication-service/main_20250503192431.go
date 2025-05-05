package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"healthcare/authentication-service/config"
	"healthcare/authentication-service/controllers"
	"healthcare/authentication-service/handlers"
	"healthcare/authentication-service/middleware"
	"healthcare/authentication-service/models"
	"healthcare/authentication-service/routes"
	"healthcare/authentication-service/services"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Incoming %s request to %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
		next.ServeHTTP(w, r)
	})
}

// Additional logging middleware for debugging 404 issues
func detailedLoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("[DetailedLog] Method: %s, URL: %s, RemoteAddr: %s, Headers: %v", r.Method, r.URL.String(), r.RemoteAddr, r.Header)
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load environment variables
	config.LoadEnv()

	// MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Load MongoDB URI and database name from environment variables
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI environment variable is not set")
	}

	dbName := os.Getenv("MONGODB_NAME")
	if dbName == "" {
		log.Fatal("MONGODB_NAME environment variable is not set")
	}

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	// Ping the database with Primary read preference
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal("Error pinging MongoDB:", err)
	}
	log.Println("Successfully connected to MongoDB")

	db := client.Database(dbName)

	// Initialize controllers
	superAdminCtrl := controllers.NewSuperAdminController(db)
	adminCtrl := controllers.NewAdminController(db)
	doctorCtrl := controllers.NewDoctorController(db)
	patientCtrl := controllers.NewPatientController(db)

	// Initialize services
	jwtSecret := "JWT_SECRET=83fda7kdnw!3lfKdxs8fjsdn3jKDX923ss" // Change this in production
	healthService := services.NewHealthService(db)
	authService := services.NewAuthService(
		superAdminCtrl,
		adminCtrl,
		doctorCtrl,
		patientCtrl,
		jwtSecret,
	)
	socialAuthService := services.NewSocialAuthService(patientCtrl)

	// Initialize router
	router := mux.NewRouter()

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	healthHandler := handlers.NewHealthHandler(healthService)
	socialAuthHandler := handlers.NewSocialAuthHandler(socialAuthService, authService)

	// Initialize middleware
	// authMiddleware := middleware.AuthMiddleware(authService)

	// Add global middleware
	router.Use(corsMiddleware)
	router.Use(loggingMiddleware)

	// Health check endpoint - make it accessible at both /health and /api/v1/health
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

	// Social Authentication Routes
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

	// System Management Routes (Super Admin Only)
	system := api.PathPrefix("/system").Subrouter()
	system.Handle("/config", middleware.RequirePermission(authService, string(models.PermissionSystemConfig))(http.HandlerFunc(authHandler.GetSystemConfig))).Methods("GET")
	system.Handle("/config", middleware.RequirePermission(authService, string(models.PermissionSystemConfig))(http.HandlerFunc(authHandler.UpdateSystemConfig))).Methods("PUT")
	system.Handle("/metrics", middleware.RequirePermission(authService, string(models.PermissionSystemMetrics))(http.HandlerFunc(authHandler.GetSystemMetrics))).Methods("GET")
	system.Handle("/logs", middleware.RequirePermission(authService, string(models.PermissionSystemLogs))(http.HandlerFunc(authHandler.GetSystemLogs))).Methods("GET")

	// Register test user routes
	routes.RegisterTestUsersRoutes(router, patientCtrl)

	// Serve frontend static files
	fs := http.FileServer(http.Dir("socialfrontend"))
	router.PathPrefix("/").Handler(http.StripPrefix("/", fs))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}
}
