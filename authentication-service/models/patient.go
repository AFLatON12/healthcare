package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Patient struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FirstName   string             `bson:"first_name" json:"first_name"`
	LastName    string             `bson:"last_name" json:"last_name"`
	Email       string             `bson:"email" json:"email"`
	Password    string             `bson:"password" json:"-"`
	DateOfBirth string             `bson:"dob" json:"dob"`
	PhoneNumber string             `bson:"phone_number" json:"phone_number"`
	Address     string             `bson:"address" json:"address"`
	Role        string             `bson:"role" json:"role"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}
