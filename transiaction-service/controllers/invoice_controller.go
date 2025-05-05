package controllers

import (
	"context"
	"net/http"
	"time"

	"transiaction-service/models"
	"transiaction-service/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// InvoiceController handles invoice-related operations
type InvoiceController struct {
	collection *mongo.Collection
	service    *services.InvoiceService
}

// NewInvoiceController creates a new invoice controller
func NewInvoiceController(db *mongo.Database) *InvoiceController {
	return &InvoiceController{
		collection: db.Collection("invoices"),
		service:    services.NewInvoiceService(),
	}
}

// CreateInvoice handles the creation of a new invoice
func (ic *InvoiceController) CreateInvoice(c *gin.Context) {
	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Process invoice through service
	if err := ic.service.ProcessInvoice(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calculate total amount
	invoice.Amount = ic.service.CalculateTotalAmount(&invoice)

	// Generate invoice number
	invoice.ID = primitive.NewObjectID()
	invoice.Description = ic.service.GenerateInvoiceNumber(&invoice)

	result, err := ic.collection.InsertOne(context.Background(), invoice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	invoice.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, invoice)
}

// GetInvoice retrieves an invoice by ID
func (ic *InvoiceController) GetInvoice(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var invoice models.Invoice
	err = ic.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&invoice)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Check if invoice is overdue
	if ic.service.CheckOverdueStatus(&invoice) {
		lateFees := ic.service.CalculateLateFees(&invoice)
		invoice.Amount += lateFees
	}

	c.JSON(http.StatusOK, invoice)
}

// UpdateInvoice updates an invoice by ID
func (ic *InvoiceController) UpdateInvoice(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get existing invoice
	var existingInvoice models.Invoice
	err = ic.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&existingInvoice)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update status through service
	if invoice.Status != existingInvoice.Status {
		if err := ic.service.UpdateInvoiceStatus(&existingInvoice, invoice.Status); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		invoice.Status = existingInvoice.Status
	}

	invoice.UpdatedAt = time.Now()
	update := bson.M{
		"$set": invoice,
	}

	result, err := ic.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice updated successfully"})
}

// ListInvoices retrieves all invoices with optional filtering
func (ic *InvoiceController) ListInvoices(c *gin.Context) {
	var invoices []models.Invoice

	filter := bson.M{}
	if patientID := c.Query("patient_id"); patientID != "" {
		filter["patient_id"] = patientID
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}

	cursor, err := ic.collection.Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &invoices); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Calculate late fees for overdue invoices
	for i := range invoices {
		if ic.service.CheckOverdueStatus(&invoices[i]) {
			lateFees := ic.service.CalculateLateFees(&invoices[i])
			invoices[i].Amount += lateFees
		}
	}

	c.JSON(http.StatusOK, invoices)
}

// ProcessPartialPayment handles partial payment processing
func (ic *InvoiceController) ProcessPartialPayment(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var paymentData struct {
		Amount float64 `json:"amount"`
	}
	if err := c.ShouldBindJSON(&paymentData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var invoice models.Invoice
	err = ic.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&invoice)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := ic.service.ProcessPartialPayment(&invoice, paymentData.Amount); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	update := bson.M{
		"$set": invoice,
	}

	_, err = ic.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Partial payment processed successfully"})
}
