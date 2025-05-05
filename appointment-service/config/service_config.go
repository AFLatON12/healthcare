package config

import "os"

// ServiceConfig holds the configuration for all services
type ServiceConfig struct {
	AuthServiceURL        string
	TransactionServiceURL string
}

// NewServiceConfig creates a new service configuration
func NewServiceConfig() *ServiceConfig {
	return &ServiceConfig{
		AuthServiceURL:        getEnv("AUTH_SERVICE_URL", "http://auth_service:8000"),
		TransactionServiceURL: getEnv("TRANSACTION_SERVICE_URL", "http://transaction_service:3002"),
	}
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
