class InvoiceService {
  async processInvoice(invoice) {
    this.validateAmount(invoice.amount);
    this.validateStatus(invoice.status);

    invoice.status = invoice.status || 'pending';
    invoice.amountDue = invoice.amount;
    invoice.createdAt = new Date();
    invoice.updatedAt = new Date();
  }

  async updateInvoiceStatus(invoice, newStatus) {
    this.validateStatus(newStatus);

    const validTransitions = {
      pending: ['paid', 'cancelled'],
      paid: [],
      cancelled: [],
    };

    if (!this.isValidTransition(invoice.status, newStatus, validTransitions)) {
      throw new Error('Invalid status transition');
    }

    invoice.status = newStatus;
    invoice.updatedAt = new Date();
  }

  async processPartialPayment(invoice, paymentData) {
    if (paymentData.amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    if (paymentData.amount > invoice.amountDue) {
      throw new Error('Payment amount exceeds amount due');
    }

    invoice.amountDue -= paymentData.amount;
    invoice.updatedAt = new Date();

    if (invoice.amountDue === 0) {
      invoice.status = 'paid';
    }
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

  validateStatus(status) {
    const validStatuses = ['pending', 'paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid invoice status');
    }
  }
}

module.exports = InvoiceService;
