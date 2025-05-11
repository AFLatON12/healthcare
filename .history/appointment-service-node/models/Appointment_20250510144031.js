const mongoose = require('mongoose');

const STATUS_PENDING = 'pending';
const STATUS_CONFIRMED = 'confirmed';
const STATUS_CANCELLED = 'cancelled';
const STATUS_COMPLETED = 'completed';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Doctor' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: [STATUS_PENDING, STATUS_CONFIRMED, STATUS_CANCELLED, STATUS_COMPLETED], 
    default: STATUS_PENDING 
  },
  price: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {
  Appointment,
  STATUS_PENDING,
  STATUS_CONFIRMED,
  STATUS_CANCELLED,
  STATUS_COMPLETED,
};
