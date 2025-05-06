const axios = require('axios');
const serviceConfig = require('../config/serviceConfig');

class AuthClient {
  constructor() {
    this.baseUrl = serviceConfig.authServiceUrl;
  }

  async getUserById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to get user from authentication service');
    }
  }

  // Add other auth client methods as needed
}

module.exports = new AuthClient();
