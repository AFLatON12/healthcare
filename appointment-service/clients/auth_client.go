package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"appointment-service/config"
)

// AuthClient handles communication with the authentication service
type AuthClient struct {
	baseURL    string
	httpClient *http.Client
}

// NewAuthClient creates a new authentication service client
func NewAuthClient(config *config.ServiceConfig) *AuthClient {
	return &AuthClient{
		baseURL: config.AuthServiceURL,
		httpClient: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

// VerifyToken verifies a JWT token with the authentication service
func (c *AuthClient) VerifyToken(token string) (bool, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/auth/verify", c.baseURL), nil)
	if err != nil {
		return false, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK, nil
}

// GetUserInfo retrieves user information from the authentication service
func (c *AuthClient) GetUserInfo(token string) (map[string]interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/auth/user-info", c.baseURL), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return userInfo, nil
}
