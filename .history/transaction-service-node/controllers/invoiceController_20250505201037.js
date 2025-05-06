const { ObjectId } = require('mongodb');
const InvoiceService = require('../services/invoiceService');

class InvoiceController {
  constructor(db) {
    this.collection = db.collection('invoices');
    this.service = new InvoiceService();
  }

  async createInvoice(invoiceData) {
    // Validate and process invoice
    await this.service.processInvoice(invoiceData);

    // Set new ObjectId
    invoiceData._id = new ObjectId();

    // Insert into DB
    await this.collection.insertOne(invoiceData);

    return invoiceData;
  }

  async getInvoice(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid invoice ID format');
    }
    const invoice = await this.collection.findOne({ _id: new ObjectId(id) });
    return invoice;
  }

  async updateInvoice(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid invoice ID format');
    }

    const existingInvoice = await this.collection.findOne({ _id: new ObjectId(id) });
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

    const result = await this.collection.updateOne(
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

    const invoices = await this.collection.find(query).toArray();
    return invoices;
  }

  async processPartialPayment(id, paymentData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid invoice ID format');
    }

    const invoice = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!invoice) {
      return null;
    }

    await this.service.processPartialPayment(invoice, paymentData);

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { amountDue: invoice.amountDue, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return true;
  }
}

module.exports = new InvoiceController();
