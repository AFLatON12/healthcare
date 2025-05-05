const dotenv = require('dotenv');

const loadEnv = () => {
  dotenv.config();

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  // Add other required environment variables checks here
};

module.exports = { loadEnv };
