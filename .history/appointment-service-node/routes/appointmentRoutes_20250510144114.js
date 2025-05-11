const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
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

// Schedule a new appointment
router.post('/', async (req, res) => {
  try {
    const appointment = await appointmentController.scheduleAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirm appointment
router.put('/:id/confirm', validateObjectId('id'), async (req, res) => {
  try {
    const { price } = req.body;
    const appointment = await appointmentController.confirmAppointment(req.params.id, price);
    res.json({ message: 'Appointment confirmed successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start appointment
router.put('/:id/start', validateObjectId('id'), async (req, res) => {
  try {
    const appointment = await appointmentController.startAppointment(req.params.id);
    res.json({ message: 'Appointment started successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete appointment
router.put('/:id/complete', validateObjectId('id'), async (req, res) => {
  try {
    const { notes, prescription } = req.body;
    const appointment = await appointmentController.completeAppointment(req.params.id, notes, prescription);
    res.json({ message: 'Appointment completed successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel appointment
router.put('/:id/cancel', validateObjectId('id'), async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Reason is required' });
    }
    const appointment = await appointmentController.cancelAppointment(req.params.id, reason);
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointment by ID
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const appointment = await appointmentController.getById(req.params.id);
    res.json(appointment);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Get appointments by patient ID
router.get('/patient/:patientId', validateObjectId('patientId'), async (req, res) => {
  try {
    const appointments = await appointmentController.getByPatientId(req.params.patientId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments by doctor ID
router.get('/doctor/:doctorId', validateObjectId('doctorId'), async (req, res) => {
  try {
    const appointments = await appointmentController.getByDoctorId(req.params.doctorId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete appointment by ID
router.delete('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const appointment = await appointmentController.deleteAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
