import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link,useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import recordContext from "../context/recordContext";
import Autosuggest from 'react-autosuggest';
export function CreateInvoice(props) {
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
const [disable, setdisable] = useState(true)

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
    setinvoiceDetails({ ...invoiceDetails, [e.target.name]: e.target.value })
    if(invoiceDetails.customerName!=''&&invoiceDetails.invoiceNumber!=''){
      setdisable(false)
  }

  }
  const [products, setProducts] = useState([
    { productCode: '', productName: '', author: '', price: '', quantity: '', discount: '' }
  ]);


  const handleAddRow = () => {
    setProducts([...products, { productCode: '', productName: '', author: '', price: '', quantity: '', discount: '' }]);
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

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  return availableProducts.data.filter(
    (product) =>{
     return product.Title.toLowerCase().includes(inputValue) ||
      product.ISBNCode.toLowerCase().includes(inputValue)
    } 
  );
};

const [suggestions, setSuggestions] = useState([]);


  const createInvoice = async (e) => {
    e.preventDefault();
    const response = await fetch(`api/invoice/createinvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": Cookies.get("auth-token"),
      },
      body: JSON.stringify({
        invoiceDetails: invoiceDetails,
        products: products
      }),
    });
  };

  const handleSubmit = (e) => {
    createInvoice(e).then(()=>{
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
        <h5>Create Invoice</h5>
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
        <div className='invoice-details'>
          <form>
          <div className='invoiceDetail-inputRow'>
            <label  className='search-label invoice-label'>Customer Name:</label>
            <input
              type="text"
              className='invoiceDetail-input'
              value={invoiceDetails.customerName}
              onChange={handleInvoiceChange}
              name={"customerName"}
              required
            />
          </div>
          <div className='invoiceDetail-inputRow'>
            <label className='search-label invoice-label'>Invoice Number:</label>
            <input
              type="text"
              className='invoiceDetail-input'
              value={invoiceDetails.invoiceNumber}
              onChange={handleInvoiceChange}
              name={"invoiceNumber"}
              required
            />
          </div>
          </form>
        </div>
        <div >
          <label className='search-label invoice-label'>Invoice Date:</label>
          <input
            type="date"
            className='invoiceDetail-input'
            value={invoiceDetails.invoiceDate}
            onChange={handleInvoiceChange}
            name={"invoicedate"}
          />
        </div>
        <div className='product-list product-list-invoice'>

          <div className='scroll-container'>
            {products.map((product, index) => (
              <div className="product-row" key={index}>
                <input
                  type="text"
                  id='productCode'
                  placeholder=" Code"
                  value={product.productCode}
                  onChange={(e) => handleInputChange(index, 'productCode', e.target.value)}
                />
                <input
                  type="text"
                  id='author'
                  placeholder="Author"
                  value={product.author}
                  onChange={(e) => handleInputChange(index, 'author', e.target.value)}
                />
                {/* <input
                  type="text"
                  id='productName'
                  placeholder="Product Name"
                  value={product.productName}
                  onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                /> */}
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={({ value }) =>{
                    setSuggestions(getSuggestions(value))
                     
                  }
                  }
                  onSuggestionsClearRequested={() => setSuggestions([])}
                  getSuggestionValue={(suggestion) => suggestion.Title}
                  renderSuggestion={(suggestion) => (
                    <div>{suggestion.Title}</div>
                  )}
                  inputProps={{
                    placeholder: 'Product Name',
                    value: product.productName,
                    onChange: (e, { newValue }) =>
                      handleInputChange(index, 'productName', newValue),
                  }}
                  onSuggestionSelected={(_, { suggestion }) => {
                    handleInputChange(index, 'productName', suggestion.Title);
                    handleInputChange(index, 'productCode', suggestion.ISBNCode);
                    handleInputChange(index, 'author', suggestion.Author);
                    handleInputChange(index, 'price', suggestion.Price);
                  }}
                />
                <input
                  type="number"
                  id='quantity'
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                />
                <input
                  type="number"
                  id='productprice'
                  placeholder="Rate"
                  value={product.price}
                  onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                />
                <input
                  id='productdiscount'
                  type="number"
                  placeholder='Disc %'
                  value={product.discount}
                  onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                />
                <input
                  type="number"
                  id='producttotal'
                  placeholder="Total"
                  value={((product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)).toFixed(0)}
                  readOnly
                />

                <button className="delete-button" onClick={() => handleDeleteRow(index)}>-</button>
                
              </div>
            ))}
          </div>
        </div>
        <button className="add-button" onClick={handleAddRow}>+</button>
        <div className='invoice-footer invoice-footer-mobile'>
                   <span><b>Total: ₹{invoiceTotal}</b></span> 
                    <span><b>Items: {totalItems}</b></span>
                    <span><b>Discount:  ₹{totalDiscount}</b></span>
                    <div className='generate-buttons'>
                        <button disabled={disable} className='btn btn-success search-btn generate-invoice-btn-pc'
                            onClick={(e) => {
                                handleSubmit(e);
                            }}>Generate </button>

                    </div>
                </div>
      </div>

    </>
  )
}



