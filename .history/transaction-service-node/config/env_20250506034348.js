const dotenv = require('dotenv');

dotenv.config();

const loadEnv = () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  if (!process.env.PORT) {
    throw new Error('PORT environment variable is not set');
  }
  if (!process.env.AUTH_SERVICE_URL) {
    throw new Error('AUTH_SERVICE_URL environment variable is not set');
  }
  if (!process.env.APPOINTMENT_SERVICE_URL) {
    throw new Error('APPOINTMENT_SERVICE_URL environment variable is not set');
  }
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is not set');
  }
  // Add other required environment variables checks here as needed
};

module.exports = {
  loadEnv,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  APPOINTMENT_SERVICE_URL: process.env.APPOINTMENT_SERVICE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
