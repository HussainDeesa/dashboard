const mongoose = require('mongoose')
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    orderID:{
        type: Number,
        required:true,
    },
    trackingID: {
        type: String,
        required:true,
        unique:true
    },
    post: {
        type: String,
        required:true
    },
    status: {
        type: String,
        required:true
    },
    date: {
        type: String,
        required:true
    },
    location:{
        type:String
    },
    customerName:{
        default: '',
        type:String
    },
    payment:{
        type:String
    },
    paymentStatus:{
        default: false,
        type: Boolean
    },
    created_date:{
        type:String
    }
})

module.exports = mongoose.model('orders', OrdersSchema)