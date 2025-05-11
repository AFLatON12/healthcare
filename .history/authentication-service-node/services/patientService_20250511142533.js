const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

class PatientService {
  async registerPatient(patientData, password) {
    if (!this.validateEmail(patientData.email)) {
      throw new Error('Invalid email format');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const existing = await Patient.findOne({ email: patientData.email });
    if (existing) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    patientData.passwordHash = hashedPassword;
    const patient = new Patient(patientData);
    await patient.save();
  }

  validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  async listPatients() {
    return Patient.find();
  }

  async getPatient(id) {
    return Patient.findById(id);
  }

  async getPatientHistory(id) {
    const patient = await Patient.findById(id);
    if (!patient) throw new Error('Patient not found');
    return patient.medicalHistory;
  }

  async addPatientHistory(id, entry) {
    const patient = await Patient.findById(id);
    if (!patient) throw new Error('Patient not found');
    patient.medicalHistory.push(entry);
    await patient.save();
  }
}

module.exports = new PatientService();
