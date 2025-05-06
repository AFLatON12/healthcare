const express = require('express');
const cors = require('cors');
const serviceConfig = require('./config/serviceConfig');
const { connectMongoDB, disconnectMongoDB } = require('./db/mongodb');

const PaymentController = require('./controllers/paymentController');
const ClaimController = require('./controllers/claimController');
const InvoiceController = require('./controllers/invoiceController');

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
  const db = await connectMongoDB();

  // Instantiate controllers with db
  const paymentController = new PaymentController(db);
  const claimController = new ClaimController(db);
  const invoiceController = new InvoiceController(db);

  // Pass controllers to routes
  app.use('/api/payments', paymentRoutes(paymentController));
  app.use('/api/claims', claimRoutes(claimController));
  app.use('/api/invoices', invoiceRoutes(invoiceController));

  const port = serviceConfig.port || 8082;
  app.listen(port, () => {
    console.log(`Transaction service running on port ${port}`);
  });

  // Handle graceful shutdown
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
