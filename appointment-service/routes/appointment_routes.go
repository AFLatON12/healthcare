package routes

import (
	"appointment-service/controllers"
	"appointment-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SetupAppointmentRoutes(router *gin.Engine, appointmentController *controllers.AppointmentController) {
	appointments := router.Group("/api/appointments")
	{
		// Schedule a new appointment
		appointments.POST("/", func(c *gin.Context) {
			var appointment models.Appointment
			if err := c.ShouldBindJSON(&appointment); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := appointmentController.ScheduleAppointment(c.Request.Context(), &appointment); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusCreated, appointment)
		})

		// Confirm appointment
		appointments.PUT("/:id/confirm", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			if err := appointmentController.ConfirmAppointment(c.Request.Context(), id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Appointment confirmed successfully"})
		})

		// Start appointment
		appointments.PUT("/:id/start", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			if err := appointmentController.StartAppointment(c.Request.Context(), id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Appointment started successfully"})
		})

		// Complete appointment
		appointments.PUT("/:id/complete", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			var req struct {
				Notes        string               `json:"notes"`
				Prescription *models.Prescription `json:"prescription,omitempty"`
			}
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := appointmentController.CompleteAppointment(c.Request.Context(), id, req.Notes, req.Prescription); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Appointment completed successfully"})
		})

		// Cancel appointment
		appointments.PUT("/:id/cancel", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			var req struct {
				Reason string `json:"reason" binding:"required"`
			}
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := appointmentController.CancelAppointment(c.Request.Context(), id, req.Reason); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Appointment cancelled successfully"})
		})

		// Get appointment by ID
		appointments.GET("/:id", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			appointment, err := appointmentController.GetByID(c.Request.Context(), id)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
				return
			}

			c.JSON(http.StatusOK, appointment)
		})

		// Get appointments by patient ID
		appointments.GET("/patient/:patientId", func(c *gin.Context) {
			patientID, err := primitive.ObjectIDFromHex(c.Param("patientId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patient ID format"})
				return
			}

			appointments, err := appointmentController.GetByPatientID(c.Request.Context(), patientID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, appointments)
		})

		// Get appointments by doctor ID
		appointments.GET("/doctor/:doctorId", func(c *gin.Context) {
			doctorID, err := primitive.ObjectIDFromHex(c.Param("doctorId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctor ID format"})
				return
			}

			appointments, err := appointmentController.GetByDoctorID(c.Request.Context(), doctorID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, appointments)
		})
	}
}
