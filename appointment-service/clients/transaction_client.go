package clients

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"appointment-service/config"
)

// TransactionClient handles communication with the transaction service
type TransactionClient struct {
	baseURL    string
	httpClient *http.Client
}

// NewTransactionClient creates a new transaction service client
func NewTransactionClient(config *config.ServiceConfig) *TransactionClient {
	return &TransactionClient{
		baseURL: config.TransactionServiceURL,
		httpClient: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

// CreatePayment creates a new payment transaction
func (c *TransactionClient) CreatePayment(token string, amount float64, description string) (map[string]interface{}, error) {
	paymentData := map[string]interface{}{
		"amount":      amount,
		"description": description,
	}

	jsonData, err := json.Marshal(paymentData)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/api/v1/transactions/payment", c.baseURL), bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}

// GetTransactionStatus retrieves the status of a transaction
func (c *TransactionClient) GetTransactionStatus(token string, transactionID string) (map[string]interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/transactions/%s/status", c.baseURL, transactionID), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var status map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&status); err != nil {
		return nil, err
	}

	return status, nil
}
