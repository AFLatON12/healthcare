const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const mongoose = require('mongoose');

// Helper middleware to validate ObjectId params
function validateObjectId(param) {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
      return res.status(400).json({ error: `Invalid ${param} format` });
    }
    next();
  };
}

// Create a new payment record
router.post('/', async (req, res) => {
  try {
    const { appointmentId, amount, method } = req.body;
    if (!appointmentId || !amount || !method) {
      return res.status(400).json({ error: 'appointmentId, amount, and method are required' });
    }
    const payment = await paymentController.createPayment(appointmentId, amount, method);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment status
router.put('/:id/status', validateObjectId('id'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }
    const payment = await paymentController.updatePaymentStatus(req.params.id, status);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payment by appointment ID
router.get('/appointment/:appointmentId', validateObjectId('appointmentId'), async (req, res) => {
  try {
    const payment = await paymentController.getPaymentByAppointment(req.params.appointmentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
