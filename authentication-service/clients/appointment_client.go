package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// AppointmentClient handles communication with the appointment service
type AppointmentClient struct {
	baseURL    string
	httpClient *http.Client
}

// NewAppointmentClient creates a new appointment service client
func NewAppointmentClient(baseURL string) *AppointmentClient {
	return &AppointmentClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

// GetDoctorAppointments retrieves appointments for a doctor
func (c *AppointmentClient) GetDoctorAppointments(token string, doctorID string) ([]map[string]interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/appointments/doctor/%s", c.baseURL, doctorID), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var appointments []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&appointments); err != nil {
		return nil, err
	}

	return appointments, nil
}

// GetPatientAppointments retrieves appointments for a patient
func (c *AppointmentClient) GetPatientAppointments(token string, patientID string) ([]map[string]interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v1/appointments/patient/%s", c.baseURL, patientID), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var appointments []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&appointments); err != nil {
		return nil, err
	}

	return appointments, nil
}
