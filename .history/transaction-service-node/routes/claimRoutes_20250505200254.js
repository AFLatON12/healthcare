const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
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

// Create a new claim
router.post('/', async (req, res) => {
  try {
    const claim = await claimController.createClaim(req.body);
    res.status(201).json(claim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get claim by ID
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const claim = await claimController.getClaim(req.params.id);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update claim by ID
router.put('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const updated = await claimController.updateClaim(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json({ message: 'Claim updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List claims with optional filters
router.get('/', async (req, res) => {
  try {
    const claims = await claimController.listClaims(req.query);
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject claim by ID
router.post('/:id/reject', validateObjectId('id'), async (req, res) => {
  try {
    const rejected = await claimController.rejectClaim(req.params.id);
    if (!rejected) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json({ message: 'Claim rejected successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
