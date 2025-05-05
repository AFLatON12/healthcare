package controllers

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type BaseController struct {
	collection *mongo.Collection
}

func NewBaseController(client *mongo.Client, dbName, collectionName string) *BaseController {
	return &BaseController{
		collection: client.Database(dbName).Collection(collectionName),
	}
}

func (bc *BaseController) ConnectDB(uri string) (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return client, nil
}
