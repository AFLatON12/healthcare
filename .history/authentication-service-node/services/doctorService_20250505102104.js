const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');

class DoctorService {
  async registerDoctor(doctorData, password) {
    if (!this.validateEmail(doctorData.email)) {
      throw new Error('Invalid email format');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const existing = await Doctor.findOne({ email: doctorData.email });
    if (existing) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    doctorData.passwordHash = hashedPassword;
    const doctor = new Doctor(doctorData);
    await doctor.save();
  }

  validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  async listDoctors() {
    return Doctor.find({ isApproved: true });
  }

  async listPendingDoctors() {
    return Doctor.find({ isApproved: false });
  }

  async getDoctor(id) {
    return Doctor.findById(id);
  }

  async approveDoctor(id) {
    const doctor = await Doctor.findById(id);
    if (!doctor) throw new Error('Doctor not found');
    doctor.isApproved = true;
    doctor.available = true;
    await doctor.save();
  }

  async rejectDoctor(id) {
    const doctor = await Doctor.findById(id);
    if (!doctor) throw new Error('Doctor not found');
    doctor.isApproved = false;
    doctor.available = false;
    await doctor.save();
  }

  async updateDoctor(id, updateData) {
    return Doctor.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new DoctorService();
