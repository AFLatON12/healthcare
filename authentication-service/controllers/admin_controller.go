package controllers

import (
	"context"
	"errors"
	"time"

	"healthcare/authentication-service/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AdminController struct {
	collection *mongo.Collection
}

func NewAdminController(db *mongo.Database) *AdminController {
	return &AdminController{
		collection: db.Collection("admins"),
	}
}

func (c *AdminController) Create(admin *models.Admin) error {
	_, err := c.collection.InsertOne(context.Background(), admin)
	return err
}

func (c *AdminController) GetByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	err := c.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&admin)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("admin not found")
		}
		return nil, err
	}
	return &admin, nil
}

func (ac *AdminController) GetByID(id primitive.ObjectID) (*models.Admin, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var admin models.Admin
	err := ac.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&admin)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (ac *AdminController) Update(id primitive.ObjectID, admin *models.Admin) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"username":    admin.Username,
			"email":       admin.Email,
			"permissions": admin.Permissions,
		},
	}

	_, err := ac.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func (ac *AdminController) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := ac.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (ac *AdminController) GetByCreatedBy(createdBy primitive.ObjectID) ([]models.Admin, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := ac.collection.Find(ctx, bson.M{"created_by": createdBy})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var admins []models.Admin
	if err = cursor.All(ctx, &admins); err != nil {
		return nil, err
	}
	return admins, nil
}

func (c *AdminController) List() ([]*models.Admin, error) {
	var admins []*models.Admin
	cursor, err := c.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &admins); err != nil {
		return nil, err
	}
	return admins, nil
}
