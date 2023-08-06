const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Estimate = require('../models/Estimate');

router.post('/createestimate', fetchuser, async (req, res) => {
    try {
      const { invoiceDetails, products } = req.body;
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
      const estimates = await Estimate.find().sort({ _id: -1 });
      res.json(estimates);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });

//   router.delete('/deleteestimate/:id', fetchuser, async (req, res) => {

//     try {

//         let order = await Estimate.findById(req.params.id)
//         if (!order) { return res.status(404).send("Not Found") }
//         order = await Estimate.findByIdAndDelete(req.params.id)
//         res.json({ "success": "Deleted successfully", order: order })
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("Some Error Occured")
//         return
//     }
// })

module.exports = router