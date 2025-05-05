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

// PatientRecordController handles patient record-related operations
type PatientRecordController struct {
	collection *mongo.Collection
	authClient *clients.AuthClient
}

// NewPatientRecordController creates a new patient record controller
func NewPatientRecordController(db *mongo.Database, authClient *clients.AuthClient) *PatientRecordController {
	return &PatientRecordController{
		collection: db.Collection("patient_records"),
		authClient: authClient,
	}
}

// Create creates a new patient record
func (c *PatientRecordController) Create(ctx context.Context, record *models.PatientRecord) error {
	if record.DoctorNotes == nil {
		record.DoctorNotes = []models.DoctorNote{}
	}
	if record.TestResults == nil {
		record.TestResults = []models.TestResult{}
	}
	if record.Allergies == nil {
		record.Allergies = []string{}
	}
	if record.ChronicDiseases == nil {
		record.ChronicDiseases = []string{}
	}
	record.LastUpdated = time.Now()

	result, err := c.collection.InsertOne(ctx, record)
	if err != nil {
		return err
	}
	record.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

// GetByID retrieves a patient record by ID
func (c *PatientRecordController) GetByID(ctx context.Context, id primitive.ObjectID) (*models.PatientRecord, error) {
	var record models.PatientRecord
	err := c.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&record)
	if err != nil {
		return nil, err
	}
	return &record, nil
}

// GetByPatientID retrieves a patient record by patient ID
func (c *PatientRecordController) GetByPatientID(ctx context.Context, patientID primitive.ObjectID) (*models.PatientRecord, error) {
	var record models.PatientRecord
	err := c.collection.FindOne(ctx, bson.M{"patient_id": patientID}).Decode(&record)
	if err != nil {
		return nil, err
	}
	if record.DoctorNotes == nil {
		record.DoctorNotes = []models.DoctorNote{}
	}
	return &record, nil
}

// AddDoctorNote adds a new doctor note to the patient record
func (c *PatientRecordController) AddDoctorNote(ctx context.Context, patientID primitive.ObjectID, note models.DoctorNote) error {
	note.CreatedAt = time.Now()
	note.Date = time.Now()

	// First, ensure the patient record exists and has the doctor_notes array
	var record models.PatientRecord
	err := c.collection.FindOne(ctx, bson.M{"patient_id": patientID}).Decode(&record)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Create new record if it doesn't exist
			record = *models.NewPatientRecord(patientID)
		} else {
			return err
		}
	}

	// Initialize doctor_notes if it's nil
	if record.DoctorNotes == nil {
		record.DoctorNotes = []models.DoctorNote{}
	}

	update := bson.M{
		"$push": bson.M{
			"doctor_notes": note,
		},
		"$set": bson.M{
			"last_updated": time.Now(),
		},
	}

	_, err = c.collection.UpdateOne(ctx, bson.M{"patient_id": patientID}, update)
	return err
}

// AddTestResult adds a new test result to the patient record
func (c *PatientRecordController) AddTestResult(ctx context.Context, patientID primitive.ObjectID, result models.TestResult) error {
	result.DateTaken = time.Now()
	update := bson.M{
		"$push": bson.M{
			"test_results": result,
		},
		"$set": bson.M{
			"last_updated": time.Now(),
		},
	}
	_, err := c.collection.UpdateOne(ctx, bson.M{"patient_id": patientID}, update)
	return err
}

// UpdateAllergies updates the allergies list
func (c *PatientRecordController) UpdateAllergies(ctx context.Context, patientID primitive.ObjectID, allergies []string) error {
	update := bson.M{
		"$set": bson.M{
			"allergies":    allergies,
			"last_updated": time.Now(),
		},
	}
	_, err := c.collection.UpdateOne(ctx, bson.M{"patient_id": patientID}, update)
	return err
}

// UpdateChronicDiseases updates the chronic diseases list
func (c *PatientRecordController) UpdateChronicDiseases(ctx context.Context, patientID primitive.ObjectID, diseases []string) error {
	update := bson.M{
		"$set": bson.M{
			"chronic_diseases": diseases,
			"last_updated":     time.Now(),
		},
	}
	_, err := c.collection.UpdateOne(ctx, bson.M{"patient_id": patientID}, update)
	return err
}
