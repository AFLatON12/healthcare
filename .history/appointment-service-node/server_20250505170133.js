const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorScheduleRoutes = require('./routes/doctorScheduleRoutes');
const { connectMongoDB, disconnectMongoDB } = require('./db/mongodb');
const serviceConfig = require('./config/serviceConfig');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const startServer = async () => {
  await connectMongoDB();

  // Routes
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/doctor-schedule', doctorScheduleRoutes);

  const port = serviceConfig.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await disconnectMongoDB();
    process.exit(0);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
