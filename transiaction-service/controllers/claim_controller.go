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

type ClaimController struct {
	collection *mongo.Collection
	service    *services.ClaimService
}

func NewClaimController(db *mongo.Database) *ClaimController {
	return &ClaimController{
		collection: db.Collection("claims"),
		service:    services.NewClaimService(),
	}
}

func (cc *ClaimController) CreateClaim(c *gin.Context) {
	var claim models.Claim
	if err := c.ShouldBindJSON(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Process claim through service
	if err := cc.service.ProcessClaim(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate documentation
	if err := cc.service.ValidateDocumentation(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := cc.collection.InsertOne(context.Background(), claim)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	claim.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, claim)
}

func (cc *ClaimController) GetClaim(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var claim models.Claim
	err = cc.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&claim)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Claim not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, claim)
}

func (cc *ClaimController) UpdateClaim(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var claim models.Claim
	if err := c.ShouldBindJSON(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get existing claim
	var existingClaim models.Claim
	err = cc.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&existingClaim)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Claim not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update status through service
	if claim.Status != existingClaim.Status {
		if err := cc.service.UpdateClaimStatus(&existingClaim, claim.Status); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		claim.Status = existingClaim.Status
	}

	claim.UpdatedAt = time.Now()
	update := bson.M{
		"$set": claim,
	}

	result, err := cc.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Claim not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim updated successfully"})
}

func (cc *ClaimController) ListClaims(c *gin.Context) {
	var claims []models.Claim

	filter := bson.M{}
	if patientID := c.Query("patient_id"); patientID != "" {
		filter["patient_id"] = patientID
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}

	cursor, err := cc.collection.Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &claims); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, claims)
}

func (cc *ClaimController) RejectClaim(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var rejectionData struct {
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&rejectionData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var claim models.Claim
	err = cc.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&claim)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Claim not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := cc.service.ProcessClaimRejection(&claim, rejectionData.Reason); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	update := bson.M{
		"$set": claim,
	}

	_, err = cc.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim rejected successfully"})
}
