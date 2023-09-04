const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Estimate = require('../models/Estimate');

router.post('/createestimate', fetchuser, async (req, res) => {
    try {
      const { invoiceDetails, products } = req.body;
      for (let i = products.length - 1; i >= 0; i--) {
        if (products[i].productName === '') {
          products.splice(i, 1); 
        }
      }
      const estimate = new Estimate({
        supplierName:invoiceDetails.supplierName,
        customerName:invoiceDetails.customerName,
        invoiceDate:invoiceDetails.invoiceDate,
        products,   
      });
  
      const savedestimate = await estimate.save();
  
      res.json(savedestimate);
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

router.put('/editestimate/:id', fetchuser, async (req, res) => {
  const { editedProducts,editedEstimateDetails } = req.body
  let products=editedProducts
  for (let i = products.length - 1; i >= 0; i--) {
    if (products[i].productName === '') {
      products.splice(i, 1); 
    }
  }
  try {
      const editedEstimate = {
        supplierName:editedEstimateDetails.supplierName,
        customerName:editedEstimateDetails.customerName,
        invoiceDate:editedEstimateDetails.invoiceDate,
        products,   
      };
      // console.log(editedEstimate);
      let estimate = await Estimate.findByIdAndUpdate(req.params.id, { $set: editedEstimate }, { new: true })
      res.json(estimate)
  } catch (error) {
      console.error(error.message)
      res.status(500).send("Some Error Occured")
      return
  }
})
module.exports = router