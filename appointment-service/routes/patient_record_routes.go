package routes

import (
	"appointment-service/clients"
	"appointment-service/controllers"
	"appointment-service/models"
	"net/http"

	"appointment-service/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SetupPatientRecordRoutes(router *gin.Engine, patientRecordController *controllers.PatientRecordController, authClient *clients.AuthClient) {
	records := router.Group("/api/patient-records")
	records.Use(middleware.AuthMiddleware(authClient))
	{
		// Create a new patient record
		records.POST("/", func(c *gin.Context) {
			var record models.PatientRecord
			if err := c.ShouldBindJSON(&record); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := patientRecordController.Create(c.Request.Context(), &record); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusCreated, record)
		})

		// Get patient record by ID
		records.GET("/:id", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			record, err := patientRecordController.GetByID(c.Request.Context(), id)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Patient record not found"})
				return
			}

			c.JSON(http.StatusOK, record)
		})

		// Get patient record by patient ID
		records.GET("/patient/:patientId", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			record, err := patientRecordController.GetByPatientID(c.Request.Context(), patientID)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Patient record not found"})
				return
			}

			c.JSON(http.StatusOK, record)
		})

		// Add doctor note
		records.POST("/:patientId/notes", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			var note models.DoctorNote
			if err := c.ShouldBindJSON(&note); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := patientRecordController.AddDoctorNote(c.Request.Context(), patientID, note); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Doctor note added successfully"})
		})

		// Add test result
		records.POST("/:patientId/test-results", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			var result models.TestResult
			if err := c.ShouldBindJSON(&result); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := patientRecordController.AddTestResult(c.Request.Context(), patientID, result); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Test result added successfully"})
		})

		// Update allergies
		records.PUT("/:patientId/allergies", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			var allergies []string
			if err := c.ShouldBindJSON(&allergies); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := patientRecordController.UpdateAllergies(c.Request.Context(), patientID, allergies); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Allergies updated successfully"})
		})

		// Update chronic diseases
		records.PUT("/:patientId/chronic-diseases", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			var diseases []string
			if err := c.ShouldBindJSON(&diseases); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := patientRecordController.UpdateChronicDiseases(c.Request.Context(), patientID, diseases); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Chronic diseases updated successfully"})
		})
	}
}
