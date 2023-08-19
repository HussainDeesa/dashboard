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
    // fs.createReadStream(path.join(parentDir, '/uploads/dealer.csv'))
    //     .pipe(csv())
    //     .on('data', (row) => {
    //         dealerArr.push(row);
    //     })
    //     .on('end', () => {
    //         const jsonFilePath = path.join(parentDir, '/uploads/dealer.txt');
    //         fs.writeFileSync(jsonFilePath, JSON.stringify(dealerArr, null, 2), 'utf8');
    //         fs.unlinkSync(path.join(parentDir, '/uploads/dealer.csv'));
    //         res.json({ message: "File uploaded successfully", success: true })
    //     })
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
router.post("/generatereport", upload.single("file"), (req, res) => {
  // if (req.file) {

  let dealer = [];
  let order = [];
  let segArr = {};
  let notfound = [];
  let seg;
  let found;
  const parentDir = path.resolve(__dirname, "..");
  fs.createReadStream(path.join(parentDir, "/uploads/dealer.txt"))
    .on("data", (row) => {
      dealer = JSON.parse(row);
    })
    .on("end", () => {
    //   fs.createReadStream(path.join(parentDir, "/uploads/order.xlsx"))
    //     .pipe(csv())
    //     .on("data", (row) => {
    //       const isbnCode = row.ISBNCode;
    //       const quantity = row.Quantity;
    //       const title = row["Item Name"];
    //       order.push({ isbn: isbnCode, quantity: quantity, title: title });
    //     })
    const workbook = xlsx.readFile(
        path.join(parentDir, "/uploads/order.xlsx")
      ); 
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];
      const order = xlsx.utils.sheet_to_json(worksheet, { raw: false });
        // .on("end", () => {
          for (let i = 0; i < order.length; i++) {
            found = false;
            for (let j = 0; j < dealer.length; j++) {
              if (order[i].SKU === dealer[j].ISBNCode) {
                const dealerName = dealer[j].Dealer;
                const seg = {
                  ISBNCode: order[i].SKU,
                  quantity: order[i].Quantity,
                  dealer: dealerName,
                  title: order[i]['Item Name'],
                };

                if (!segArr[dealerName]) {
                  segArr[dealerName] = [];
                }

                segArr[dealerName].push(seg);

                found = true;
                break;
              }
            }
            if (found == false) {
              seg = {
                ISBNCode: order[i].SKU,
                quantity: order[i].Quantity,
                title: order[i]['Item Name'],
              };
              notfound.push(seg);
            }
          }
        // })
        // .on("end", () => {
          res.json({
            message: "Segerated succesfully",
            segArr: segArr,
            notfound: notfound,
            success: true,
          });
        // });
    });
});
router.get("/fetchallproducts", fetchuser, async (req, res) => {
  try {
    let products = [];
    const parentDir = path.resolve(__dirname, "..");

    fs.createReadStream(path.join(parentDir, "/uploads/products.csv"))
      .pipe(csv())
      .on("data", (row) => {
        products.push(row);
      })
      .on("error", (error) => {
        console.error(error);
      })
      .on("end", () => {
        res.json(products);
      });
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

module.exports = router;
