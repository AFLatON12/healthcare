package routes

import (
	"appointment-service/controllers"
	"appointment-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SetupPrescriptionRoutes(router *gin.Engine, prescriptionController *controllers.PrescriptionController) {
	prescriptions := router.Group("/api/prescriptions")
	{
		// Create a new prescription
		prescriptions.POST("/", func(c *gin.Context) {
			var prescription models.Prescription
			if err := c.ShouldBindJSON(&prescription); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := prescriptionController.Create(c.Request.Context(), &prescription); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusCreated, prescription)
		})

		// Get prescription by ID
		prescriptions.GET("/:id", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			prescription, err := prescriptionController.GetByID(c.Request.Context(), id)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
				return
			}

			c.JSON(http.StatusOK, prescription)
		})

		// Get prescription by appointment ID
		prescriptions.GET("/appointment/:appointmentId", func(c *gin.Context) {
			appointmentID, err := primitive.ObjectIDFromHex(c.Param("appointmentId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid appointment ID format"})
				return
			}

			prescription, err := prescriptionController.GetByAppointmentID(c.Request.Context(), appointmentID)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
				return
			}

			c.JSON(http.StatusOK, prescription)
		})

		// Get prescriptions by patient ID
		prescriptions.GET("/patient/:patientId", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			prescriptions, err := prescriptionController.GetByPatientID(c.Request.Context(), patientID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, prescriptions)
		})

		// Get prescriptions by doctor ID
		prescriptions.GET("/doctor/:doctorId", func(c *gin.Context) {
			doctorID, err := primitive.ObjectIDFromHex(c.Param("doctorId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctor ID format"})
				return
			}

			prescriptions, err := prescriptionController.GetByDoctorID(c.Request.Context(), doctorID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, prescriptions)
		})
	}
}
