const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Estimate = require('../models/Estimate');

router.post('/createestimate', fetchuser, async (req, res) => {
    try {
      const { invoiceDetails, products } = req.body;
      console.log(products);
      const invoice = new Estimate({
        customerName:invoiceDetails.customerName,
        invoiceDate:invoiceDetails.invoiceDate,
        products,   
      });
  
      const savedInvoice = await invoice.save();
  
      res.json(savedInvoice);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });
  
  router.get('/fetchallestimates', fetchuser, async (req, res) => {
    try {
      const invoices = await Estimate.find({ user: req.user.id }).sort({ _id: -1 });
      res.json(invoices);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });


module.exports = router