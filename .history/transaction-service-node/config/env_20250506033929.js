const dotenv = require('dotenv');

dotenv.config();

const loadEnv = () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  if (!process.env.PORT) {
    throw new Error('PORT environment variable is not set');
  }
  // Add other required environment variables checks here as needed
};

module.exports = {
  loadEnv,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
};
