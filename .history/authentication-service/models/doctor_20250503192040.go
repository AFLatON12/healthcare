package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Doctor struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name            string             `bson:"name" json:"name"`
	Email           string             `bson:"email" json:"email"`
	PasswordHash    string             `bson:"password_hash" json:"-"`
	Specialization  string             `bson:"specialization" json:"specialization"`
	LicenseNumber   string             `bson:"license_number" json:"license_number"`
	Qualifications  []string           `bson:"qualifications" json:"qualifications"`
	ExperienceYears int                `bson:"experience_years" json:"experience_years"`
	Phone           string             `bson:"phone" json:"phone"`
	Bio             string             `bson:"bio" json:"bio"`
	IsApproved      bool               `bson:"is_approved" json:"is_approved"`
	Available       bool               `bson:"available" json:"available"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt       time.Time          `bson:"updated_at" json:"updated_at"`
}
