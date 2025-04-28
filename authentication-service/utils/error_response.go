package utils

import (
	"encoding/json"
	"net/http"
)

// RespondWithError returns a JSON formatted error response
func RespondWithError(w http.ResponseWriter, code int, message string) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}
