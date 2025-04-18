package main

import (
	"auth-service/db"
	"auth-service/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Set up logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	log.Println("🚀 Starting Authentication Service...")

	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file:", err)
	}
	log.Println("✅ Environment variables loaded")

	// Connect to MongoDB
	log.Println("📡 Connecting to MongoDB...")
	db.ConnectMongoDB()
	log.Println("✅ MongoDB connection established")

	// Setup routes
	log.Println("🛠️ Setting up routes...")
	router := routes.SetupRoutes()
	log.Println("✅ Routes configured")

	// Setup CORS middleware
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("📨 Incoming %s request to %s", r.Method, r.URL.Path)

		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // أو أي origin آخر تستخدمه
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Expose-Headers", "Set-Cookie")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		router.ServeHTTP(w, r)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Default port if not specified
	}

	serverAddr := ":" + port
	log.Printf("🌟 Auth Service starting on http://localhost%s", serverAddr)

	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatal("❌ Server failed to start:", err)
	}
}
