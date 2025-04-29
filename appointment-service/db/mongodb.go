package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var MongoClient *mongo.Client

// ConnectMongoDB establishes a connection to MongoDB
func ConnectMongoDB() error {
	uri := "mongodb+srv://ismailyasser:Z1x2c312@cluster1.46bw0ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}

	// Ping the database to verify connection
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return err
	}

	MongoClient = client
	log.Println("Successfully connected to MongoDB Atlas")
	return nil
}

// GetCollection returns a handle to the specified collection
func GetCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}

// DisconnectMongoDB closes the MongoDB connection
func DisconnectMongoDB() {
	if MongoClient != nil {
		if err := MongoClient.Disconnect(context.Background()); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v\n", err)
		}
	}
}
