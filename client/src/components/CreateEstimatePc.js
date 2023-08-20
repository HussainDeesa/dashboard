import React, { useState, useContext, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import '../PC-App.css'
import recordContext from "../context/recordContext";
import Autosuggest from 'react-autosuggest';

import { Link,useNavigate } from "react-router-dom";
export function CreateEstimatePC(props) {
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
    const [disable, setdisable] = useState(true)

    const supplierNames = [
        'SHAH BOOK DEPOT',
        'PARAMOUNT MEDICAL BOOKS',
        'PARAMOUNT BOOK STALL',
        'MYBOOKSFACTORY',
        'MBF PUBLICATION',
        'ALPHA BOOKS'
    ];
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
    const searchProductByISBN = (isbn) => {
        const foundProduct = availableProducts.data.find(product => product.ISBNCode === isbn);
        return foundProduct;
    };
    const handleInvoiceChange = (e) => {
        setinvoiceDetails({ ...invoiceDetails, [e.target.name]: e.target.value })
        if(invoiceDetails.customerName!=''){
            setdisable(false)
        }
    }
    const [products, setProducts] = useState([
        { productCode: '', productName: '', author: '', price: '', quantity: 0, discount: 0 }
    ]);

    const handleDeleteRow = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);

    };
    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();

        return availableProducts.data.filter(
            (product) => {
                return product.Title.toLowerCase().includes(inputValue) ||
                    product.ISBNCode.toLowerCase().includes(inputValue)
            }
        );
    };

    const [suggestions, setSuggestions] = useState([]);
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
        if (index === updatedProducts.length - 1) {
            updatedProducts.push({ productCode: '', author: '', productName: '', quantity: 0, price: '', discount: 0 });
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

    const handleSubmit = (e) => {
        createEstimate(e).then(()=>{
            navigate("/invoice")
        })
    };
    const handleBack = (e) => {
        navigate("/invoice");
    };
    useEffect(() => {
        document.body.classList.add('pc-body');
    
        return () => {
          document.body.classList.remove('pc-body');
        };
    }, [])
    


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
            <div className='invoice-pc-container'>
                <div>
                <button className='btn btn-outline-success invoice-back-button'   onClick={(e) => {
                                handleBack(e);
                            }}>
                    Back</button>
                <h5>Create Estimate</h5>
                </div>
                <div className='invoiceDetail-inputRow-pc'>
                    <label className='search-label invoice-label'>Supplier Name:</label>
                    <select
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
                    <div className='invoiceDetail-inputRow-pc'>
                        <label className='search-label invoice-label'>Customer Name:</label>
                        <input
                            type="text"
                            className='invoiceDetail-input'
                            value={invoiceDetails.customerName}
                            onChange={handleInvoiceChange}
                            name={"customerName"}
                            required
                        />
                    </div>
                    <label className='search-label invoice-label'>Estimate Date:</label>
                    <input
                        type="date"
                        className='invoiceDetail-input'
                        value={invoiceDetails.invoiceDate}
                        onChange={handleInvoiceChange}
                        name={"invoiceDate"}
                        required
                    />

                </div>
                <div className='product-list-pc invoice-details-container'>

                    <div className='scroll-container-pc'>

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
                                                id='productCode-pc'
                                                value={product.productCode}
                                                onChange={(e) => handleInputChange(index, 'productCode', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={product.author}
                                                id='productAuthor-pc'
                                                onChange={(e) => handleInputChange(index, 'author', e.target.value)}
                                            />
                                        </td>
                                        {/* <td>
                                            <input
                                                type="text"
                                                value={product.productName}
                                                id='productName-pc'
                                                onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                                            />
                                        </td> */}
                                        <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={({ value }) => {
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
                                                id:'productName-pc',
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
                                        <td>
                                            <input
                                                type="number"
                                                id='productQuantity-pc'
                                                value={product.quantity}
                                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.price}
                                                id='productPrice-pc'
                                                onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                id='productDiscount-pc'
                                                value={product.discount}
                                                onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                id='producttotal-pc'
                                                value={((product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)).toFixed(0)}
                                                readOnly
                                            />
                                        </td>
                                        {index > 0 ?
                                            <button className="delete-button" onClick={() => handleDeleteRow(index)}>-</button> : <></>
                                        }

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                {/* <button className="add-button" onClick={handleAddRow}>+</button> */}

                <div className='invoice-footer'>
                   <span><b>Invoice Total: ₹{invoiceTotal}</b></span> 
                    <span><b>Total Items: {totalItems}</b></span>
                    <span><b>Total Discount:  ₹{totalDiscount}</b></span>
                    <div className='generate-buttons'>
                        <button disabled={disable} className='btn btn-success search-btn generate-invoice-btn-pc'
                            onClick={(e) => {
                                handleSubmit(e);
                            }}>Generate Estimate</button>

                    </div>
                </div>
            </div>

        </>
    )
}



