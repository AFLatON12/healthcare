const axios = require('axios');
const serviceConfig = require('../config/serviceConfig');

class TransactionClient {
  constructor() {
    this.baseUrl = serviceConfig.transactionServiceUrl;
  }

  async createTransaction(transactionData) {
    try {
      const response = await axios.post(\`\${this.baseUrl}/transactions\`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create transaction in transaction service');
    }
  }

  // Add other transaction client methods as needed
}

module.exports = new TransactionClient();
