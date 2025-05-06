const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const mongoose = require('mongoose');

// Middleware to validate ObjectId params
function validateObjectId(param) {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
      return res.status(400).json({ error: `Invalid ${param} format` });
    }
    next();
  };
}

// Create a new payment
router.post('/', async (req, res) => {
  try {
    const payment = await paymentController.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get payment by ID
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const payment = await paymentController.getPayment(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment by ID
router.put('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const updated = await paymentController.updatePayment(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List payments with optional filters
router.get('/', async (req, res) => {
  try {
    const payments = await paymentController.listPayments(req.query);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
