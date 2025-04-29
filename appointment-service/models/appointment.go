package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Appointment status constants
const (
	StatusPending   = "pending"
	StatusConfirmed = "confirmed"
	StatusCancelled = "cancelled"
	StatusCompleted = "completed"
)

// Appointment represents a medical appointment between a patient and a doctor
type Appointment struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	PatientID primitive.ObjectID `json:"patient_id" bson:"patient_id"`
	DoctorID  primitive.ObjectID `json:"doctor_id" bson:"doctor_id"`
	StartTime time.Time          `json:"start_time" bson:"start_time"`
	EndTime   time.Time          `json:"end_time" bson:"end_time"`
	Status    string             `json:"status" bson:"status"`
	Notes     string             `json:"notes" bson:"notes"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}

// NewAppointment creates a new appointment with default values
func NewAppointment(patientID, doctorID primitive.ObjectID, startTime, endTime time.Time) *Appointment {
	now := time.Now()
	return &Appointment{
		ID:        primitive.NewObjectID(),
		PatientID: patientID,
		DoctorID:  doctorID,
		StartTime: startTime,
		EndTime:   endTime,
		Status:    StatusPending,
		CreatedAt: now,
		UpdatedAt: now,
	}
}
