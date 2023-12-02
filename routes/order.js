const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
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
router.get("/fetchallorders", fetchuser, async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
    return;
  }
});
router.get("/previoustwoorders", fetchuser, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ _id: -1 }).limit(2);
    res.json(orders);
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
    return;
  }
});

router.post("/fetchordersbetweendates", fetchuser, async (req, res) => {
  let parts = req.body.startDate.split("-");
  let startDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  parts = req.body.endDate.split("-");
  let endDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  let orders;
  try {
    if (req.body.location != "All") {
      orders = await Order.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
        location: req.body.location,
      });
    }
    if (req.body.location == "All") {
      orders = await Order.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    if (orders.length == 0) {
      success = false;
      res
        .status(400)
        .json({
          success,
          error: "No records found between the selected dates",
        });
      return;
    } else {
      const fields = [
        { label: "order_id", value: "orderID" },
        { label: "tracking_provider", value: "post" },
        { label: "tracking_number", value: "trackingID" },
        {
          label: "date_shipped",
          value: "date",
          type: "Date",
          dateFormat: "mm/dd/yyyy",
        },
        { label: "location", value: "location" },
        { label: "status_shipped", value: "status" },
      ];

      const opts = { fields };
      const parser = new json2csv.Parser(opts);
      const csvData = parser.parse(orders);
      res.json({ data: orders, success: true, csv: csvData });
      return;
    }
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
    return;
  }
});

router.post("/gettodaycount", fetchuser, async (req, res) => {
  try {
    const currentDate = new Date();
    const utcOffset = 5.5 * 60 * 60 * 1000;
    let count;
    const istDate = new Date(currentDate.getTime() + utcOffset);
    let today_date = new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    if (req.body.location) {
      count = await Order.count({
        created_date: today_date,
        location: req.body.location,
      });
    } else {
      count = await Order.count({ created_date: today_date });
    }
    res.json({ count: count });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Some Error Occured");
    return;
  }
});
router.get("/fetchorderbyorderid/:orderid", fetchuser, async (req, res) => {
  try {
    let order = await Order.find({ orderID: req.params.orderid });

    if (order.length == 0) {
      success: false;
      res.status(400).json({ success, error: "OrderID does not exist" });
      return;
    } else {
      res.json({ data: order, success: true });
      return;
    }
  } catch (error) {
    if (
      error.message ==
      `Cast to Number failed for value "NaN" (type string) at path "orderID" for model "orders"`
    ) {
      res.status(400).json({ success, error: "Invalid OrderID" });
      return;
    }
    res.status(500).send("Some Error Occured");
    return;
  }
});
router.get(
  "/fetchorderbytrackingid/:trackingid",
  fetchuser,
  async (req, res) => {
    try {
      let order = await Order.find({ trackingID: req.params.trackingid });
      if (order.length == 0) {
        success = false;
        res.status(400).json({ success, error: "TrackingID does not exist" });
        return;
      } else {
        res.json({ data: order, success: true });
        return;
      }
    } catch (error) {
      console.error(error.message);

      res.status(500).send("Some Error Occured");
      return;
    }
  }
);
router.post("/fetchorderbycustomer", fetchuser, async (req, res) => {
    const { customerName } = req.body;
    try {
      const regex = new RegExp(customerName, 'i'); // 'i' flag for case-insensitive search
      let order = await Order.find({ payment:"COD",customerName: { $regex: regex } }).sort({ _id: -1 });
  
      if (order.length === 0) {
        res.status(400).json({ success: false, error: "No record exists" });
      } else {
        res.json({ data: order, success: true });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });
router.get(
  "/fetchorderbypaymentstatus/:payment",
  fetchuser,
  async (req, res) => {
    try {
      let paymentStatus;
      if (req.params.payment == "paid") {
        paymentStatus = true;
      }
      if (req.params.payment == "unpaid") {
        paymentStatus = false;
      }
      let order;
      if (req.params.payment != "all") {
        order = await Order.find({
          payment: "COD",
          paymentStatus: paymentStatus,
        }).sort({ _id: -1 });
      }
      if (req.params.payment == "all") {
        order = await Order.find({ payment: "COD" }).sort({ _id: -1 });
      }
      if (order.length == 0) {
        success = false;
        res.status(400).json({ success, error: "No record exist" });
        return;
      } else {
        res.json({ data: order, success: true });
        return;
      }
    } catch (error) {
      console.error(error.message);

      res.status(500).send("Some Error Occured");
      return;
    }
  }
);
router.put("/paymentstatusupdate/:id", fetchuser, async (req, res) => {
  const { paymentStatus } = req.body;
  try {
    let order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { paymentStatus: paymentStatus } },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
    return;
  }
});

router.post("/updateCustomer", upload.single("file"), async (req, res) => {
  const updates = [];
  const parentDir = path.resolve(__dirname, "..");

  try {
    fs.createReadStream(path.join(parentDir, "/uploads/customer.csv"))
      .pipe(csv())
      .on("data", (row) => {
        const orderID = row['Order Number'];
        const customerName = row['First Name (Shipping)'] + ' ' + row['Last Name (Shipping)'];
        const updateOperation = {
            updateMany: {
              filter: { orderID: orderID },
              update: { $set: { customerName: customerName } },
            },
          };
  
        updates.push(updateOperation);
      })
      .on("error", (error) => {
        console.error(error);
      }).on('end', async () => {
        if (updates.length > 0) {
            const result = await Order.bulkWrite(updates);
            console.log(result.upsertedIds)
            res.json(result);
            }
        })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
    return;
  }
});

let success = false;
router.post("/addorder", fetchuser, async (req, res) => {
  try {
    let order;
    if (req.body.skip_check == false) {
      order = await Order.findOne({ orderID: req.body.orderid });
      if (order) {
        res
          .status(400)
          .json({
            success: false,
            error: `Order already exists for this orderID, and it is shipped from ${order.location}`,
          });
        return;
      }
    }
    order = await Order.findOne({ trackingID: req.body.trackingid });
    if (order) {
      // res.json({error:"exist"})
      res
        .status(400)
        .json({
          success: false,
          error: "Order already exists for this trackingID",
        });
      return;
    }
    const parts = req.body.date.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    let today_date = new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    order = new Order({
      orderID: req.body.orderid,
      trackingID: req.body.trackingid,
      post: req.body.post,
      date: formattedDate,
      status: req.body.status,
      created_date: today_date,
      location: req.body.location,
      payment: req.body.payment,
    });
    const saveOrder = await order.save();
    res.json({ success: true, data: saveOrder });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
    return;
  }
});

router.put("/updateorder/:id", fetchuser, async (req, res) => {
  const { orderid, trackingid, post, date, status, location, payment } =
    req.body;
  const parts = req.body.date.split("-");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  try {
    const newOrder = {};
    if (orderid) {
      newOrder.orderID = orderid;
    }
    if (trackingid) {
      newOrder.trackingID = trackingid;
    }
    if (post) {
      newOrder.post = post;
    }
    if (date) {
      newOrder.date = formattedDate;
    }
    if (status) {
      newOrder.status = status;
    }
    if (location) {
      newOrder.location = location;
    }
    if (payment) {
      newOrder.payment = payment;
    }
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Not Found");
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: newOrder },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
    return;
  }
});

