const API_BASE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:3001';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + getAuthToken(),
});

export const fetchPatientProfile = async (patientId) => {
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch patient profile');
  }
  return response.json();
};

export const updatePatientProfile = async (patientId, profileData) => {
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    throw new Error('Failed to update patient profile');
  }
  return response.json();
};