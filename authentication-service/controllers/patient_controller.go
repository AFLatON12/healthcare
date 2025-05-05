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

type PatientController struct {
	collection *mongo.Collection
}

func NewPatientController(db *mongo.Database) *PatientController {
	return &PatientController{
		collection: db.Collection("patients"),
	}
}

func (c *PatientController) Create(patient *models.Patient) error {
	_, err := c.collection.InsertOne(context.Background(), patient)
	return err
}

func (c *PatientController) GetByEmail(email string) (*models.Patient, error) {
	var patient models.Patient
	err := c.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&patient)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("patient not found")
		}
		return nil, err
	}
	return &patient, nil
}

func (pc *PatientController) GetByID(id primitive.ObjectID) (*models.Patient, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var patient models.Patient
	err := pc.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&patient)
	if err != nil {
		return nil, err
	}
	return &patient, nil
}

func (pc *PatientController) Update(id primitive.ObjectID, patient *models.Patient) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"name":               patient.Name,
			"email":              patient.Email,
			"phone":              patient.Phone,
			"address":            patient.Address,
			"date_of_birth":      patient.DateOfBirth,
			"gender":             patient.Gender,
			"medical_history":    patient.MedicalHistory,
			"insurance_provider": patient.InsuranceProvider,
		},
	}

	_, err := pc.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func (pc *PatientController) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := pc.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (pc *PatientController) GetByInsuranceProvider(provider string) ([]models.Patient, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := pc.collection.Find(ctx, bson.M{"insurance_provider": provider})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var patients []models.Patient
	if err = cursor.All(ctx, &patients); err != nil {
		return nil, err
	}
	return patients, nil
}

func (pc *PatientController) AddMedicalHistory(id primitive.ObjectID, history string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$push": bson.M{
			"medical_history": history,
		},
	}

	_, err := pc.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func (c *PatientController) List() ([]*models.Patient, error) {
	var patients []*models.Patient
	cursor, err := c.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &patients); err != nil {
		return nil, err
	}
	return patients, nil
}
