const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
  // Add other fields as needed
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
