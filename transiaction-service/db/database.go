package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client *mongo.Client
	db     *mongo.Database
	err    error
)

// ConnectDB establishes a connection to the MongoDB database
func ConnectDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// MongoDB Atlas connection string
	connectionString := "mongodb+srv://ismailyasser:Z1x2c312@cluster1.46bw0ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
	clientOptions := options.Client().ApplyURI(connectionString)

	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		return err
	}

	// Initialize the database
	db = client.Database("billing")

	log.Println("Connected to MongoDB Atlas!")
	return nil
}

// GetDB returns the MongoDB database instance
func GetDB() *mongo.Database {
	return db
}

// GetClient returns the MongoDB client
func GetClient() *mongo.Client {
	return client
}
