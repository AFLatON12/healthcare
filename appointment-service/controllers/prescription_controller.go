package controllers

import (
	"context"
	"time"

	"appointment-service/clients"
	"appointment-service/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// PrescriptionController handles prescription-related operations
type PrescriptionController struct {
	db         *mongo.Database
	authClient *clients.AuthClient
	collection *mongo.Collection
}

// NewPrescriptionController creates a new prescription controller
func NewPrescriptionController(db *mongo.Database, authClient *clients.AuthClient) *PrescriptionController {
	return &PrescriptionController{
		db:         db,
		authClient: authClient,
		collection: db.Collection("prescriptions"),
	}
}

// Create creates a new prescription
func (c *PrescriptionController) Create(ctx context.Context, prescription *models.Prescription) error {
	// Set timestamps
	prescription.CreatedAt = time.Now()

	result, err := c.collection.InsertOne(ctx, prescription)
	if err != nil {
		return err
	}
	prescription.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

// GetByID retrieves a prescription by ID
func (c *PrescriptionController) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Prescription, error) {
	var prescription models.Prescription
	err := c.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&prescription)
	if err != nil {
		return nil, err
	}
	return &prescription, nil
}

// GetByAppointmentID retrieves a prescription by appointment ID
func (c *PrescriptionController) GetByAppointmentID(ctx context.Context, appointmentID primitive.ObjectID) (*models.Prescription, error) {
	var prescription models.Prescription
	err := c.collection.FindOne(ctx, bson.M{"appointment_id": appointmentID}).Decode(&prescription)
	if err != nil {
		return nil, err
	}
	return &prescription, nil
}

// GetByPatientID retrieves all prescriptions for a patient
func (c *PrescriptionController) GetByPatientID(ctx context.Context, patientID primitive.ObjectID) ([]*models.Prescription, error) {
	cursor, err := c.collection.Find(ctx, bson.M{"patient_id": patientID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var prescriptions []*models.Prescription
	if err = cursor.All(ctx, &prescriptions); err != nil {
		return nil, err
	}
	return prescriptions, nil
}

// GetByDoctorID retrieves all prescriptions by a doctor
func (c *PrescriptionController) GetByDoctorID(ctx context.Context, doctorID primitive.ObjectID) ([]*models.Prescription, error) {
	cursor, err := c.collection.Find(ctx, bson.M{"doctor_id": doctorID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var prescriptions []*models.Prescription
	if err = cursor.All(ctx, &prescriptions); err != nil {
		return nil, err
	}
	return prescriptions, nil
}
