const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser");
const Invoice = require('../models/Invoice');
const Estimate = require('../models/Estimate');
const PDFDocument = require('pdfkit');
const fs = require("fs")
router.post('/createinvoice', fetchuser, async (req, res) => {
    try {
      const { invoiceDetails, products } = req.body;
      const invoice = new Invoice({
        supplierName:invoiceDetails.supplierName,
        customerName:invoiceDetails.customerName,
        invoiceDate:invoiceDetails.invoiceDate,
        invoicenumber:invoiceDetails.invoiceNumber,
        products,   
      });
  
      const savedInvoice = await invoice.save();
  
      res.json(savedInvoice);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });
  
  router.get('/fetchallinvoices', fetchuser, async (req, res) => {
    try {
      const invoices = await Invoice.find().sort({ _id: -1 });
      res.json(invoices);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurred");
    }
  });

  router.delete('/deleteinvoice/:id', fetchuser, async (req, res) => {

    try {

        let invoice = await Invoice.findById(req.params.id)
        if(invoice){
          invoice = await Invoice.findByIdAndDelete(req.params.id)
        }
        let estimate = await Estimate.findById(req.params.id)
        if (estimate) { 
          Estimate = await Estimate.findByIdAndDelete(req.params.id)
        }
        if(!invoice && !estimate){
          return res.status(404).send("Not Found")
        }
        res.json({ "success": "Deleted successfully", order: order })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occured")
        return
    }
})
router.put('/editinvoice/:id', fetchuser, async (req, res) => {
  const { editedProducts,editedInvoiceDetails } = req.body
  let products=editedProducts
  try {
      const editedInvoice = {
        supplierName:editedInvoiceDetails.supplierName,
        customerName:editedInvoiceDetails.customerName,
        invoiceDate:editedInvoiceDetails.invoiceDate,
        invoicenumber:editedInvoiceDetails.invoiceNumber,
        products,   
      };
      let invoice = await Invoice.findByIdAndUpdate(req.params.id, { $set: editedInvoice }, { new: true })
      res.json(invoice)
  } catch (error) {
      console.error(error.message)
      res.status(500).send("Some Error Occured")
      return
  }
})
// router.get('/generate-pdf/:invoiceId', async (req, res) => {
//   const invoiceId = req.params.invoiceId;
//   const invoice = await Invoice.findById(invoiceId)
//   let dis=0
//   let total=0
//   let qty=0
//   invoice.products.map((product)=>{
//     dis+=Number((((product.discount / 100) * product.price * product.quantity)).toFixed(0))
     
//     total+=(product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity).toFixed(0)
//     qty+=product.quantity
//   })
//   const numberToWords = (number) => {

//   const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//       const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//       const tens = ['Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//       const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
      
//       const toWords = (num, level) => {
//         if (num === 0) return '';
//         if (num < 10) return units[num] + ' ';
//         if (num < 20) return teens[num - 11] + ' ';
//         if (num < 100) return tens[Math.floor(num / 10) - 1] + ' ' + toWords(num % 10, level);
//         return units[Math.floor(num / 100)] + ' Hundred ' + toWords(num % 100, level);
//       };
    
//       let words = '';
//       let level = 0;
    
//       while (number > 0) {
//         const chunk = number % 1000;
//         if (chunk > 0) {
//           words = toWords(chunk, level) + thousands[level] + ' ' + words;
//         }
//         number = Math.floor(number / 1000);
//         level++;
//       }
//       return words.trim();
//     };
//     let amtWord=numberToWords(total)
//   console.log(dis,qty,total,amtWord);
//   const pdfDoc = new PDFDocument();
//   const pdfFileName = `invoice-${invoice.invoicenumber}.pdf`;
//   pdfDoc.pipe(fs.createWriteStream(`invoice-${invoice.invoicenumber}.pdf`));

//   pdfDoc.pipe(fs.createWriteStream(pdfFileName));

//   pdfDoc.font('Times-Roman');

//   // Shop Name and Address
//   pdfDoc.fontSize(18).text('Invoice', { align: 'center' });
//   pdfDoc.fontSize(18).text(invoice.supplierName, { align: 'center' });
//   pdfDoc.fontSize(12).text('No. 16 B Ground Floor, Lily Pond Shopping Complex', { align: 'center' });
//   pdfDoc.fontSize(12).text('(Nr Central Railway Station) Chennai-600 003', { align: 'center' });
//   pdfDoc.moveDown(2);

//   // Invoice Details
//   pdfDoc.fontSize(12).text(`Invoice Number: ${invoice.invoicenumber}`);
//   pdfDoc.text(`Date: ${invoice.invoiceDate}`);
//   pdfDoc.text(`Name: ${invoice.customerName}`);
//   pdfDoc.moveDown(2);

//   // Table Header
//   pdfDoc.fontSize(13);
//   pdfDoc.text('SNo.', 40, pdfDoc.y, { width: 40 });
//   pdfDoc.text('Author', 120, pdfDoc.y, { width: 120 });
//   pdfDoc.text('Product Name', 240, pdfDoc.y, { width: 200 });
//   pdfDoc.text('Qty', 440, pdfDoc.y, { width: 25 });
//   pdfDoc.text('Rate', 465, pdfDoc.y, { width: 55 });
//   pdfDoc.text('Disc %', 520, pdfDoc.y, { width: 55 });
//   pdfDoc.text('Total', 575, pdfDoc.y, { width: 60 });
//   pdfDoc.moveDown();

//   // Table Rows
//   pdfDoc.fontSize(13);
//   let yPos = pdfDoc.y;
//   invoice.products.forEach((product, index) => {
//     yPos = pdfDoc.y;
//     pdfDoc.text(`${index + 1}`, 40, yPos, { width: 40 });
//     pdfDoc.text(product.author, 120, yPos, { width: 120 });
//     pdfDoc.text(product.productName, 240, yPos, { width: 200 });
//     pdfDoc.text(product.quantity.toString(), 440, yPos, { width: 25, align: 'center' });
//     pdfDoc.text(product.price.toFixed(2), 465, yPos, { width: 55, align: 'right' });
//     pdfDoc.text(product.discount.toFixed(2), 520, yPos, { width: 55, align: 'center' });
//     pdfDoc.text(((product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)).toFixed(2), 575, yPos, { width: 60, align: 'right' });
//     pdfDoc.moveDown();
//   });

//   // Footer
//   pdfDoc.fontSize(14);
//   pdfDoc.text(`Total Items: ${invoice.products.length}`, 20, pdfDoc.y, { width: 200 });
//   pdfDoc.text(`Discount: ${dis}`, 220, pdfDoc.y, { width: 200 });
//   pdfDoc.text(`Total Qty: ${qty}`, 420, pdfDoc.y, { width: 200 });
//   pdfDoc.text(`Total: ${total}`, 620, pdfDoc.y, { width: 200 });
//   pdfDoc.moveDown();

//   pdfDoc.text(`Amount in Words: ${amtWord}`, { align: 'left' });
//   pdfDoc.moveDown();

//   pdfDoc.fontSize(12).text('HSN - 4901 Printed Books are exempted under GST', { align: 'left' });

//   pdfDoc.end();

//   // // Send the generated PDF as a response
//   res.setHeader('Content-Type', 'application/pdf');
//   res.sendFile(`invoice-${invoice.invoicenumber}.pdf`);
// });


module.exports = router