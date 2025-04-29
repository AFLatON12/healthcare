package main

import (
	"log"

	"github.com/heelth/transiaction-service/db"
	"github.com/heelth/transiaction-service/routes"
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

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
