const mongoose = require('mongoose')
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    orderID:{
        type: Number,
        required:true,
        unique:true
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
    }
})

module.exports = mongoose.model('orders', OrdersSchema)