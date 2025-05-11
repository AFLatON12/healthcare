const mongoose = require('mongoose');

const STATUS_PENDING = 'pending';
const STATUS_PAID = 'paid';
const STATUS_FAILED = 'failed';

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Appointment' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['online', 'cash'], required: true },
  status: { type: String, enum: [STATUS_PENDING, STATUS_PAID, STATUS_FAILED], default: STATUS_PENDING },
  paymentDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
  Payment,
  STATUS_PENDING,
  STATUS_PAID,
  STATUS_FAILED,
};
