const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
  productCode: {
    type: String,
  },
  productName: {
    type: String,
  },
  author: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  discount:{
    type:Number,
  }
});

const estimateSchema = new mongoose.Schema({
  supplierName:{
    type:String
  },
  customerName: {
    type: String,
    required: true,
  },
  invoiceDate:{
    type:String,
    required:true
  },
  products: [productSchema], 
});

module.exports = mongoose.model('estimate', estimateSchema);

