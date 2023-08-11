const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const json2csv = require('json2csv');
const multer = require('multer');
const Order = require('../models/Orders')
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const http = require("http")
const csv = require('csv-parser');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        cb(null, fileName); 
    }
});

const upload = multer({ storage: storage });
router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({ message: "File uploaded successfully", success: true })
    } else {
        res.status(400).json({ error: "File upload unsuccessful", success: false });
    }


});
router.get('/fetchallproducts', fetchuser, async (req, res) => {
    try {
    let products = []
    const parentDir = path.resolve(__dirname, '..');

    fs.createReadStream(path.join(parentDir, '/uploads/products.csv'))
    .pipe(csv())
    .on('data', (row) => {
        products.push(row)
    })
    .on('error', (error) => {
        console.error(error);
    })
    .on('end',()=>{

        res.json(products)
    })
    } catch (error) {
        console.error(error.message)

        res.status(500).send("Some Error Occured")
        return
    }
})

module.exports = router