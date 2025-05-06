const axios = require('axios');
const serviceConfig = require('../config/serviceConfig');
const { AUTH_SERVICE_URL } = require('../config/serviceConfig');

class AuthClient {
  constructor() {
    this.baseUrl = serviceConfig.authServiceUrl || 'http://localhost:5000/api/v1/auth';
  }

  async getUserById(userId) {
    try {
      const response = await axios.get(`${this.baseUrl}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user from auth service');
    }
  }

  // Add other auth client methods as needed
}

const getDoctorDetails = async (doctorId) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch doctor details for ID: ${doctorId}`, error);
    throw new Error('Unable to fetch doctor details');
  }
};

module.exports = { getDoctorDetails, AuthClient: new AuthClient() };
