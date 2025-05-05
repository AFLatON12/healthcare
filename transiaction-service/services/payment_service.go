package services

import (
	"time"

	"transiaction-service/models"
)

// PaymentService handles payment processing logic
type PaymentService struct{}

// NewPaymentService creates a new payment service
func NewPaymentService() *PaymentService {
	return &PaymentService{}
}

// ProcessPayment handles payment processing and validation
func (ps *PaymentService) ProcessPayment(payment *models.Payment) error {
	// Validate payment fields
	if err := ValidateAmount(payment.Amount); err != nil {
		return err
	}
	if err := ValidateCurrency(payment.Currency); err != nil {
		return err
	}
	if err := ValidatePaymentMethod(payment.Method); err != nil {
		return err
	}
	if err := ValidatePatientID(payment.PatientID); err != nil {
		return err
	}

	// Set initial status
	payment.Status = "pending"
	payment.CreatedAt = time.Now()
	payment.UpdatedAt = time.Now()

	return nil
}

// UpdatePaymentStatus updates the payment status with validation
func (ps *PaymentService) UpdatePaymentStatus(payment *models.Payment, newStatus string) error {
	if err := ValidatePaymentStatus(newStatus); err != nil {
		return err
	}

	// More flexible status transitions
	validTransitions := map[string][]string{
		"pending":    {"processing", "completed", "cancelled"},
		"processing": {"completed", "failed", "cancelled"},
		"completed":  {"refunded", "failed"},
		"failed":     {"pending", "processing"},
		"cancelled":  {"pending"},
		"refunded":   {"completed"}, // Allow refund reversals
	}

	if !isValidTransition(payment.Status, newStatus, validTransitions) {
		return ErrInvalidStatus
	}

	payment.Status = newStatus
	payment.UpdatedAt = time.Now()

	return nil
}

// CalculatePaymentFees calculates any applicable fees
func (ps *PaymentService) CalculatePaymentFees(payment *models.Payment) float64 {
	fees := 0.0

	// Add processing fee based on payment method
	switch payment.Method {
	case "credit_card":
		fees += payment.Amount * 0.029 // 2.9% for credit card
	case "bank_transfer":
		fees += 1.0 // Fixed fee for bank transfer
	}

	return fees
}

// isValidTransition checks if a status transition is valid
func isValidTransition(currentStatus, newStatus string, validTransitions map[string][]string) bool {
	allowedTransitions, exists := validTransitions[currentStatus]
	if !exists {
		return false
	}

	for _, status := range allowedTransitions {
		if status == newStatus {
			return true
		}
	}
	return false
}
