const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Endpoint to create Paymob payment session and return payment token
router.post('/paymob-session', async (req, res) => {
  try {
    const paymentData = req.body;
    const paymentToken = await paymentController.createPaymobPaymentSession(paymentData);
    res.json({ paymentToken });
  } catch (error) {
    console.error('Error creating Paymob payment session:', error);
    res.status(500).json({ error: 'Failed to create Paymob payment session' });
  }
});

module.exports = router;
