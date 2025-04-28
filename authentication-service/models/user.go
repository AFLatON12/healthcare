package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string             `bson:"name" json:"name"`
	Email       string             `bson:"email" json:"email"`
	Password    string             `bson:"password,omitempty" json:"-"`
	Role        string             `bson:"role" json:"role"`
	Permissions []string           `bson:"permissions,omitempty" json:"permissions,omitempty"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}
