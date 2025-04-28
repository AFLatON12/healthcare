package models

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Doctor struct {
    ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    FirstName        string             `bson:"first_name" json:"first_name"`
    LastName         string             `bson:"last_name" json:"last_name"`
    Email            string             `bson:"email" json:"email"`
    Password         string             `bson:"password" json:"-"`
    PhoneNumber      string             `bson:"phone_number" json:"phone_number"`
    DateOfBirth      string             `bson:"dob" json:"dob"` // string أو time.Time حسب ما بتستقبل
    Gender           string             `bson:"gender" json:"gender"`
    Address          string             `bson:"address" json:"address"`

    Specialization   string             `bson:"specialization" json:"specialization"`
    LicenseNumber    string             `bson:"license_number" json:"license_number"`
    ExperienceYears  string             `bson:"experience_years" json:"experience_years"`
    Education        string             `bson:"education" json:"education"`
    CurrentWorkplace string             `bson:"current_workplace" json:"current_workplace"`

    LanguagesSpoken  string             `bson:"languages_spoken" json:"languages_spoken"`
    Availability     string             `bson:"availability" json:"availability"`

    ResumeURL        string             `bson:"resume_url" json:"resume_url"`
    ResumePublicID   string             `bson:"resume_public_id" json:"resume_public_id"`

    Role             string             `bson:"role" json:"role"` // pending_doctor
    CreatedAt        time.Time          `bson:"created_at" json:"created_at"`
}
