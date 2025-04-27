package db

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectMongoDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("❌ MongoDB connection error: ", err)
	}

	MongoClient = client
	log.Println("✅ Connected to MongoDB")
}

func GetCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}
