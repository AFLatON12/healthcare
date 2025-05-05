package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Patient struct {
	ID                primitive.ObjectID `bson:"_id,omitempty"`
	Name              string             `bson:"name"`
	Email             string             `bson:"email"`
	PasswordHash      string             `bson:"password_hash"`
	Phone             string             `bson:"phone"`
	Address           string             `bson:"address"`
	DateOfBirth       time.Time          `bson:"date_of_birth"`
	Gender            Gender             `bson:"gender"`
	InsuranceProvider string             `bson:"insurance_provider"`
	MedicalHistory    []string           `bson:"medical_history"`
	SocialID          string             `bson:"social_id"`
	SocialProvider    string             `bson:"social_provider"`
	CreatedAt         time.Time          `bson:"created_at"`
	IsApproved        bool               `bson:"is_approved" json:"is_approved"`
}