const { ObjectId } = require('mongodb');
const { getDB } = require('../db/mongodb');
const PaymentService = require('../services/paymentService');
const PaymobService = require('../services/paymobService');

class PaymentController {
  constructor(db) {
    this.db = db;
    this.service = new PaymentService();
    this.paymobService = new PaymobService();
  }

  async createPayment(paymentData) {
    const collection = this.db.collection('payments');
    // Validate and process payment
    await this.service.processPayment(paymentData);

    // Calculate fees and update amount
    const fees = this.service.calculatePaymentFees(paymentData);
    paymentData.amount += fees;

    // Set new ObjectId
    paymentData._id = new ObjectId();

    // Insert into DB
    await collection.insertOne(paymentData);

    return paymentData;
  }

  async getPayment(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid payment ID format');
    }
    const payment = await this.db.collection('payments').findOne({ _id: new ObjectId(id) });
    return payment;
  }

  async updatePayment(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid payment ID format');
    }

    const existingPayment = await this.db.collection('payments').findOne({ _id: new ObjectId(id) });
    if (!existingPayment) {
      return null;
    }

    if (updateData.status && updateData.status !== existingPayment.status) {
      await this.service.updatePaymentStatus(existingPayment, updateData.status);
    }

    const updateFields = {
      status: updateData.status || existingPayment.status,
      amount: updateData.amount || existingPayment.amount,
      description: updateData.description || existingPayment.description,
      method: updateData.method || existingPayment.method,
      updatedAt: new Date(),
    };

    const result = await this.db.collection('payments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return true;
  }

  async listPayments(filters) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }

    const payments = await this.db.collection('payments').find(query).toArray();
    return payments;
  }

  // New method to create Paymob payment session and return payment token
  async createPaymobPaymentSession(paymentData) {
    // Validate and process payment data
    await this.service.processPayment(paymentData);

    // Calculate fees and update amount
    const fees = this.service.calculatePaymentFees(paymentData);
    paymentData.amount += fees;

    // Prepare billing data for Paymob
    const billingData = {
      first_name: paymentData.firstName || 'N/A',
      last_name: paymentData.lastName || 'N/A',
      email: paymentData.email || 'noemail@example.com',
      phone_number: paymentData.phone || '0000000000',
      apartment: paymentData.apartment || '',
      floor: paymentData.floor || '',
      street: paymentData.street || '',
      building: paymentData.building || '',
      city: paymentData.city || '',
      country: paymentData.country || '',
      postal_code: paymentData.postalCode || '',
    };

    // Create payment session with Paymob
    const paymentKey = await this.paymobService.createPaymentSession(
      paymentData.amount * 100, // amount in cents
      paymentData.currency || 'USD',
      billingData
    );

    return paymentKey;
  }
}

module.exports = PaymentController;
