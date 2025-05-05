package main

import (
	"log"
	"os"

	"transiaction-service/db"
	"transiaction-service/routes"
)

func main() {
	// Initialize database connection
	if err := db.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Get database instance
	database := db.GetDB()

	// Setup router with all routes
	r := routes.SetupRouter(database)

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	// Start server
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
