package controllers

import (
	"context"
	"time"

	"appointment-service/clients"
	"appointment-service/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// DoctorScheduleController handles doctor schedule-related operations
type DoctorScheduleController struct {
	collection *mongo.Collection
	authClient *clients.AuthClient
}

// NewDoctorScheduleController creates a new doctor schedule controller
func NewDoctorScheduleController(db *mongo.Database, authClient *clients.AuthClient) *DoctorScheduleController {
	return &DoctorScheduleController{
		collection: db.Collection("doctor_schedules"),
		authClient: authClient,
	}
}

// Create creates a new doctor schedule
func (c *DoctorScheduleController) Create(ctx context.Context, schedule *models.DoctorSchedule) error {
	if schedule.TimeSlots == nil {
		schedule.TimeSlots = []models.TimeSlot{}
	}
	schedule.UpdatedAt = time.Now()
	schedule.CreatedAt = time.Now()

	result, err := c.collection.InsertOne(ctx, schedule)
	if err != nil {
		return err
	}
	schedule.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

// GetByID retrieves a doctor schedule by ID
func (c *DoctorScheduleController) GetByID(ctx context.Context, id primitive.ObjectID) (*models.DoctorSchedule, error) {
	var schedule models.DoctorSchedule
	err := c.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&schedule)
	if err != nil {
		return nil, err
	}
	if schedule.TimeSlots == nil {
		schedule.TimeSlots = []models.TimeSlot{}
	}
	return &schedule, nil
}

// GetByDoctorID retrieves a doctor schedule by doctor ID
func (c *DoctorScheduleController) GetByDoctorID(ctx context.Context, doctorID primitive.ObjectID) (*models.DoctorSchedule, error) {
	var schedule models.DoctorSchedule
	err := c.collection.FindOne(ctx, bson.M{"doctor_id": doctorID.Hex()}).Decode(&schedule)
	if err != nil {
		return nil, err
	}
	if schedule.TimeSlots == nil {
		schedule.TimeSlots = []models.TimeSlot{}
	}
	return &schedule, nil
}

// AddTimeSlot adds a new time slot to the doctor's schedule
func (c *DoctorScheduleController) AddTimeSlot(ctx context.Context, doctorID primitive.ObjectID, slot models.TimeSlot) error {
	// First, ensure the doctor schedule exists and has the time_slots array
	var schedule models.DoctorSchedule
	err := c.collection.FindOne(ctx, bson.M{"doctor_id": doctorID}).Decode(&schedule)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Create new schedule if it doesn't exist
			schedule = *models.NewDoctorSchedule(doctorID)
		} else {
			return err
		}
	}

	// Initialize time_slots if it's nil
	if schedule.TimeSlots == nil {
		schedule.TimeSlots = []models.TimeSlot{}
	}

	// Set ID and CreatedAt for the new slot
	slot.ID = primitive.NewObjectID()
	slot.CreatedAt = time.Now()
	if !slot.IsAvailable {
		slot.IsAvailable = true // Default to available
	}

	update := bson.M{
		"$push": bson.M{
			"time_slots": slot,
		},
		"$set": bson.M{
			"updated_at": time.Now(),
		},
	}

	_, err = c.collection.UpdateOne(ctx, bson.M{"doctor_id": doctorID}, update)
	return err
}

// RemoveTimeSlot removes a time slot from the doctor's schedule
func (c *DoctorScheduleController) RemoveTimeSlot(ctx context.Context, doctorID primitive.ObjectID, slot models.TimeSlot) error {
	update := bson.M{
		"$pull": bson.M{
			"time_slots": bson.M{
				"start_time": slot.StartTime,
				"end_time":   slot.EndTime,
			},
		},
		"$set": bson.M{
			"updated_at": time.Now(),
		},
	}
	_, err := c.collection.UpdateOne(ctx, bson.M{"doctor_id": doctorID}, update)
	return err
}

// GetAvailableSlots retrieves all available time slots for a doctor within a date range
func (c *DoctorScheduleController) GetAvailableSlots(ctx context.Context, doctorID primitive.ObjectID, startDate, endDate time.Time) ([]models.TimeSlot, error) {
	var schedule models.DoctorSchedule
	err := c.collection.FindOne(ctx, bson.M{"doctor_id": doctorID.Hex()}).Decode(&schedule)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []models.TimeSlot{}, nil
		}
		return nil, err
	}

	if schedule.TimeSlots == nil {
		return []models.TimeSlot{}, nil
	}

	var availableSlots []models.TimeSlot
	for _, slot := range schedule.TimeSlots {
		// Check if the slot matches exactly with the requested time range and is available
		if (slot.StartTime.Equal(startDate) && slot.EndTime.Equal(endDate) && slot.IsAvailable) ||
			// Or if we're looking for all slots in a date range
			(startDate.IsZero() && endDate.IsZero() && slot.IsAvailable) {
			availableSlots = append(availableSlots, slot)
		}
	}
	return availableSlots, nil
}
