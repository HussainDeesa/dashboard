const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const json2csv = require("json2csv");
const multer = require("multer");
const Order = require("../models/Orders");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const http = require("http");
const csv = require("csv-parser");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/stockupload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({ message: "File uploaded successfully", success: true });
  } else {
    res.status(400).json({ error: "File upload unsuccessful", success: false });
  }
});
router.post("/dealerupload", upload.single("file"), (req, res) => {
  if (req.file) {
    let dealerArr = [];
    const parentDir = path.resolve(__dirname, "..");
    const workbook = xlsx.readFile(
      path.join(parentDir, "/uploads/dealer.xlsx")
    );
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet, { raw: false });

    const jsonFilePath = path.join(parentDir, "/uploads/dealer.txt");
    fs.writeFileSync(jsonFilePath, JSON.stringify(rows, null, 2), "utf8");
    fs.unlinkSync(path.join(parentDir, "/uploads/dealer.xlsx"));
  } else {
    res.status(400).json({ error: "File upload unsuccessful", success: false });
  }
});


router.post("/uploadorder", upload.single("file"), (req, res) => {
  const dealerFilePath = path.join(__dirname, "..", "uploads", "dealer.txt");
  const orderFilePath = path.join(__dirname, "..", "uploads", "order.xlsx");
  const dealerContent = fs.readFileSync(dealerFilePath, "utf-8");
  const dealerData = JSON.parse(dealerContent);
  const workbook = xlsx.readFile(orderFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const orderData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  const orderList = [];
  const notFoundList = [];

  const aggregatedItems = {};

  for (let i = 0; i < orderData.length; i++) {
    let found = false;

    for (let j = 0; j < dealerData.length; j++) {
      if (orderData[i].SKU === dealerData[j].ISBNCode) {
        const dealerName = dealerData[j].Dealer;
        const seg = {
          ISBNCode: orderData[i].SKU,
          quantity: Number(orderData[i].Quantity),
          dealer: dealerName,
          title: orderData[i]["Item Name"],
        };
        orderList.push(seg);
        found = true;
        const identifier = orderData[i].SKU || orderData[i]["Item Name"];
        if (aggregatedItems[identifier]) {
          aggregatedItems[identifier].quantity += Number(orderData[i].Quantity);
        } else {
          aggregatedItems[identifier] = { ...seg };
        }

        break;
      }
    }

    if (!found) {
      const seg = {
        ISBNCode: orderData[i].SKU,
        quantity: Number(orderData[i].Quantity),
        title: orderData[i]["Item Name"],
        dealer: "",
      };
      notFoundList.push(seg);
      const identifier = orderData[i].SKU || orderData[i]["Item Name"];
      if (aggregatedItems[identifier]) {
        aggregatedItems[identifier].quantity += Number(orderData[i].Quantity);
      } else {
        aggregatedItems[identifier] = { ...seg };
      }
    }
  }

  const aggregatedOrderList = Object.values(aggregatedItems);

  const orderListFilePath = path.join(__dirname, "..", "uploads", "orderlist.txt");
  fs.writeFileSync(orderListFilePath, JSON.stringify(aggregatedOrderList, null, 2), "utf8");

  res.json({
    message: "Segregated successfully",
    segArr: aggregatedOrderList,
    notFoundArr: notFoundList,
    success: true,
  });
});


router.get("/generatereport", (req, res) => {
  let categorizedJson = {};
  let notfound = [];
  const parentDir = path.resolve(__dirname, "..");

  const jsonContent = fs.readFileSync(path.join(parentDir, "/uploads/orderlist.txt"), 'utf-8');
  const originalJson = JSON.parse(jsonContent);
  originalJson.forEach((item) => {
    const dealer = item.dealer;

    if (dealer !== '') {
      if (!categorizedJson[dealer]) {
        categorizedJson[dealer] = [];
      }

      categorizedJson[dealer].push(item);
    } else {
      notfound.push(item);
    }
  });
  res.json({ success: true, segArr: categorizedJson, notfound: notfound, uncategorizedArr: originalJson })

});
router.get("/fetchallproducts", fetchuser, async (req, res) => {
  try {
    let products = [];
    const parentDir = path.resolve(__dirname, "..");
    const workbook = xlsx.readFile(
      path.join(parentDir, "/uploads/products.xlsx")
    );
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    products = xlsx.utils.sheet_to_json(worksheet, { raw: false });

    res.json(products)
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
    return;
  }
});

router.post("/generatecsv", fetchuser, async (req, res) => {
  let { data, dealer } = req.body;
  const fields = [
    { label: "ISBN Code", value: "ISBNCode" },
    { label: "Title", value: "title" },
    { label: "quantity", value: "quantity" },
  ];
  const opts = { fields };
  const parser = new json2csv.Parser(opts);
  const csvData = parser.parse(data);
  res.json({ success: true, csv: csvData, dealer: dealer });
});

router.post("/saveorder", fetchuser, async (req, res) => {
  let { segOrder } = req.body;
  const parentDir = path.resolve(__dirname, "..");

  const jsonFilePath = path.join(parentDir, "/uploads/orderlist.txt");
  fs.writeFileSync(jsonFilePath, JSON.stringify(segOrder, null, 2), "utf8");
  res.json({ success: true });
});

module.exports = router;
