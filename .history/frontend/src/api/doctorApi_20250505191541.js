const API_BASE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8000/api/v1'; // Adjust port as needed

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + getAuthToken(),
});

export const fetchDoctors = async () => {
  const response = await fetch(API_BASE_URL + '/doctors', {
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }
  return response.json();
};
