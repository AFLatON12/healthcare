const asyncHandler = require('express-async-handler');
const patientService = require('../services/patientService');

const registerPatient = asyncHandler(async (req, res) => {
  const patientData = req.body;
  const password = patientData.password;
  delete patientData.password;
  await patientService.registerPatient(patientData, password);
  res.status(201).json({ message: 'Patient registered' });
});

const listPatients = asyncHandler(async (req, res) => {
  const patients = await patientService.listPatients();
  res.json(patients);
});

const getPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatient(req.params.id);
  res.json(patient);
});

const getPatientHistory = asyncHandler(async (req, res) => {
  const history = await patientService.getPatientHistory(req.params.id);
  res.json(history);
});

const addPatientHistory = asyncHandler(async (req, res) => {
  const entry = req.body.entry;
  await patientService.addPatientHistory(req.params.id, entry);
  res.json({ message: 'Patient history added' });
});

module.exports = {
  registerPatient,
  listPatients,
  getPatient,
  getPatientHistory,
  addPatientHistory,
};
