package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// TransactionClient handles communication with the transaction service
type TransactionClient struct {
	baseURL    string
	httpClient *http.Client
}

// NewTransactionClient creates a new transaction service client
func NewTransactionClient(baseURL string) *TransactionClient {
	return &TransactionClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

// GetUserTransactions retrieves transactions for a user
func (c *TransactionClient) GetUserTransactions(token string, userID string) ([]map[string]interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/transactions/user/%s", c.baseURL, userID), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var transactions []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&transactions); err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetTransactionDetails retrieves details of a specific transaction
func (c *TransactionClient) GetTransactionDetails(token string, transactionID string) (map[string]interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/transactions/%s", c.baseURL, transactionID), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var transaction map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&transaction); err != nil {
		return nil, err
	}

	return transaction, nil
}
