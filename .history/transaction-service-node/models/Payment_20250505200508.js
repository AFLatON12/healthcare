const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = {
  Payment,
  STATUS_PENDING: 'pending',
  STATUS_PROCESSING: 'processing',
  STATUS_COMPLETED: 'completed',
  STATUS_FAILED: 'failed',
  STATUS_CANCELLED: 'cancelled',
  STATUS_REFUNDED: 'refunded',
};
