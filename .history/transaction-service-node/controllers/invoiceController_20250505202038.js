const { ObjectId } = require('mongodb');
const { getDB } = require('../db/mongodb');
const InvoiceService = require('../services/invoiceService');

class InvoiceController {
  constructor(db) {
    this.db = db;
    this.service = new InvoiceService();
  }

  async createInvoice(invoiceData) {
    const collection = this.db.collection('invoices');
    // Validate and process invoice
    await this.service.processInvoice(invoiceData);

    // Set new ObjectId
    invoiceData._id = new ObjectId();

    // Insert into DB
    await collection.insertOne(invoiceData);

    return invoiceData;
  }

  async getInvoice(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid invoice ID format');
    }
    const invoice = await this.db.collection('invoices').findOne({ _id: new ObjectId(id) });
    return invoice;
  }

  async updateInvoice(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid invoice ID format');
    }

    const existingInvoice = await this.db.collection('invoices').findOne({ _id: new ObjectId(id) });
    if (!existingInvoice) {
      return null;
    }

    if (updateData.status && updateData.status !== existingInvoice.status) {
      await this.service.updateInvoiceStatus(existingInvoice, updateData.status);
    }

    const updateFields = {
      status: updateData.status || existingInvoice.status,
      amount: updateData.amount || existingInvoice.amount,
      description: updateData.description || existingInvoice.description,
      updatedAt: new Date(),
    };

    const result = await this.db.collection('invoices').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return true;
  }

  async listInvoices(filters) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }

    const invoices = await this.db.collection('invoices').find(query).toArray();
    return invoices;
  }

  async processPartialPayment(id, paymentData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid invoice ID format');
    }

    const invoice = await this.db.collection('invoices').findOne({ _id: new ObjectId(id) });
    if (!invoice) {
      return null;
    }

    await this.service.processPartialPayment(invoice, paymentData);

    const result = await this.db.collection('invoices').updateOne(
      { _id: new ObjectId(id) },
      { $set: { amountDue: invoice.amountDue, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return true;
  }
}

module.exports = InvoiceController;
