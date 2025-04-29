package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Claim struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	PatientID        string             `json:"patient_id" bson:"patient_id"`
	InsuranceID      string             `json:"insurance_id" bson:"insurance_id"`
	Amount           float64            `json:"amount" bson:"amount"`
	Status           string             `json:"status" bson:"status"`
	ServiceDate      time.Time          `json:"service_date" bson:"service_date"`
	SubmissionDate   time.Time          `json:"submission_date" bson:"submission_date"`
	Description      string             `json:"description" bson:"description"`
	DocumentationURL string             `json:"documentation_url" bson:"documentation_url"`
	CreatedAt        time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt        time.Time          `json:"updated_at" bson:"updated_at"`
}
