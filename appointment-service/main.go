package main

import (
	"log"
	"os"

	"appointment-service/controllers"
	"appointment-service/db"
	"appointment-service/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to MongoDB
	if err := db.ConnectMongoDB(); err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer db.DisconnectMongoDB()

	// Get database reference
	database := db.MongoClient.Database("appointment_management_db")

	// Initialize controllers
	appointmentController := controllers.NewAppointmentController(database)
	prescriptionController := controllers.NewPrescriptionController(database)
	patientRecordController := controllers.NewPatientRecordController(database)
	doctorScheduleController := controllers.NewDoctorScheduleController(database)

	// Initialize Gin router
	router := gin.Default()

	// Setup routes
	routes.SetupAppointmentRoutes(router, appointmentController)
	routes.SetupPrescriptionRoutes(router, prescriptionController)
	routes.SetupPatientRecordRoutes(router, patientRecordController)
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
