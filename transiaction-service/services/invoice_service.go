package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/heelth/transiaction-service/models"
)

// InvoiceService handles invoice management logic
type InvoiceService struct{}

// NewInvoiceService creates a new invoice service
func NewInvoiceService() *InvoiceService {
	return &InvoiceService{}
}

// ProcessInvoice handles invoice processing and validation
func (is *InvoiceService) ProcessInvoice(invoice *models.Invoice) error {
	// Validate invoice fields
	if err := ValidateAmount(invoice.Amount); err != nil {
		return err
	}
	if err := ValidatePatientID(invoice.PatientID); err != nil {
		return err
	}
	if err := ValidateDate(invoice.DueDate); err != nil {
		return err
	}

	// Set initial status and dates
	invoice.Status = "draft"
	invoice.IssuedDate = time.Now()
	invoice.CreatedAt = time.Now()
	invoice.UpdatedAt = time.Now()

	return nil
}

// UpdateInvoiceStatus updates the invoice status with validation
func (is *InvoiceService) UpdateInvoiceStatus(invoice *models.Invoice, newStatus string) error {
	if err := ValidateInvoiceStatus(newStatus); err != nil {
		return err
	}

	// Validate status transition
	validTransitions := map[string][]string{
		"draft":     {"issued", "cancelled"},
		"issued":    {"paid", "overdue"},
		"paid":      {},
		"overdue":   {"paid", "cancelled"},
		"cancelled": {},
	}

	if !isValidTransition(invoice.Status, newStatus, validTransitions) {
		return ErrInvalidStatus
	}

	invoice.Status = newStatus
	invoice.UpdatedAt = time.Now()

	return nil
}

// CalculateTotalAmount calculates the total amount including all items
func (is *InvoiceService) CalculateTotalAmount(invoice *models.Invoice) float64 {
	total := 0.0
	for _, item := range invoice.Items {
		total += item.Amount * float64(item.Quantity)
	}
	return total
}

// CheckOverdueStatus checks if the invoice is overdue
func (is *InvoiceService) CheckOverdueStatus(invoice *models.Invoice) bool {
	if invoice.Status != "issued" {
		return false
	}
	return time.Now().After(invoice.DueDate)
}

// CalculateLateFees calculates late fees for overdue invoices
func (is *InvoiceService) CalculateLateFees(invoice *models.Invoice) float64 {
	if !is.CheckOverdueStatus(invoice) {
		return 0
	}

	daysOverdue := int(time.Since(invoice.DueDate).Hours() / 24)
	lateFeeRate := 0.05 // 5% per month
	monthsOverdue := float64(daysOverdue) / 30.0

	return invoice.Amount * lateFeeRate * monthsOverdue
}

// GenerateInvoiceNumber generates a unique invoice number
func (is *InvoiceService) GenerateInvoiceNumber(invoice *models.Invoice) string {
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("INV-%s-%s", invoice.PatientID[:6], timestamp)
}

// ProcessPartialPayment handles partial payment processing
func (is *InvoiceService) ProcessPartialPayment(invoice *models.Invoice, paymentAmount float64) error {
	if paymentAmount <= 0 || paymentAmount > invoice.Amount {
		return errors.New("invalid payment amount: must be greater than 0 and not exceed the invoice amount")
	}

	invoice.Amount -= paymentAmount
	invoice.UpdatedAt = time.Now()

	if invoice.Amount == 0 {
		return is.UpdateInvoiceStatus(invoice, "paid")
	}

	return nil
}
