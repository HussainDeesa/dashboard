import React, { useState, useContext, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Link,useNavigate } from "react-router-dom";
import recordContext from "../context/recordContext";
export function CreateEstimate(props) {
  let navigate = useNavigate();
  const currentDate = new Date();
  const utcOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(currentDate.getTime() + utcOffset);
  const today = istDate.toISOString().split("T")[0];
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [invoiceDetails, setinvoiceDetails] = useState(
    { customerName: '', invoiceNumber: '', invoiceDate: today, invoicetotal: 0, supplierName: 'SHAH BOOK DEPOT' }
);
const context = useContext(recordContext);
const { getallproducts, availableProducts } = context;

const supplierNames = [
    'SHAH BOOK DEPOT',
    'PARAMOUNT MEDICAL BOOKS',
    'PARAMOUNT BOOK STALL',
    'MYBOOKSFACTORY',
    'MBF PUBLICATION',
    'ALPHA BOOKS'
];
  const handleInvoiceChange = (e) => {
    setinvoiceDetails({ ...invoiceDetails, [e.target.name]: e.target.value });
  };
  const [products, setProducts] = useState([
    { productCode: "", productName: "", author: "", price: "", quantity: "" },
  ]);

  const handleAddRow = () => {
    setProducts([
      ...products,
      { productCode: "", productName: "", author: "", price: "", quantity: "" },
    ]);
    console.log(products);
  };

  const handleDeleteRow = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };
  const searchProductByISBN = (isbn) => {
    const foundProduct = availableProducts.data.find(product => product.ISBNCode === isbn);
    return foundProduct;
  };
  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;

    if (field === 'productCode') {
      const foundProduct = searchProductByISBN(value);
      if (foundProduct) {
        updatedProducts[index]['author'] = foundProduct.Author;
        updatedProducts[index]['productName'] = foundProduct.Title;
        updatedProducts[index]['price'] = foundProduct.Price;
      }
            if (!foundProduct) {
              updatedProducts[index]['author'] = '';
              updatedProducts[index]['productName'] = '';
              updatedProducts[index]['price'] = '';
          } 
    }

    setProducts(updatedProducts);
  };
  const createEstimate = async (e) => {
    e.preventDefault();
    const response = await fetch(`api/estimate/createestimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": Cookies.get("auth-token"),
      },
      body: JSON.stringify({
        invoiceDetails: invoiceDetails,
        products: products,
      }),
    });
  };

  const calculateTotal = () => {
    let total = 0
    products.forEach(product => {
        total += (product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)
    });
    setInvoiceTotal(total.toFixed(0));
}
const calculateDiscount = () => {
    let total = 0
    products.forEach(product => {
        total += ((product.discount / 100) * product.price * product.quantity)
    });
    setTotalDiscount(total.toFixed(0));
}
const calculateTotalItems = () => {
    let totalCount = 0
    products.forEach(product => {
        totalCount += parseInt(product.quantity);
    });
    setTotalItems(totalCount)
}

  const handleSubmit = (e) => {
    createEstimate(e).then(()=>{
      navigate("/invoice")
    })

  };

  useEffect(() => {
    calculateTotal();
    calculateTotalItems();
    calculateDiscount();
}, [products]);
useEffect((e) => {
  getallproducts()
  }, []) 
if (availableProducts.isLoading) {
  return null;
}
  return (
    <>
      <div>
        <h5>Create Estimate</h5>
        <div className='invoiceDetail-inputRow-pc'>
                    <label className='search-label invoice-label '>Supplier Name:</label>
                    <select
                        className='supplierName-select'
                        value={invoiceDetails.supplierName}
                        onChange={handleInvoiceChange}
                        name='supplierName'
                    >
                        <option value="">Select Supplier</option>
                        {supplierNames.map((supplier, index) => (
                            <option key={index} value={supplier}>
                                {supplier}
                            </option>
                        ))}
                    </select>
                </div>
        <div className="invoice-details">
          <label className="search-label invoice-label">Customer Name:</label>
          <input
            type="text"
            className="invoiceDetail-input"
            value={invoiceDetails.customerName}
            onChange={handleInvoiceChange}
            name={"customerName"}
          />
          <div>
            <label className="search-label invoice-label">Estimate Date:</label>
            <input
              type="date"
              className="invoiceDetail-input"
              value={invoiceDetails.invoiceDate}
              onChange={handleInvoiceChange}
              name={"invoiceDate"}
            />
          </div>
        </div>
        <div className="product-list">
          <div className="scroll-container">
            {products.map((product, index) => (
              <div className="product-row" key={index}>
                <input
                  type="text"
                  id="productCode"
                  placeholder=" Code"
                  value={product.code}
                  onChange={(e) =>
                    handleInputChange(index, "productCode", e.target.value)
                  }
                />
                <input
                  type="text"
                  id="author"
                  placeholder="Author"
                  value={product.author}
                  onChange={(e) =>
                    handleInputChange(index, "author", e.target.value)
                  }
                />
                <input
                  type="text"
                  id="productname"
                  placeholder="Product Name"
                  value={product.productName}
                  onChange={(e) =>
                    handleInputChange(index, "productName", e.target.value)
                  }
                />
                <input
                  type="number"
                  id="quantity"
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) =>
                    handleInputChange(index, "quantity", e.target.value)
                  }
                />
                <input
                  type="number"
                  id="productprice"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) =>
                    handleInputChange(index, "price", e.target.value)
                  }
                />
                <input
                  type="number"
                  id="producttotal"
                  placeholder="Total"
                  value={product.quantity * product.price}
                  readOnly
                />

                <button
                  className="delete-button"
                  onClick={() => handleDeleteRow(index)}
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="add-button" onClick={handleAddRow}>
          +
        </button>
        <div className="generate-buttons">
          {/* <button
            className="btn btn-outline-success search-btn generate-estimate-btn"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Generate Estimate
          </button> */}
        </div>
        <div className='invoice-footer invoice-footer-mobile'>
                   <span><b>Total: ₹{invoiceTotal}</b></span> 
                    <span><b>Items: {totalItems}</b></span>
                    <span><b>Discount:  ₹{totalDiscount}</b></span>
                    <div className='generate-buttons'>
                        <button className='btn btn-success search-btn generate-invoice-btn-pc'
                            onClick={(e) => {
                                handleSubmit(e);
                            }}>Generate </button>

                    </div>
                </div>
      </div>
    </>
  );
}
