const API_BASE_URL = '/api/appointments';

export async function fetchAppointmentsByPatient(patientId) {
  const response = await fetch(`${API_BASE_URL}/patient/${patientId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json();
}

export async function createAppointment(appointmentData) {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }
  return response.json();
}

export async function updateAppointmentStatus(appointmentId, status, extraData = {}) {
  const response = await fetch(`${API_BASE_URL}/${appointmentId}/confirm`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...extraData }),
  });
  if (!response.ok) {
    throw new Error('Failed to update appointment status');
  }
  return response.json();
}

export async function deleteAppointment(appointmentId) {
  const response = await fetch(`${API_BASE_URL}/${appointmentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
  return response.json();
}
