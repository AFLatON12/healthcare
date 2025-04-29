package routes

import (
	"appointment-service/controllers"
	"appointment-service/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SetupDoctorScheduleRoutes(router *gin.Engine, doctorScheduleController *controllers.DoctorScheduleController) {
	schedules := router.Group("/api/doctor-schedules")
	{
		// Create a new doctor schedule
		schedules.POST("/", func(c *gin.Context) {
			var schedule models.DoctorSchedule
			if err := c.ShouldBindJSON(&schedule); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := doctorScheduleController.Create(c.Request.Context(), &schedule); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusCreated, schedule)
		})

		// Get doctor schedule by ID
		schedules.GET("/:id", func(c *gin.Context) {
			id, err := primitive.ObjectIDFromHex(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			schedule, err := doctorScheduleController.GetByID(c.Request.Context(), id)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Doctor schedule not found"})
				return
			}

			c.JSON(http.StatusOK, schedule)
		})

		// Get doctor schedule by doctor ID
		schedules.GET("/doctor/:doctorId", func(c *gin.Context) {
			doctorID, err := primitive.ObjectIDFromHex(c.Param("doctorId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctor ID format"})
				return
			}

			schedule, err := doctorScheduleController.GetByDoctorID(c.Request.Context(), doctorID)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Doctor schedule not found"})
				return
			}

			c.JSON(http.StatusOK, schedule)
		})

		// Add time slot
		schedules.POST("/doctor/:doctorId/slots", func(c *gin.Context) {
			doctorID, err := primitive.ObjectIDFromHex(c.Param("doctorId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctor ID format"})
				return
			}

			var slot models.TimeSlot
			if err := c.ShouldBindJSON(&slot); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := doctorScheduleController.AddTimeSlot(c.Request.Context(), doctorID, slot); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Time slot added successfully"})
		})

		// Remove time slot
		schedules.DELETE("/doctor/:doctorId/slots", func(c *gin.Context) {
			doctorID, err := primitive.ObjectIDFromHex(c.Param("doctorId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctor ID format"})
				return
			}

			var slot models.TimeSlot
			if err := c.ShouldBindJSON(&slot); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			if err := doctorScheduleController.RemoveTimeSlot(c.Request.Context(), doctorID, slot); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Time slot removed successfully"})
		})

		// Get available slots within date range
		schedules.GET("/doctor/:doctorId/available-slots", func(c *gin.Context) {
			doctorID, err := primitive.ObjectIDFromHex(c.Param("doctorId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctor ID format"})
				return
			}

			startDateStr := c.Query("start_date")
			endDateStr := c.Query("end_date")

			startDate, err := time.Parse(time.RFC3339, startDateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
				return
			}

			endDate, err := time.Parse(time.RFC3339, endDateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
				return
			}

			slots, err := doctorScheduleController.GetAvailableSlots(c.Request.Context(), doctorID, startDate, endDate)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			// Return an empty array instead of null if no slots are found
			if slots == nil {
				slots = []models.TimeSlot{}
			}

			c.JSON(http.StatusOK, gin.H{
				"doctor_id":       doctorID.Hex(),
				"start_date":      startDate,
				"end_date":        endDate,
				"available_slots": slots,
			})
		})
	}
}
