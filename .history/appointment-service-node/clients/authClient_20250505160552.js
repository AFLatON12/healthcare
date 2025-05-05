const axios = require('axios');
const axios = require('axios');
const serviceConfig = require('../config/serviceConfig');

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

module.exports = new AuthClient();
