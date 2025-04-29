package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type InsuranceClaim struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	PatientID         primitive.ObjectID `bson:"patient_id" json:"patient_id"`
	InsuranceProvider string             `bson:"insurance_provider" json:"insurance_provider"`
	PolicyNumber      string             `bson:"policy_number" json:"policy_number"`
	ClaimAmount       float64            `bson:"claim_amount" json:"claim_amount"`
	Status            string             `bson:"status" json:"status"`
	SubmittedDate     time.Time          `bson:"submitted_date" json:"submitted_date"`
	ApprovedDate      *time.Time         `bson:"approved_date,omitempty" json:"approved_date,omitempty"`
	CreatedAt         time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt         time.Time          `bson:"updated_at" json:"updated_at"`
}
