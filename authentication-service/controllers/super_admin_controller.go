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

type SuperAdminController struct {
	collection *mongo.Collection
}

func NewSuperAdminController(db *mongo.Database) *SuperAdminController {
	return &SuperAdminController{
		collection: db.Collection("super_admins"),
	}
}

func (c *SuperAdminController) Create(admin *models.SuperAdmin) error {
	_, err := c.collection.InsertOne(context.Background(), admin)
	return err
}

func (c *SuperAdminController) GetByEmail(email string) (*models.SuperAdmin, error) {
	var admin models.SuperAdmin
	err := c.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&admin)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("super admin not found")
		}
		return nil, err
	}
	return &admin, nil
}

func (sac *SuperAdminController) GetByID(id primitive.ObjectID) (*models.SuperAdmin, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var superAdmin models.SuperAdmin
	err := sac.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&superAdmin)
	if err != nil {
		return nil, err
	}
	return &superAdmin, nil
}

func (sac *SuperAdminController) Update(id primitive.ObjectID, superAdmin *models.SuperAdmin) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"username":    superAdmin.Username,
			"email":       superAdmin.Email,
			"permissions": superAdmin.Permissions,
		},
	}

	_, err := sac.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func (sac *SuperAdminController) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := sac.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
