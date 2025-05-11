const API_BASE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE_URL || 'http://localhost:8080';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + getAuthToken(),
});

export const fetchPrescriptionsByPatient = async (patientId) => {
  const response = await fetch(`${API_BASE_URL}/prescriptions/${patientId}`, {
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch prescriptions');
  }
  return response.json();
};
</create_file>
