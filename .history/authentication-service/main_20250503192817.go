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

	// Register routes
	routes.RegisterRoutes(router, authHandler, healthHandler, socialAuthHandler, authService, patientCtrl)

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
