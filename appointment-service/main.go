package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"appointment-service/clients"
	"appointment-service/config"
	"appointment-service/controllers"
	"appointment-service/db"
	"appointment-service/routes"
)

func main() {
	// Load service configuration
	serviceConfig := config.NewServiceConfig()

	// Connect to MongoDB
	if err := db.ConnectMongoDB(); err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer db.DisconnectMongoDB()

	// Get database reference
	database := db.MongoClient.Database("appointment_management_db")

	// Initialize service clients
	authClient := clients.NewAuthClient(serviceConfig)
	transactionClient := clients.NewTransactionClient(serviceConfig)

	// Initialize controllers with service clients
	appointmentController := controllers.NewAppointmentController(database, authClient, transactionClient)
	prescriptionController := controllers.NewPrescriptionController(database, authClient)
	patientRecordController := controllers.NewPatientRecordController(database, authClient)
	doctorScheduleController := controllers.NewDoctorScheduleController(database, authClient)

	// Initialize Gin router
	router := gin.Default()

	// Setup routes
	routes.SetupAppointmentRoutes(router, appointmentController)
	routes.SetupPrescriptionRoutes(router, prescriptionController)
	routes.SetupPatientRecordRoutes(router, patientRecordController, authClient)
	routes.SetupDoctorScheduleRoutes(router, doctorScheduleController)

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
