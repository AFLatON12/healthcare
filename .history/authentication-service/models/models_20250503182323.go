package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Permission string

type Gender string

const (
	GenderMale   Gender = "male"
	GenderFemale Gender = "female"
	GenderOther  Gender = "other"
)

// Permission constants
const (
	// Admin permissions
	PermissionAdminCreate Permission = "admin:create"
	PermissionAdminList   Permission = "admin:list"
	PermissionAdminView   Permission = "admin:view"
	PermissionAdminUpdate Permission = "admin:update"
	PermissionAdminDelete Permission = "admin:delete"

	// Doctor permissions
	PermissionDoctorCreate  Permission = "doctor:create"
	PermissionDoctorList    Permission = "doctor:list"
	PermissionDoctorView    Permission = "doctor:view"
	PermissionDoctorUpdate  Permission = "doctor:update"
	PermissionDoctorDelete  Permission = "doctor:delete"
	PermissionDoctorApprove Permission = "doctor:approve"
	PermissionDoctorReject  Permission = "doctor:reject"

	// Patient permissions
	PermissionPatientCreate  Permission = "patient:create"
	PermissionPatientList    Permission = "patient:list"
	PermissionPatientView    Permission = "patient:view"
	PermissionPatientUpdate  Permission = "patient:update"
	PermissionPatientDelete  Permission = "patient:delete"
	PermissionPatientHistory Permission = "patient:history"

	// System permissions
	PermissionSystemConfig  Permission = "system:config"
	PermissionSystemMetrics Permission = "system:metrics"
	PermissionSystemLogs    Permission = "system:logs"
)

type SuperAdmin struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Username     string             `bson:"username"`
	Email        string             `bson:"email"`
	PasswordHash string             `bson:"password_hash"`
	Permissions  []string           `bson:"permissions"`
}

type Admin struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Username     string             `bson:"username"`
	Email        string             `bson:"email"`
	PasswordHash string             `bson:"password_hash"`
	CreatedBy    primitive.ObjectID `bson:"created_by"`
	Permissions  []string           `bson:"permissions"`
}

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
}

func DefaultSuperAdminPermissions() []Permission {
	return []Permission{
		PermissionAdminCreate,
		PermissionAdminList,
		PermissionAdminView,
		PermissionAdminUpdate,
		PermissionAdminDelete,
		PermissionDoctorCreate,
		PermissionDoctorList,
		PermissionDoctorView,
		PermissionDoctorUpdate,
		PermissionDoctorDelete,
		PermissionDoctorApprove,
		PermissionDoctorReject,
		PermissionPatientCreate,
		PermissionPatientList,
		PermissionPatientView,
		PermissionPatientUpdate,
		PermissionPatientDelete,
		PermissionPatientHistory,
		PermissionSystemConfig,
		PermissionSystemMetrics,
		PermissionSystemLogs,
	}
}

func DefaultAdminPermissions() []Permission {
	return []Permission{
		PermissionDoctorList,
		PermissionDoctorView,
		PermissionPatientList,
		PermissionPatientView,
		PermissionPatientHistory,
	}
}

type User struct {
	ID          string       `json:"id" bson:"_id,omitempty"`
	Email       string       `json:"email" bson:"email"`
	Password    string       `json:"-" bson:"password"`
	Name        string       `json:"name" bson:"name"`
	Role        string       `json:"role" bson:"role"`
	Permissions []Permission `json:"permissions" bson:"permissions"`
	CreatedAt   string       `json:"created_at" bson:"created_at"`
	UpdatedAt   string       `json:"updated_at" bson:"updated_at"`
}
