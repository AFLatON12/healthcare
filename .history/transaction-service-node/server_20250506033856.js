require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const serviceConfig = require('./config/serviceConfig');
const { connectMongoDB, disconnectMongoDB } = require('./db/mongodb');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const paymentRoutes = require('./routes/paymentRoutes');
const claimRoutes = require('./routes/claimRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/payments', paymentRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectMongoDB();

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
