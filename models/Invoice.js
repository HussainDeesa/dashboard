const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
  productCode: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  invoicenumber:{
    type:String,
    required:true,
  },
  customerName: {
    type: String,
    required: true,
  },
  products: [productSchema], 
});

module.exports = mongoose.model('invoice', invoiceSchema);

