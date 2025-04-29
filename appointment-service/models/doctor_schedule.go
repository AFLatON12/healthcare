package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TimeSlot represents an available time slot for a doctor
type TimeSlot struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	StartTime   time.Time          `json:"start_time" bson:"start_time"`
	EndTime     time.Time          `json:"end_time" bson:"end_time"`
	IsAvailable bool               `json:"is_available" bson:"is_available"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at"`
}

// DoctorSchedule represents a doctor's schedule
type DoctorSchedule struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	DoctorID  string             `json:"doctor_id" bson:"doctor_id"`
	TimeSlots []TimeSlot         `json:"time_slots" bson:"time_slots"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}

// NewDoctorSchedule creates a new doctor schedule
func NewDoctorSchedule(doctorID primitive.ObjectID) *DoctorSchedule {
	return &DoctorSchedule{
		DoctorID:  doctorID.Hex(),
		TimeSlots: []TimeSlot{},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

// NewTimeSlot creates a new time slot
func NewTimeSlot(startTime, endTime time.Time, isAvailable bool) TimeSlot {
	return TimeSlot{
		ID:          primitive.NewObjectID(),
		StartTime:   startTime,
		EndTime:     endTime,
		IsAvailable: isAvailable,
		CreatedAt:   time.Now(),
	}
}
