package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Invoice struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	PatientID   string             `json:"patient_id" bson:"patient_id"`
	Amount      float64            `json:"amount" bson:"amount"`
	Status      string             `json:"status" bson:"status"`
	DueDate     time.Time          `json:"due_date" bson:"due_date"`
	IssuedDate  time.Time          `json:"issued_date" bson:"issued_date"`
	Items       []InvoiceItem      `json:"items" bson:"items"`
	PaymentID   string             `json:"payment_id,omitempty" bson:"payment_id,omitempty"`
	Description string             `json:"description" bson:"description"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at" bson:"updated_at"`
}

type InvoiceItem struct {
	Description string  `json:"description" bson:"description"`
	Amount      float64 `json:"amount" bson:"amount"`
	Quantity    int     `json:"quantity" bson:"quantity"`
}
