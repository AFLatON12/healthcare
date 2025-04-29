package services

import (
	"errors"
	"time"
)

var (
	ErrInvalidAmount        = errors.New("invalid amount")
	ErrInvalidCurrency      = errors.New("invalid currency")
	ErrInvalidStatus        = errors.New("invalid status")
	ErrInvalidPaymentMethod = errors.New("invalid payment method")
	ErrInvalidDate          = errors.New("invalid date")
	ErrInvalidPatientID     = errors.New("invalid patient ID")
)

// ValidateAmount checks if the amount is positive
func ValidateAmount(amount float64) error {
	if amount <= 0 {
		return ErrInvalidAmount
	}
	return nil
}

// ValidateCurrency checks if the currency is supported
func ValidateCurrency(currency string) error {
	supportedCurrencies := map[string]bool{
		"USD": true,
		"EUR": true,
		"GBP": true,
	}
	if !supportedCurrencies[currency] {
		return ErrInvalidCurrency
	}
	return nil
}

// ValidatePaymentMethod checks if the payment method is supported
func ValidatePaymentMethod(method string) error {
	supportedMethods := map[string]bool{
		"credit_card":   true,
		"bank_transfer": true,
		"cash":          true,
		"insurance":     true,
	}
	if !supportedMethods[method] {
		return ErrInvalidPaymentMethod
	}
	return nil
}

// ValidatePaymentStatus checks if the payment status is valid
func ValidatePaymentStatus(status string) error {
	validStatuses := map[string]bool{
		"pending":    true,
		"processing": true,
		"completed":  true,
		"failed":     true,
		"refunded":   true,
	}
	if !validStatuses[status] {
		return ErrInvalidStatus
	}
	return nil
}

// ValidateClaimStatus checks if the claim status is valid
func ValidateClaimStatus(status string) error {
	validStatuses := map[string]bool{
		"submitted":    true,
		"under_review": true,
		"approved":     true,
		"rejected":     true,
		"paid":         true,
	}
	if !validStatuses[status] {
		return ErrInvalidStatus
	}
	return nil
}

// ValidateInvoiceStatus checks if the invoice status is valid
func ValidateInvoiceStatus(status string) error {
	validStatuses := map[string]bool{
		"draft":     true,
		"issued":    true,
		"paid":      true,
		"overdue":   true,
		"cancelled": true,
	}
	if !validStatuses[status] {
		return ErrInvalidStatus
	}
	return nil
}

// ValidateDate checks if the date is valid
func ValidateDate(date time.Time) error {
	if date.IsZero() {
		return ErrInvalidDate
	}
	return nil
}

// ValidatePatientID checks if the patient ID is valid
func ValidatePatientID(patientID string) error {
	if patientID == "" {
		return ErrInvalidPatientID
	}
	return nil
}
