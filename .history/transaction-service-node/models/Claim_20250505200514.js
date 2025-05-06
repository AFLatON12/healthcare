const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Claim = mongoose.model('Claim', ClaimSchema);

module.exports = {
  Claim,
  STATUS_PENDING: 'pending',
  STATUS_APPROVED: 'approved',
  STATUS_REJECTED: 'rejected',
  STATUS_PAID: 'paid',
};
