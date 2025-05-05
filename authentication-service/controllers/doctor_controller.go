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

type DoctorController struct {
	collection *mongo.Collection
}

func NewDoctorController(db *mongo.Database) *DoctorController {
	return &DoctorController{
		collection: db.Collection("doctors"),
	}
}

func (dc *DoctorController) Create(doctor *models.Doctor) error {
	now := time.Now()
	doctor.CreatedAt = now
	doctor.UpdatedAt = now
	doctor.IsApproved = false // New doctors start as unapproved
	doctor.Available = true   // By default, new doctors are available

	_, err := dc.collection.InsertOne(context.Background(), doctor)
	return err
}

func (dc *DoctorController) GetByEmail(email string) (*models.Doctor, error) {
	var doctor models.Doctor
	err := dc.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&doctor)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("doctor not found")
		}
		return nil, err
	}
	return &doctor, nil
}

func (dc *DoctorController) GetByID(id primitive.ObjectID) (*models.Doctor, error) {
	var doctor models.Doctor
	err := dc.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&doctor)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("doctor not found")
		}
		return nil, err
	}
	return &doctor, nil
}

func (dc *DoctorController) Update(id primitive.ObjectID, doctor *models.Doctor) error {
	doctor.UpdatedAt = time.Now()

	update := bson.M{
		"$set": bson.M{
			"name":             doctor.Name,
			"email":            doctor.Email,
			"specialization":   doctor.Specialization,
			"license_number":   doctor.LicenseNumber,
			"qualifications":   doctor.Qualifications,
			"experience_years": doctor.ExperienceYears,
			"phone":            doctor.Phone,
			"bio":              doctor.Bio,
			"is_approved":      doctor.IsApproved,
			"available":        doctor.Available,
			"updated_at":       doctor.UpdatedAt,
		},
	}

	// Only update password if it's provided
	if doctor.PasswordHash != "" {
		update["$set"].(bson.M)["password_hash"] = doctor.PasswordHash
	}

	_, err := dc.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	return err
}

func (dc *DoctorController) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := dc.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (dc *DoctorController) GetBySpecialization(specialization string) ([]models.Doctor, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := dc.collection.Find(ctx, bson.M{"specialization": specialization})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var doctors []models.Doctor
	if err = cursor.All(ctx, &doctors); err != nil {
		return nil, err
	}
	return doctors, nil
}

func (dc *DoctorController) GetAvailableDoctors() ([]models.Doctor, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := dc.collection.Find(ctx, bson.M{"available": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var doctors []models.Doctor
	if err = cursor.All(ctx, &doctors); err != nil {
		return nil, err
	}
	return doctors, nil
}

func (dc *DoctorController) List(filter bson.M) ([]*models.Doctor, error) {
	if filter == nil {
		filter = bson.M{}
	}

	cursor, err := dc.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var doctors []*models.Doctor
	if err = cursor.All(context.Background(), &doctors); err != nil {
		return nil, err
	}
	return doctors, nil
}

func (dc *DoctorController) ListPending() ([]*models.Doctor, error) {
	return dc.List(bson.M{"is_approved": false})
}

func (dc *DoctorController) ListApproved() ([]*models.Doctor, error) {
	return dc.List(bson.M{"is_approved": true})
}

func (dc *DoctorController) ListAvailable() ([]*models.Doctor, error) {
	return dc.List(bson.M{"is_approved": true, "available": true})
}

func (dc *DoctorController) Approve(id primitive.ObjectID) error {
	update := bson.M{
		"$set": bson.M{
			"is_approved": true,
			"updated_at":  time.Now(),
		},
	}

	_, err := dc.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	return err
}

func (dc *DoctorController) Reject(id primitive.ObjectID) error {
	_, err := dc.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