router.delete("/deleteorder/:id", fetchuser, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Not Found");
    }
    order = await Order.findByIdAndDelete(req.params.id);
    res.json({ success: "Deleted successfully", order: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
    return;
  }
});

router.post("/generatereport", fetchuser, async (req, res) => {
  const rows = [];
  let not_present_in_db = [];
  let not_present_in_excel = [];
  let csv_data_rows = [];
  const parentDir = path.resolve(__dirname, "..");

  fs.createReadStream(path.join(parentDir, "/uploads/data.csv"))
    .pipe(csv())
    .on("data", (row) => {
      csv_data_rows.push(row);
    })
    .on("error", (error) => {
      console.error(error);
    });

  let cust_name, cust_phone, cust_pin, cust_tracking;
  for (i of req.body.orderids) {
    try {
      if (i != "\n") {
        let order = await Order.find({ orderID: i });
        if (order.length == 0) {
          not_present_in_db.push(i);
        } else {
          cust_tracking = order[0]["trackingID"];
        }
      }
    } catch (error) {
      console.error(error.message);
    }

    // const parentDir = path.resolve(__dirname, '..');
    // fs.createReadStream(path.join(parentDir, '/uploads/data.csv'))
    //     .pipe(csv())
    //     .on('data', (row) => {
    //         if (row['Order Number'] === String(i)) {
    //             let lower_case = row["First Name (Billing)"] + " "+ row["Last Name (Billing)"];
    //              cust_name = lower_case.toUpperCase();
    //             cust_phone = row["Phone (Billing)"];
    //             cust_pin = row["Postcode (Shipping)"];
    //         }

    //     })
    let found = false;
    if (i != "\n") {
      for (let r of csv_data_rows) {
        if (r["Order Number"] === String(i)) {
          let lower_case =
            r["First Name (Shipping)"] + " " + r["Last Name (Shipping)"];
          cust_name = lower_case.toUpperCase();
          cust_phone = r["Phone (Billing)"];
          cust_pin = r["Postcode (Shipping)"];
          found = true;
          break;
        }
      }

      if (found == false) {
        not_present_in_excel.push(i);
      }
    }
    const row = {
      trackingId: cust_tracking,
      name: cust_name,
      pincode: cust_pin,
      phone: cust_phone,
    };
    rows.push(row);
    (cust_name = ""), (cust_phone = ""), (cust_pin = ""), (cust_tracking = "");
  }
  const fields = [
    { label: "Tracking ID", value: "trackingId" },
    { label: "Name", value: "name" },
    { label: "Pincode", value: "pincode" },
    { label: "Mobile Number", value: "phone" },
  ];
  const opts = { fields };
  const parser = new json2csv.Parser(opts);
  const csvData = parser.parse(rows);
  res.json({
    success: true,
    csv: csvData,
    not_db: not_present_in_db,
    not_excel: not_present_in_excel,
  });
  return;
});

router.post("/track", (req, res) => {
  const options = {
    method: "POST",
    hostname: "api.ship24.com",
    port: null,
    path: "/public/v1/trackers/track",
    headers: {
      Accept: "*/*",
      Authorization: "apik_w7P07qE2FusiXkkN3HVhjnG4bmHTGz",
      "Content-Type": "application/json",
    },
  };

  const request = http.request(options, (response) => {
    let chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", () => {
      const body = Buffer.concat(chunks);
      res.send(body);
    });
  });

  request.on("error", (error) => {
    console.error(error);
    res.status(500).send("Internal Server Error");
  });
  request.write(
    JSON.stringify({
      trackingNumber: req.body.trackingNumber,
    })
  );
  request.end();
});

router.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({ message: "File uploaded successfully", success: true });
  } else {
    res.status(400).json({ error: "File upload unsuccessful", success: false });
  }
});
router.post("/checkupload", (req, res) => {
  const { filename } = req.params;
  const filePath = `uploads/dealer.txt`;

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist
      res.json({ exists: false });
    } else {
      // File exists
      res.json({ exists: true });
    }
  });
});

module.exports = router;
