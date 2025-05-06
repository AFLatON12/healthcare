const mongoose = require('mongoose');
const serviceConfig = require('../config/serviceConfig');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(serviceConfig.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('MongoDB disconnection error:', err);
  }
};

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
