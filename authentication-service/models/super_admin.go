package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SuperAdmin struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Username     string             `bson:"username"`
	Email        string             `bson:"email"`
	PasswordHash string             `bson:"password_hash"`
	Permissions  []string           `bson:"permissions"`
}
