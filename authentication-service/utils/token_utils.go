package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

// GenerateRandomToken generates a secure random token with the specified byte length
func GenerateRandomToken(nBytes int) (string, error) {
	bytes := make([]byte, nBytes)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}
	return hex.EncodeToString(bytes), nil
}
