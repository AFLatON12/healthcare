const express = require('express');
const cors = require('cors');
const serviceConfig = require('./config/serviceConfig');
const { connectMongoDB, disconnectMongoDB } = require('./db/mongodb');

const paymentRoutes = require('./routes/paymentRoutes');
const claimRoutes = require('./routes/claimRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const startServer = async () => {
  await connectMongoDB();

  app.use('/api/payments', paymentRoutes);
  app.use('/api/claims', claimRoutes);
  app.use('/api/invoices', invoiceRoutes);

  const port = serviceConfig.port || 8082;
  app.listen(port, () => {
    console.log(`Transaction service running on port ${port}`);
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down transaction service...');
    await disconnectMongoDB();
    process.exit(0);
  });
};

startServer().catch((err) => {
  console.error('Failed to start transaction service:', err);
  process.exit(1);
});
