import React, { useState, useContext, useEffect } from "react";
import recordContext from "../context/recordContext";
import { Alert } from "./Alert";
export function EditInvoice({ onCancel, onConfirm, id, invoice, invoiceType }) {
  if (invoiceType == "Estimate No.") {
    invoice.invoicenumber = "Estimate";
  }
  // const [invoiceDetails, setinvoiceDetails] = useState({
  //   customerName: invoice.customerName,
  //   invoiceNumber: invoice.invoicenumber,
  //   invoiceDate: invoice.invoiceDate,
  // });
  const [invoiceDetails, setinvoiceDetails] = useState(
    {
      customerName: invoice.customerName,
      invoiceNumber: invoice.invoicenumber,
      invoiceDate: invoice.invoiceDate, invoicetotal: 0,
      supplierName: invoice.supplierName
    }
  );
  const supplierNames = [
    'SHAH BOOK DEPOT',
    'PARAMOUNT MEDICAL BOOKS',
    'PARAMOUNT BOOK STALL',
    'MYBOOKSFACTORY',
    'MBF PUBLICATION',
    'ALPHA BOOKS'
  ];
  const [products, setProducts] = useState([
    {
      productCode: "",
      productName: "",
      author: "",
      price: "",
      quantity: 0,
      discount: 0,
    },
  ]);
  const context = useContext(recordContext);
  const { editInvoice, editEstimate } = context;
  const handleDeleteRow = (index, e) => {
    e.preventDefault();
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };


  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);

    if (index === products.length - 1) {
      setProducts([
        ...products,
        {
          productCode: "",
          author: "",
          productName: "",
          quantity: 0,
          price: "",
          discount: 0,
        },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (invoiceType === "Invoice No.") {
      editInvoice(id, invoiceDetails, products).then(() => {
        onConfirm();
        window.location.reload();
      });
    }
    else {
      editEstimate(id, invoiceDetails, products).then(() => {
        onConfirm();
        window.location.reload();
      });
    }

  };
  const handleOnChange = (e) => {
    setinvoiceDetails({ ...invoiceDetails, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setProducts([...invoice.products]);
  }, [invoice.products]);


  return (
    <div className="delete-confirmation">
      <div className="delete-confirmation-dialog edit-invoice-dialoge-pc">
        <h3>Edit</h3>
        <form
          className="addrecord-form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <label className='search-label invoice-label '>Supplier Name:</label>
          <select
            className='supplierName-select'
            value={invoiceDetails.supplierName}
            onChange={handleOnChange}
            name='supplierName'
          >
            <option value="">Select Supplier</option>
            {supplierNames.map((supplier, index) => (
              <option key={index} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
          <label className="search-label">Invoice No. : </label>
          <input
            required
            className="order-input"
            value={invoiceDetails.invoiceNumber}
            name={"invoiceNumber"}
            onChange={handleOnChange}
            type="text"
          />
          <br />
          <label className="search-label">Name: </label>
          <input
            required
            className="tracking-input"
            name={"customerName"}
            value={invoiceDetails.customerName}
            onChange={handleOnChange}
            type="text"
          />
          <br /> <label className="search-label">Date : </label>
          <input
            required
            className="date-input"
            onChange={handleOnChange}
            value={invoiceDetails.invoiceDate}
            name={"invoicedate"}
            type="date"
          />
          <br />
          <div className="product-list-pc invoice-details-container edit-scroll-conatiner">
            <div className="scroll-container-pc">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Author</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Disc %</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          id="productCode-pc"
                          value={product.productCode}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "productCode",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={product.author}
                          id="productAuthor-pc"
                          onChange={(e) =>
                            handleInputChange(index, "author", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={product.productName}
                          id="productName-pc"
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "productName",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          id="productQuantity-pc"
                          value={product.quantity}
                          onChange={(e) =>
                            handleInputChange(index, "quantity", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={product.price}
                          id="productPrice-pc"
                          onChange={(e) =>
                            handleInputChange(index, "price", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          id="productDiscount-pc"
                          value={product.discount}
                          onChange={(e) =>
                            handleInputChange(index, "discount", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          id="producttotal-pc"
                          value={(
                            product.price * product.quantity -
                            (product.discount / 100) *
                            product.price *
                            product.quantity
                          ).toFixed(0)}
                          readOnly
                        />
                      </td>
                      <td>
                        {index > 0 ? (
                          <button
                            className="delete-button"
                            onClick={(e) => handleDeleteRow(index, e)}
                          >
                            -
                          </button>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="buttons">
            <button className="btn btn-outline-success" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-warning"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInvoice;
