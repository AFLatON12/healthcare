const mongoose = require('mongoose');

const doctorNoteSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  note: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const testResultSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  result: { type: String, required: true },
  dateTaken: { type: Date, required: true }
});

const patientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorNotes: [doctorNoteSchema],
  testResults: [testResultSchema],
  allergies: [{ type: String }],
  chronicDiseases: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;
