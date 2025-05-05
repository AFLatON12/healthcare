const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  experience: { type: Number, required: true },
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
