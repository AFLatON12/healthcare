package controllers

import (
	"context"
	"errors"
	"time"

	"appointment-service/clients"
	"appointment-service/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// AppointmentController handles appointment-related operations
type AppointmentController struct {
	db                    *mongo.Database
	authClient            *clients.AuthClient
	transactionClient     *clients.TransactionClient
	appointmentCollection *mongo.Collection
	patientRecordCtrl     *PatientRecordController
	prescriptionCtrl      *PrescriptionController
	doctorScheduleCtrl    *DoctorScheduleController
}

// NewAppointmentController creates a new appointment controller
func NewAppointmentController(db *mongo.Database, authClient *clients.AuthClient, transactionClient *clients.TransactionClient) *AppointmentController {
	// Initialize other controllers with auth client
	patientRecordCtrl := NewPatientRecordController(db, authClient)
	prescriptionCtrl := NewPrescriptionController(db, authClient)
	doctorScheduleCtrl := NewDoctorScheduleController(db, authClient)

	return &AppointmentController{
		db:                    db,
		authClient:            authClient,
		transactionClient:     transactionClient,
		appointmentCollection: db.Collection("appointments"),
		patientRecordCtrl:     patientRecordCtrl,
		prescriptionCtrl:      prescriptionCtrl,
		doctorScheduleCtrl:    doctorScheduleCtrl,
	}
}

// ScheduleAppointment creates a new appointment and initializes patient record if needed
func (c *AppointmentController) ScheduleAppointment(ctx context.Context, appointment *models.Appointment) error {
	// Validate time slot availability
	slots, err := c.doctorScheduleCtrl.GetAvailableSlots(ctx, appointment.DoctorID,
		appointment.StartTime, appointment.EndTime)
	if err != nil {
		return err
	}
	if len(slots) == 0 {
		return errors.New("no available slots for the selected time")
	}

	// Set initial values
	now := time.Now()
	appointment.Status = models.StatusPending
	appointment.CreatedAt = now
	appointment.UpdatedAt = now

	// Create appointment
	result, err := c.appointmentCollection.InsertOne(ctx, appointment)
	if err != nil {
		return err
	}
	appointment.ID = result.InsertedID.(primitive.ObjectID)

	// Initialize patient record if it doesn't exist
	_, err = c.patientRecordCtrl.GetByPatientID(ctx, appointment.PatientID)
	if err == mongo.ErrNoDocuments {
		record := models.NewPatientRecord(appointment.PatientID)
		if err := c.patientRecordCtrl.Create(ctx, record); err != nil {
			return err
		}
	}

	return nil
}

// ConfirmAppointment confirms a pending appointment
func (c *AppointmentController) ConfirmAppointment(ctx context.Context, appointmentID primitive.ObjectID) error {
	update := bson.M{
		"$set": bson.M{
			"status":     models.StatusConfirmed,
			"updated_at": time.Now(),
		},
	}
	result, err := c.appointmentCollection.UpdateOne(ctx, bson.M{
		"_id":    appointmentID,
		"status": models.StatusPending,
	}, update)

	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("appointment not found or not in pending status")
	}
	return nil
}

// StartAppointment marks an appointment as in progress
func (c *AppointmentController) StartAppointment(ctx context.Context, appointmentID primitive.ObjectID) error {
	update := bson.M{
		"$set": bson.M{
			"status":     models.StatusConfirmed,
			"updated_at": time.Now(),
		},
	}
	result, err := c.appointmentCollection.UpdateOne(ctx, bson.M{
		"_id":    appointmentID,
		"status": models.StatusConfirmed,
	}, update)

	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("appointment not found or not in confirmed status")
	}
	return nil
}

// CompleteAppointment handles the completion of an appointment
func (c *AppointmentController) CompleteAppointment(ctx context.Context, appointmentID primitive.ObjectID,
	notes string, prescription *models.Prescription) error {

	// Get appointment
	appointment, err := c.GetByID(ctx, appointmentID)
	if err != nil {
		return err
	}

	// Add doctor note
	note := models.DoctorNote{
		DoctorID: appointment.DoctorID,
		Note:     notes,
		Date:     time.Now(),
	}
	if err := c.patientRecordCtrl.AddDoctorNote(ctx, appointment.PatientID, note); err != nil {
		return err
	}

	// Create prescription if provided
	if prescription != nil {
		prescription.AppointmentID = appointmentID
		prescription.DoctorID = appointment.DoctorID
		prescription.PatientID = appointment.PatientID
		if err := c.prescriptionCtrl.Create(ctx, prescription); err != nil {
			return err
		}
	}

	// Update appointment status
	update := bson.M{
		"$set": bson.M{
			"status":     models.StatusCompleted,
			"notes":      notes,
			"updated_at": time.Now(),
		},
	}
	result, err := c.appointmentCollection.UpdateOne(ctx, bson.M{
		"_id":    appointmentID,
		"status": models.StatusConfirmed,
	}, update)

	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("appointment not found or not in progress")
	}
	return nil
}

// CancelAppointment cancels an appointment
func (c *AppointmentController) CancelAppointment(ctx context.Context, appointmentID primitive.ObjectID, reason string) error {
	update := bson.M{
		"$set": bson.M{
			"status":     models.StatusCancelled,
			"notes":      reason,
			"updated_at": time.Now(),
		},
	}
	result, err := c.appointmentCollection.UpdateOne(ctx, bson.M{
		"_id": appointmentID,
		"status": bson.M{
			"$in": []string{
				models.StatusPending,
				models.StatusConfirmed,
			},
		},
	}, update)

	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("appointment not found or cannot be canceled")
	}
	return nil
}

// GetByID retrieves an appointment by ID
func (c *AppointmentController) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Appointment, error) {
	var appointment models.Appointment
	err := c.appointmentCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&appointment)
	if err != nil {
		return nil, err
	}
	return &appointment, nil
}

// GetByPatientID retrieves all appointments for a patient
func (c *AppointmentController) GetByPatientID(ctx context.Context, patientID primitive.ObjectID) ([]*models.Appointment, error) {
	cursor, err := c.appointmentCollection.Find(ctx, bson.M{"patient_id": patientID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var appointments []*models.Appointment
	if err = cursor.All(ctx, &appointments); err != nil {
		return nil, err
	}
	return appointments, nil
}

// GetByDoctorID retrieves all appointments for a doctor
func (c *AppointmentController) GetByDoctorID(ctx context.Context, doctorID primitive.ObjectID) ([]*models.Appointment, error) {
	cursor, err := c.appointmentCollection.Find(ctx, bson.M{"doctor_id": doctorID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var appointments []*models.Appointment
	if err = cursor.All(ctx, &appointments); err != nil {
		return nil, err
	}
	return appointments, nil
}
