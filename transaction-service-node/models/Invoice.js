const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  amount: { type: Number, required: true },
  amountDue: { type: Number, required: true },
  status: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = {
  Invoice,
  STATUS_PENDING: 'pending',
  STATUS_PAID: 'paid',
  STATUS_CANCELLED: 'cancelled',
};
