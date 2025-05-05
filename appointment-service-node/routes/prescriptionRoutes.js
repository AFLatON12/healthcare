const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Prescription = require('../models/Prescription');

// Fetch prescriptions for a specific patient
router.get('/prescriptions/:patientId', asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  try {
    const prescriptions = await Prescription.find({ patientId });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
}));

module.exports = router;