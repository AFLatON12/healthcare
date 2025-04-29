package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client *mongo.Client
	err    error
)

// ConnectDB establishes a connection to the MongoDB database
func ConnectDB() error {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get MongoDB connection string from environment variable
	connectionString := os.Getenv("MONGODB_URI")
	if connectionString == "" {
		// Fallback to default connection string if environment variable is not set
		connectionString = "mongodb+srv://680d1344ee66c1409f62693d:your_password@cluster1.mongodb.com/appointment_management_db?retryWrites=true&w=majority"
	}

	clientOptions := options.Client().ApplyURI(connectionString)

	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Printf("Error connecting to MongoDB: %v", err)
		return err
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Printf("Error pinging MongoDB: %v", err)
		return err
	}

	log.Println("Connected to MongoDB Atlas!")
	return nil
}

// GetDB returns the MongoDB client
func GetDB() *mongo.Client {
	return client
}

// GetCollection returns a MongoDB collection
func GetCollection(collectionName string) *mongo.Collection {
	return client.Database("healthcare").Collection(collectionName)
}
