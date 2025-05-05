const asyncHandler = require('express-async-handler');
const doctorService = require('../services/doctorService');

const registerDoctor = asyncHandler(async (req, res) => {
  const doctorData = req.body;
  const password = doctorData.password;
  delete doctorData.password;
  await doctorService.registerDoctor(doctorData, password);
  res.status(201).json({ message: 'Doctor registered' });
});

const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.listDoctors();
  res.json(doctors);
});

const listPendingDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.listPendingDoctors();
  res.json(doctors);
});

const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctor(req.params.id);
  res.json(doctor);
});

const approveDoctor = asyncHandler(async (req, res) => {
  await doctorService.approveDoctor(req.params.id);
  res.json({ message: 'Doctor approved' });
});

const rejectDoctor = asyncHandler(async (req, res) => {
  await doctorService.rejectDoctor(req.params.id);
  res.json({ message: 'Doctor rejected' });
});

const updateDoctor = asyncHandler(async (req, res) => {
  await doctorService.updateDoctor(req.params.id, req.body);
  res.json({ message: 'Doctor updated' });
});

module.exports = {
  registerDoctor,
  listDoctors,
  listPendingDoctors,
  getDoctor,
  approveDoctor,
  rejectDoctor,
  updateDoctor,
};
