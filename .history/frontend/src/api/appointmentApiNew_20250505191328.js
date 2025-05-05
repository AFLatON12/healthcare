const API_BASE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE_URL || 'http://localhost:8080'; // Adjust port as needed

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + getAuthToken(),
});

export const fetchAppointmentsByPatient = async (patientId) => {
  const response = await fetch(API_BASE_URL + '/appointments?patientId=' + patientId, {
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json();
};

export const createAppointment = async (appointmentData) => {
  const response = await fetch(API_BASE_URL + '/appointments', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }
  return response.json();
};

export const updateAppointmentStatus = async (appointmentId, status, data = {}) => {
  const url = API_BASE_URL + '/appointments/' + appointmentId + '/' + status;
  const response = await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update appointment status to ' + status);
  }
  return response.json();
};

export const getAppointmentById = async (appointmentId) => {
  const response = await fetch(API_BASE_URL + '/appointments/' + appointmentId, {
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch appointment');
  }
  return response.json();
};

export const deleteAppointment = async (appointmentId) => {
  const response = await fetch(API_BASE_URL + '/appointments/' + appointmentId, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
  return response.json();
};
