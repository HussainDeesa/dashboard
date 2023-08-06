const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Invoice = require('../models/Invoice');
const Estimate = require('../models/Estimate');

router.post('/createinvoice', fetchuser, async (req, res) => {
    try {
      const { invoiceDetails, products } = req.body;
      const invoice = new Invoice({
        customerName:invoiceDetails.customerName,
        invoiceDate:invoiceDetails.invoiceDate,
        invoicenumber:invoiceDetails.invoiceNumber,
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
      const invoices = await Invoice.find().sort({ _id: -1 });
      res.json(invoices);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });

  router.delete('/deleteinvoice/:id', fetchuser, async (req, res) => {

    try {

        let invoice = await Invoice.findById(req.params.id)
        if(invoice){
          invoice = await Invoice.findByIdAndDelete(req.params.id)
        }
        let estimate = await Estimate.findById(req.params.id)
        if (estimate) { 
          Estimate = await Estimate.findByIdAndDelete(req.params.id)
        }
        if(!invoice && !estimate){
          return res.status(404).send("Not Found")
        }
        res.json({ "success": "Deleted successfully", order: order })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured")
        return
    }
})

module.exports = router