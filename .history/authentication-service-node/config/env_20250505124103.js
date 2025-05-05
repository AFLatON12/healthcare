const dotenv = require('dotenv');

dotenv.config();

const loadEnv = () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST environment variable is not set');
  }
  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT environment variable is not set');
  }
  if (!process.env.REDIS_USERNAME) {
    throw new Error('REDIS_USERNAME environment variable is not set');
  }
  if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD environment variable is not set');
  }
  // Add other required environment variables checks here
};

module.exports = {
  loadEnv,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
