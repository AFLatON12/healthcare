const express = require('express');
const mongoose = require('mongoose');

module.exports = (invoiceController) => {
  const router = express.Router();

  // Middleware to validate ObjectId params
  function validateObjectId(param) {
    return (req, res, next) => {
      if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
        return res.status(400).json({ error: `Invalid ${param} format` });
      }
      next();
    };
  }

  // Create a new invoice
  router.post('/', async (req, res) => {
    try {
      const invoice = await invoiceController.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get invoice by ID
  router.get('/:id', validateObjectId('id'), async (req, res) => {
    try {
      const invoice = await invoiceController.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update invoice by ID
  router.put('/:id', validateObjectId('id'), async (req, res) => {
    try {
      const updated = await invoiceController.updateInvoice(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json({ message: 'Invoice updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // List invoices with optional filters
  router.get('/', async (req, res) => {
    try {
      const invoices = await invoiceController.listInvoices(req.query);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Process partial payment for invoice
  router.post('/:id/partial-payment', validateObjectId('id'), async (req, res) => {
    try {
      const result = await invoiceController.processPartialPayment(req.params.id, req.body);
      if (!result) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json({ message: 'Partial payment processed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
