const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const json2csv = require('json2csv');
const Order = require('../models/Orders')
const { body, validationResult } = require('express-validator');

router.get('/fetchallorders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ _id: -1 })
        res.json(orders)
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})
router.get('/previoustwoorders', async (req, res) => {

    try {
        const orders = await Order.find({}).sort({ _id: -1 }).limit(2);
        res.json(orders)
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})

router.post('/fetchordersbetweendates', async (req, res) => {

    try {

        const orders = await Order.find({
            date: {
                $gte: req.body.startDate,
                $lte: req.body.endDate
            }
        })
        if (orders.length == 0) {
            success = false
            res.status(400).json({ success, error: "No records found between the selected dates" })
            return
        }
        else {
            const fields = [
                { label: 'order_id', value: 'orderID' },
                { label: 'tracking_provider', value: 'post' },
                { label: 'tracking_number', value: 'trackingID' },
                { label: 'date_shipped', value: 'date', type: 'Date', dateFormat: 'mm/dd/yyyy' },
                { label: 'status_shipped', value: 'status' }
            ];

            const opts = { fields };
            const parser = new json2csv.Parser(opts);
            const csvData = parser.parse(orders);
            // const csvData = json2csv.parse(orders,opts);
            console.log(csvData);
            fs.writeFileSync('data.csv', csvData, (err) => {
                if (err) throw err;

                const fileStream = fs.createReadStream('data.csv');
                fileStream.pipe(res);
            });
            res.json({ data: orders, success: true, csv: csvData })
            return

        }
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})
router.get('/fetchorderbyorderid/:orderid', async (req, res) => {

    try {
        let order = await Order.findOne({ orderID: req.params.orderid })

        if (!order) {
            success: false
            res.status(400).json({ success, error: "OrderID does not exist" })
            return
        }
        else {

            res.json({ data: order, success: true })
            return
        }
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})
router.get('/fetchorderbytrackingid/:trackingid', async (req, res) => {

    try {

        let order = await Order.findOne({ trackingID: req.params.trackingid })
        console.log(order);
        if (!order) {
            success = false
            res.status(400).json({ success, error: "TrackingID does not exist" })
            return
        }
        else {
            res.json({ data: order, success: true })
            return

        }
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})

let success = false;
router.post('/addorder', async (req, res) => {
    try {
        let order = await Order.findOne({ orderID: req.body.orderid })
        console.log(order);
        if (order) {
            // res.json({error:"exist"})
            res.status(400).json({ success, error: "Order already exists for this orderID" })
            return
        }
        order = await Order.findOne({ trackingID: req.body.trackingid })
        if (order) {
            // res.json({error:"exist"})
            res.status(400).json({ success, error: "Order already exists for this trackingID" })
            return
        }
        order = new Order({
            orderID: req.body.orderid,
            trackingID: req.body.trackingid,
            post: req.body.post,
            date: req.body.date,
            status: req.body.status

        })
        const saveOrder = await order.save()
        res.json(saveOrder)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured")
        return
    }
})

router.put('/updateorder/:id', async (req, res) => {
    const { orderid, trackingid, post, date, status } = req.body
    try {
        const newOrder = {}
        console.log(orderid, post);
        if (orderid) { newOrder.orderID = orderid };
        if (trackingid) { newOrder.trackingID = trackingid };
        if (post) { newOrder.post = post };
        if (date) { newOrder.date = date };
        if (status) { newOrder.status = status };
        let order = await Order.findById(req.params.id)
        if (!order) { return res.status(404).send("Not Found") }

        order = await Order.findByIdAndUpdate(req.params.id, { $set: newOrder }, { new: true })
        res.json(order)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured")
        return
    }
})

router.delete('/deleteorder/:id', async (req, res) => {
    try {

        let order = await Order.findById(req.params.id)
        if (!order) { return res.status(404).send("Not Found") }
        order = await Order.findByIdAndDelete(req.params.id)
        res.json({ "success": "Deleted successfully", order: order })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured")
        return
    }
})



module.exports = router