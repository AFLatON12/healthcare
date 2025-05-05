const dotenv = require('dotenv');

dotenv.config();

const serviceConfig = {
  port: process.env.PORT || 8080,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/appointment_management_db',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  transactionServiceUrl: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3002',
};

module.exports = serviceConfig;
