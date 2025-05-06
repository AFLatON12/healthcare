const { ObjectId } = require('mongodb');
const { getDB } = require('../db/mongodb');
const PaymentService = require('../services/paymentService');

class PaymentController {
  constructor(db) {
    this.db = db;
    this.service = new PaymentService();
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
}

module.exports = PaymentController;
