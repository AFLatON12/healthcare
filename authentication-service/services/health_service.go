package services

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type HealthService struct {
	db *mongo.Database
}

type HealthStatus struct {
	Status    string            `json:"status"`
	Timestamp time.Time         `json:"timestamp"`
	Services  map[string]string `json:"services"`
	Version   string            `json:"version"`
}

func NewHealthService(db *mongo.Database) *HealthService {
	return &HealthService{
		db: db,
	}
}

func (hs *HealthService) Check() *HealthStatus {
	status := &HealthStatus{
		Status:    "healthy",
		Timestamp: time.Now(),
		Services:  make(map[string]string),
		Version:   "1.0.0",
	}

	// Check MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err := hs.db.Client().Ping(ctx, readpref.Primary())
	if err != nil {
		status.Status = "unhealthy"
		status.Services["mongodb"] = "unhealthy: " + err.Error()
	} else {
		status.Services["mongodb"] = "healthy"
	}

	// Add more service checks here as needed
	// For example: Redis, external APIs, etc.

	return status
}
