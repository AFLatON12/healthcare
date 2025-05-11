const { Payment, STATUS_PENDING, STATUS_PAID, STATUS_FAILED } = require('../models/Payment');

class PaymentController {
  async createPayment(appointmentId, amount, method) {
    const payment = new Payment({
      appointmentId,
      amount,
      method,
      status: STATUS_PENDING,
    });
    await payment.save();
    return payment;
  }

  async updatePaymentStatus(paymentId, status) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    payment.status = status;
    if (status === STATUS_PAID) {
      payment.paymentDate = new Date();
    }
    await payment.save();
    return payment;
  }

  async getPaymentByAppointment(appointmentId) {
    return Payment.findOne({ appointmentId });
  }
}

module.exports = new PaymentController();
