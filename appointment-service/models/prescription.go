package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Medicine represents a prescribed medicine
type Medicine struct {
	Name      string `bson:"name" json:"name"`
	Dosage    string `bson:"dosage" json:"dosage"`
	Frequency string `bson:"frequency" json:"frequency"`
	Duration  string `bson:"duration" json:"duration"`
}

// Prescription represents a medical prescription
type Prescription struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	AppointmentID primitive.ObjectID `bson:"appointment_id" json:"appointment_id"`
	DoctorID      primitive.ObjectID `bson:"doctor_id" json:"doctor_id"`
	PatientID     primitive.ObjectID `bson:"patient_id" json:"patient_id"`
	Medications   []Medicine         `bson:"medications" json:"medications"`
	Instructions  string             `bson:"instructions" json:"instructions"`
	Notes         string             `bson:"notes" json:"notes"`
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`
}

// NewPrescription creates a new prescription
func NewPrescription(appointmentID, doctorID, patientID primitive.ObjectID) *Prescription {
	return &Prescription{
		AppointmentID: appointmentID,
		DoctorID:      doctorID,
		PatientID:     patientID,
		Medications:   make([]Medicine, 0),
		CreatedAt:     time.Now(),
	}
}
