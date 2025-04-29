package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Payment struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Amount      float64            `json:"amount" bson:"amount"`
	Currency    string             `json:"currency" bson:"currency"`
	Status      string             `json:"status" bson:"status"`
	Method      string             `json:"method" bson:"method"`
	PatientID   string             `json:"patient_id" bson:"patient_id"`
	Description string             `json:"description" bson:"description"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at" bson:"updated_at"`
}
