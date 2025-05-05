package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Google OAuth2 Configuration
	if os.Getenv("GOOGLE_CLIENT_ID") == "" {
		log.Println("Error: GOOGLE_CLIENT_ID not set in environment")
	}
	if os.Getenv("GOOGLE_CLIENT_SECRET") == "" {
		log.Println("Error: GOOGLE_CLIENT_SECRET not set in environment")
	}
	if os.Getenv("GOOGLE_REDIRECT_URL") == "" {
		os.Setenv("GOOGLE_REDIRECT_URL", "http://localhost:8000/api/v1/auth/google/callback")
		log.Println("Warning: GOOGLE_REDIRECT_URL not set in environment, using default")
	}

	// Facebook OAuth2 Configuration
	if os.Getenv("FACEBOOK_CLIENT_ID") == "" {
		log.Println("Error: FACEBOOK_CLIENT_ID not set in environment")
	}
	if os.Getenv("FACEBOOK_CLIENT_SECRET") == "" {
		log.Println("Error: FACEBOOK_CLIENT_SECRET not set in environment")
	}
	if os.Getenv("FACEBOOK_REDIRECT_URL") == "" {
		os.Setenv("FACEBOOK_REDIRECT_URL", "http://localhost:8000/api/v1/auth/facebook/callback")
		log.Println("Warning: FACEBOOK_REDIRECT_URL not set in environment, using default")
	}

	// JWT Configuration
	if os.Getenv("JWT_SECRET") == "" {
		log.Println("Warning: JWT_SECRET not set in environment, using default (not secure for production)")
	}

	// Load MongoDB URI
	if os.Getenv("MONGO_URI") == "mongodb+srv://ismailyasser:Z1x2c312d@cluster1.46bw0ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1" {
		log.Println("Error: MONGO_URI not set in environment")
	}
}
