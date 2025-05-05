package services

import (
	"errors"
	"time"

	"transiaction-service/models"
)

// ClaimService handles insurance claim processing logic
type ClaimService struct{}

// NewClaimService creates a new claim service
func NewClaimService() *ClaimService {
	return &ClaimService{}
}

// ProcessClaim handles claim processing and validation
func (cs *ClaimService) ProcessClaim(claim *models.Claim) error {
	// Validate claim fields
	if err := ValidateAmount(claim.Amount); err != nil {
		return err
	}
	if err := ValidatePatientID(claim.PatientID); err != nil {
		return err
	}
	if err := ValidateDate(claim.ServiceDate); err != nil {
		return err
	}

	// Set initial status and dates
	claim.Status = "submitted"
	claim.SubmissionDate = time.Now()
	claim.CreatedAt = time.Now()
	claim.UpdatedAt = time.Now()

	return nil
}

// UpdateClaimStatus updates the claim status with validation
func (cs *ClaimService) UpdateClaimStatus(claim *models.Claim, newStatus string) error {
	if err := ValidateClaimStatus(newStatus); err != nil {
		return err
	}

	// Validate status transition
	validTransitions := map[string][]string{
		"submitted":    {"under_review", "rejected"},
		"under_review": {"approved", "rejected"},
		"approved":     {"paid"},
		"rejected":     {},
		"paid":         {},
	}

	if !isValidTransition(claim.Status, newStatus, validTransitions) {
		return ErrInvalidStatus
	}

	claim.Status = newStatus
	claim.UpdatedAt = time.Now()

	return nil
}

// CalculateClaimAmount calculates the claim amount based on coverage
func (cs *ClaimService) CalculateClaimAmount(claim *models.Claim, coveragePercentage float64) float64 {
	if coveragePercentage < 0 || coveragePercentage > 100 {
		return 0
	}
	return claim.Amount * (coveragePercentage / 100)
}

// ValidateDocumentation checks if the claim documentation is valid
func (cs *ClaimService) ValidateDocumentation(claim *models.Claim) error {
	if claim.DocumentationURL == "" {
		return errors.New("documentation URL is required")
	}
	// Add additional documentation validation logic here
	return nil
}

// ProcessClaimRejection handles claim rejection logic
func (cs *ClaimService) ProcessClaimRejection(claim *models.Claim, rejectionReason string) error {
	claim.Status = "rejected"
	claim.Description = rejectionReason
	claim.UpdatedAt = time.Now()
	return nil
}
