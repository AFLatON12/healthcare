const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);

// Add other middleware or routes as needed

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Appointment service running on port ${PORT}`);
});
