import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import ReactDOM from 'react-dom'
import del from "../images/delete.png";
import edit from "../images/edit.png";
import download from "../images/download.png";
import recordContext from "../context/recordContext";
import { DeleteConfirmation } from "./DeleteConfirmtion";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { InvoiceTableItem } from "./InvoiceTableItem";
import { EditInvoice } from "./EditInvoice";
import { saveAs } from 'file-saver';
import { BlobProvider, Document, Page,View, Text,StyleSheet,PDFViewer } from '@react-pdf/renderer';

import InvoicePDF from "./InvoicePDF"; 
import EstimatePDF from "./EstimatePDF";


export function InvoiceItem(props) {
  const context = useContext(recordContext);
  const { deleteInvoice } = context;
  const { item } = props;
  const [id, setID] = useState("");
  const [Invoice, setInvoice] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [footer, setFooter] = useState({quantity:0,discount:0,total:0,amtWord:''})

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    deleteInvoice(id);
    window.location.reload();
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = () => {
    setShowEditModel(true);
  };
  const calculateInvoiceFooter = (invoice) => {
    let dis=0
    let total=0
    let qty=0
    invoice.products.map((product)=>{
      dis+=Number((((product.discount / 100) * product.price * product.quantity)).toFixed(0))
       
      total+=(product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity).toFixed(0)
      qty+=product.quantity
    })
    const numberToWords = (number) => {
      const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
      
      const toWords = (num, level) => {
        if (num === 0) return '';
        if (num < 10) return units[num] + ' ';
        if (num < 20) return teens[num - 11] + ' ';
        if (num < 100) return tens[Math.floor(num / 10) - 1] + ' ' + toWords(num % 10, level);
        return units[Math.floor(num / 100)] + ' Hundred ' + toWords(num % 100, level);
      };
    
      let words = '';
      let level = 0;
    
      while (number > 0) {
        const chunk = number % 1000;
        if (chunk > 0) {
          words = toWords(chunk, level) + thousands[level] + ' ' + words;
        }
        number = Math.floor(number / 1000);
        level++;
      }
      return words.trim();
    };
    let amtWord=numberToWords(total)
    
    setFooter({quantity:qty,discount:dis.toFixed(0),total:total.toFixed(2),amtWord:amtWord})
  };

  const handleShowPDFClick = async (invoice) => {
    if(showPDF==false){
      calculateInvoiceFooter(invoice)
        setShowPDF(true);
    }
    if(showPDF==true){
      setShowPDF(false)
    }
      // try {
      //   const response = await axios.get(`api/invoice/generate-pdf/${invoice._id}`, {
      //     responseType: 'blob', // Important to specify that the response is a blob
      //   });
      //   console.log(response);
      //   const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      //   const pdfUrl = URL.createObjectURL(pdfBlob);
  
      //   const a = document.createElement('a');
      //   a.href = pdfUrl;
      //   a.download = `invoice-${item.invoicenumber}.pdf`;
      //   a.click(); 
  
      //   URL.revokeObjectURL(pdfUrl);
      // } catch (error) {
      //   console.error('Error downloading PDF:', error);
      // }  
  };

  const handelCancelEdit = () => {
    setShowEditModel(false);
  };

  const handleCOnfirmEdit = () => {};

  return (
    <>
      <div className="invoice-items">
        <div className="accordion-item">
          <h2 className="accordion-header" id={`heading${props.count}`}>
            <div className="accordion-head">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${props.count}`}
                aria-expanded="true"
                aria-controls={`collapse${props.count}`}
              >
                <div className="accordion-invoice-details">
                  <div className="accordion-invoice-number">
                    <b>
                      {props.invoiceType}: #{item.invoicenumber}
                    </b>
                  </div>
                  <span>
                    <b>Name: {item.customerName}</b>
                  </span>
                </div>
              </button>
              <img
                src={del}
                onClick={() => {
                  setID(item._id);
                  handleDeleteClick();
                }}
                className="accordion-del-img"
              ></img>
              <img src={edit} className="accordion-edit-img"  onClick={() => {
                  setID(item._id);
                  setInvoice(item)
                  handleEditClick();
                }}></img>
              <img src={download} className="accordion-download-img" onClick={() => {
                  setID(item._id);
                  setInvoice(item)
                  handleShowPDFClick(item);
                }}></img>
            </div>
          </h2>
          <div
            id={`collapse${props.count}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${props.count}`}
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="table-box-outer">
                <div className="table-box product-box">
                  <table className="table" id="table">
                    <thead>
                      <tr>
                        <th scope="col">Product Code</th>
                        <th scope="col">Author Name</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Disc%</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {item.products.map((element) => {
                        return (
                          <InvoiceTableItem key={element._id} item={element} />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
          {showEditModel && (
        <EditInvoice
          alert={props.alert}
          showAlert={props.showAlert}
          id={id}
          invoiceType={props.invoiceType}
          invoice={Invoice}
          onCancel={handelCancelEdit}
          onConfirm={handleCOnfirmEdit}
        />
      )}

      {props.invoiceType==="Invoice No."?showPDF && (              
              <InvoicePDF
                alert={props.alert}
                id={id}
                invoice={Invoice}
                invoiceFooter={footer}
                products={Invoice.products}
              />):showPDF && (              
                <EstimatePDF
                  alert={props.alert}
                  id={id}
                  invoice={Invoice}
                  invoiceFooter={footer}
                  products={Invoice.products}
                />)
      }


    </>
  );
}
