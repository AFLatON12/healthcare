package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CacheData struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	CacheKey  string             `bson:"cache_key" json:"cache_key"`
	Data      interface{}        `bson:"data" json:"data"`
	ExpiresAt time.Time          `bson:"expires_at" json:"expires_at"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}
