package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DoctorNote represents a note made by a doctor
type DoctorNote struct {
	DoctorID  primitive.ObjectID `bson:"doctor_id" json:"doctor_id"`
	Note      string             `bson:"note" json:"note"`
	Date      time.Time          `bson:"date" json:"date"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

// TestResult represents a medical test result
type TestResult struct {
	TestName  string    `bson:"test_name" json:"test_name"`
	Result    string    `bson:"result" json:"result"`
	DateTaken time.Time `bson:"date_taken" json:"date_taken"`
}

// PatientRecord represents a patient's medical record
type PatientRecord struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PatientID       primitive.ObjectID `bson:"patient_id" json:"patient_id"`
	DoctorNotes     []DoctorNote       `bson:"doctor_notes" json:"doctor_notes"`
	TestResults     []TestResult       `bson:"test_results" json:"test_results"`
	Allergies       []string           `bson:"allergies" json:"allergies"`
	ChronicDiseases []string           `bson:"chronic_diseases" json:"chronic_diseases"`
	LastUpdated     time.Time          `bson:"last_updated" json:"last_updated"`
}

// NewPatientRecord creates a new patient record
func NewPatientRecord(patientID primitive.ObjectID) *PatientRecord {
	now := time.Now()
	return &PatientRecord{
		PatientID:       patientID,
		DoctorNotes:     []DoctorNote{},
		TestResults:     []TestResult{},
		Allergies:       []string{},
		ChronicDiseases: []string{},
		LastUpdated:     now,
	}
}
