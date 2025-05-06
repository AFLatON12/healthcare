const axios = require('axios');
const serviceConfig = require('../config/env');

class AppointmentClient {
  constructor() {
    this.baseUrl = serviceConfig.appointmentServiceUrl;
  }

  async getAppointmentById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to get appointment from appointment service');
    }
  }

  // Add other appointment client methods as needed
}

module.exports = new AppointmentClient();
