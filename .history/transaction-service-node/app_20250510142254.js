const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register payment routes
app.use('/api/payments', paymentRoutes);

// Add other routes and middleware as needed

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Transaction service running on port ${PORT}`);
});
