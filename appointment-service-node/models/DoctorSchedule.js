const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isAvailable: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  timeSlots: [timeSlotSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

doctorScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const DoctorSchedule = mongoose.model('DoctorSchedule', doctorScheduleSchema);

module.exports = DoctorSchedule;
