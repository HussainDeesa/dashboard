const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const json2csv = require('json2csv');
const Order = require('../models/Orders')
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const http = require("http")
router.get('/fetchallorders', fetchuser, async (req, res) => {
    try {
        const orders = await Order.find().sort({ _id: -1 })
        res.json(orders)
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})
router.get('/previoustwoorders', fetchuser, async (req, res) => {

    try {
        const orders = await Order.find({}).sort({ _id: -1 }).limit(2);
        res.json(orders)
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})

router.post('/fetchordersbetweendates', fetchuser, async (req, res) => {
    let parts = req.body.startDate.split('-');
    let startDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    parts = req.body.endDate.split('-');
    let endDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    try {

        const orders = await Order.find({
            date: {
                $gte: startDate,
                $lte: endDate
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
            // fs.writeFileSync("data.csv", csvData, (err) => {
            //     if (err) throw err;

            //     const fileStream = fs.createReadStream("data.csv");
            //     fileStream.pipe(res);
            // });
            res.json({ data: orders, success: true, csv: csvData })
            return

        }
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})

router.get('/gettodaycount', fetchuser, async (req, res) => {

    try {
        // let today_date = new Date().toISOString().split('T')[0].split('-').reverse().join('-');
        // console.log(today_date);
        const currentDate = new Date();
        const utcOffset = 5.5 * 60 * 60 * 1000; 
        const istDate = new Date(currentDate.getTime() + utcOffset);
        let today_date = new Date().toISOString().split('T')[0].split('-').reverse().join('-');
        console.log(today_date);
        let count = await Order.count({ created_date: today_date })
        res.json({ count: count }) 
    } catch (error) {
        console.error(error.message)    

        res.status(500).send("Some Error Occured")
        return
    }
})
router.get('/fetchorderbyorderid/:orderid', fetchuser, async (req, res) => {

    try {
        let order = await Order.find({ orderID: req.params.orderid })

        if (order.length == 0) {
            success: false
            res.status(400).json({ success, error: "OrderID does not exist" })
            return
        }
        else {

            res.json({ data: order, success: true })
            return
        } 
    } catch (error) {
        if (error.message == `Cast to Number failed for value "NaN" (type string) at path "orderID" for model "orders"`) {
            res.status(400).json({ success, error: "Invalid OrderID" })
            return
        }
        res.status(500).send("Some Error Occured")
        return
    }
})
router.get('/fetchorderbytrackingid/:trackingid', fetchuser, async (req, res) => {

    try {

        let order = await Order.find({ trackingID: req.params.trackingid })
        if (order.length == 0) {
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
router.post('/addorder', fetchuser, async (req, res) => {

    try {
        let order;
        if (req.body.skip_check == false) {
            order = await Order.findOne({ orderID: req.body.orderid })
            if (order) {
                res.status(400).json({ success: false, error: "Order already exists for this orderID" })
                return
            }
        }
        order = await Order.findOne({ trackingID: req.body.trackingid })
        if (order) {
            // res.json({error:"exist"})
            res.status(400).json({ success: false, error: "Order already exists for this trackingID" })
            return
        }
        const parts = req.body.date.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        let today_date = new Date().toISOString().split('T')[0].split('-').reverse().join('-');
        let count = await Order.count({ created_date: today_date }) + 1

        order = new Order({
            orderID: req.body.orderid,
            trackingID: req.body.trackingid,
            post: req.body.post,
            date: formattedDate,
            status: req.body.status,
            created_date: today_date

        })
        const saveOrder = await order.save()
        res.json({ success: true, data: saveOrder })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured")
        return
    }
})

router.put('/updateorder/:id', fetchuser, async (req, res) => {
    const { orderid, trackingid, post, date, status } = req.body
    const parts = req.body.date.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    try {
        const newOrder = {}
        if (orderid) { newOrder.orderID = orderid };
        if (trackingid) { newOrder.trackingID = trackingid };
        if (post) { newOrder.post = post };
        if (date) { newOrder.date = formattedDate };
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
// router.put('/updateorder', fetchuser, async (req, res) => {
//     try {
//         let order = await Order.updateMany(
//             { "post": "Indiapost" },
//             { $set: { "post": "India Post" } },
//             { new: true }
//         );
//         res.json(order);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Some Error Occurred");
//     }
// });


router.delete('/deleteorder/:id', fetchuser, async (req, res) => {
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


router.post('/track', (req, res) => {
    const options = {
        method: 'POST',
        hostname: 'api.ship24.com',
        port: null,
        path: '/public/v1/trackers/track',
        headers: {
            Accept: '*/*',
            Authorization: 'apik_w7P07qE2FusiXkkN3HVhjnG4bmHTGz',
            'Content-Type': 'application/json',
        },
    };

    const request = http.request(options, (response) => {
        let chunks = [];

        response.on('data', (chunk) => {
            chunks.push(chunk);
        });

        response.on('end', () => {
            const body = Buffer.concat(chunks);
            res.send(body);
        });
    });

    request.on('error', (error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
    request.write(JSON.stringify({
        trackingNumber: req.body
            .trackingNumber
    }));
    request.end();
});


module.exports = router