package controllers

import (
	"context"
	"net/http"

	"transiaction-service/models"
	"transiaction-service/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// PaymentController handles payment-related operations
type PaymentController struct {
	collection *mongo.Collection
	service    *services.PaymentService
}

// NewPaymentController creates a new payment controller
func NewPaymentController(db *mongo.Database) *PaymentController {
	return &PaymentController{
		collection: db.Collection("payments"),
		service:    services.NewPaymentService(),
	}
}

// CreatePayment handles payment creation
func (pc *PaymentController) CreatePayment(c *gin.Context) {
	var payment models.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Process payment through service
	if err := pc.service.ProcessPayment(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calculate fees
	fees := pc.service.CalculatePaymentFees(&payment)
	payment.Amount += fees

	// Generate new ObjectID for the payment
	payment.ID = primitive.NewObjectID()

	result, err := pc.collection.InsertOne(context.Background(), payment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	payment.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, payment)
}

// GetPayment retrieves a payment by ID
func (pc *PaymentController) GetPayment(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID format"})
		return
	}

	var payment models.Payment
	err = pc.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&payment)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// UpdatePayment updates a payment's status
func (pc *PaymentController) UpdatePayment(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID format"})
		return
	}

	var payment models.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get existing payment
	var existingPayment models.Payment
	err = pc.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&existingPayment)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update status through service
	if payment.Status != existingPayment.Status {
		if err := pc.service.UpdatePaymentStatus(&existingPayment, payment.Status); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// Update payment fields
	update := bson.M{
		"$set": bson.M{
			"status":      payment.Status,
			"amount":      payment.Amount,
			"description": payment.Description,
			"method":      payment.Method,
			"updated_at":  existingPayment.UpdatedAt,
		},
	}

	result, err := pc.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment updated successfully"})
}

func (pc *PaymentController) ListPayments(c *gin.Context) {
	filter := bson.M{}

	// Add filters based on query parameters
	status := c.Query("status")
	if status != "" && status != "all" {
		filter["status"] = status
	}
	if patientID := c.Query("patient_id"); patientID != "" {
		filter["patient_id"] = patientID
	}

	cursor, err := pc.collection.Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	var payments []models.Payment
	if err := cursor.All(context.Background(), &payments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payments)
}
