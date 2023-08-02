const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Invoice = require('../models/Invoice');

router.post('/createinvoice', fetchuser, async (req, res) => {
    try {
      const { customerName, products } = req.body;
  
      const invoice = new Invoice({
        customerName,
        products,
      });
  
      const savedInvoice = await invoice.save();
  
      res.json(savedInvoice);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });
  
  router.get('/fetchallinvoices', fetchuser, async (req, res) => {
    try {
      const invoices = await Invoice.find({ user: req.user.id }).sort({ _id: -1 });
      res.json(invoices);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });


module.exports = router