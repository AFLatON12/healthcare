package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"healthcare/authentication-service/services"
)

type HealthHandler struct {
	healthService *services.HealthService
}

func NewHealthHandler(healthService *services.HealthService) *HealthHandler {
	return &HealthHandler{
		healthService: healthService,
	}
}

func (h *HealthHandler) Check(w http.ResponseWriter, r *http.Request) {
	log.Printf("Health check request received from %s", r.RemoteAddr)

	status := h.healthService.Check()
	log.Printf("Health check status: %s", status.Status)

	w.Header().Set("Content-Type", "application/json")
	if status.Status != "healthy" {
		w.WriteHeader(http.StatusServiceUnavailable)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	if err := json.NewEncoder(w).Encode(status); err != nil {
		log.Printf("Error encoding health check response: %v", err)
	}
}
