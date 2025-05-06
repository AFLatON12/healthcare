class PaymentService {
  async processPayment(payment) {
    this.validateAmount(payment.amount);
    this.validateCurrency(payment.currency);
    this.validatePaymentMethod(payment.method);
    this.validatePatientID(payment.patient_id);

    payment.status = 'pending';
    payment.createdAt = new Date();
    payment.updatedAt = new Date();
  }

  async updatePaymentStatus(payment, newStatus) {
    this.validatePaymentStatus(newStatus);

    const validTransitions = {
      pending: ['processing', 'completed', 'cancelled'],
      processing: ['completed', 'failed', 'cancelled'],
      completed: ['refunded', 'failed'],
      failed: ['pending', 'processing'],
      cancelled: ['pending'],
      refunded: ['completed'],
    };

    if (!this.isValidTransition(payment.status, newStatus, validTransitions)) {
      throw new Error('Invalid status transition');
    }

    payment.status = newStatus;
    payment.updatedAt = new Date();
  }

  calculatePaymentFees(payment) {
    let fees = 0;

    switch (payment.method) {
      case 'credit_card':
        fees += payment.amount * 0.029;
        break;
      case 'bank_transfer':
        fees += 1.0;
        break;
    }

    return fees;
  }

  isValidTransition(currentStatus, newStatus, validTransitions) {
    const allowed = validTransitions[currentStatus];
    if (!allowed) return false;
    return allowed.includes(newStatus);
  }

  validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }
  }

  validateCurrency(currency) {
    const validCurrencies = ['USD', 'EUR', 'GBP'];
    if (!validCurrencies.includes(currency)) {
      throw new Error('Invalid currency');
    }
  }

  validatePaymentMethod(method) {
    const validMethods = ['credit_card', 'bank_transfer', 'cash'];
    if (!validMethods.includes(method)) {
      throw new Error('Invalid payment method');
    }
  }

  validatePatientID(patientId) {
    if (!patientId || typeof patientId !== 'string') {
      throw new Error('Invalid patient ID');
    }
  }

  validatePaymentStatus(status) {
    const validStatuses = [
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded',
    ];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid payment status');
    }
  }
}

module.exports = PaymentService;
