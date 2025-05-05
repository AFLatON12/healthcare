const dotenv = require('dotenv');

dotenv.config();

const loadEnv = () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  // Add other required environment variables checks here
};

module.exports = { loadEnv, JWT_SECRET: process.env.JWT_SECRET, MONGO_URI: process.env.MONGO_URI };
