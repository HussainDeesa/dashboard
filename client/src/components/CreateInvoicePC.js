import React, { useState, useContext, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Link,useNavigate } from "react-router-dom";
export function CreateInvoicePC(props) {
    const currentDate = new Date();
    const utcOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(currentDate.getTime() + utcOffset);
    const today = istDate.toISOString().split("T")[0];
    const [invoiceTotal, setInvoiceTotal] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [invoiceDetails, setinvoiceDetails] = useState(
        { customerName: '', invoiceNumber: '', invoiceDate: today, invoicetotal: 0 }
    );
    const calculateTotal = () => {
        let total = 0
        products.forEach(product => {
            total += (product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)
        });
        setInvoiceTotal(total);
    }
    const calculateDiscount = () => {
        let total = 0
        products.forEach(product => {
            total += ((product.discount / 100) * product.price * product.quantity)
        });
        setTotalDiscount(total);
    }
    const calculateTotalItems = () => {
        let totalCount = 0
        products.forEach(product => {
            totalCount += parseInt(product.quantity);
        });
        setTotalItems(totalCount)
    }
    const handleInvoiceChange = (e) => {
        setinvoiceDetails({ ...invoiceDetails, [e.target.name]: e.target.value })

    }
    const [products, setProducts] = useState([
        { productCode: '', productName: '', author: '', price: '', quantity: 0, discount: 0 }
    ]);

    const handleDeleteRow = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);

    };

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);

        if (index === products.length - 1) {
            setProducts([...products, { productCode: '', author: '', productName: '', quantity: 0, price: '', discount: 0 }]);
        }

    };


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
	let navigate = useNavigate();

    const handleSubmit = (e) => {
        createInvoice(e).then(()=>{
            navigate("/invoice")
        })
    };
    const handleBack = (e) => {
        navigate("/invoice");
    };



    useEffect(() => {
        calculateTotal();
        calculateTotalItems();
        calculateDiscount();
    }, [products]);
    return (
        <>
            <div className='invoice-pc-container'>
                <div>
                <button className='btn btn-outline-success invoice-back-button'   onClick={(e) => {
                                handleBack(e);
                            }}>
                    Back</button>
                <h5>Create Invoice</h5>
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
                        />
                    </div>
                    <div className='invoiceDetail-inputRow-pc'>
                        <label className='search-label invoice-label'>Invoice Number:</label>
                        <input
                            type="text"
                            className='invoiceDetail-input'
                            value={invoiceDetails.invoiceNumber}
                            onChange={handleInvoiceChange}
                            name={"invoiceNumber"}
                        />
                    </div>
                    <label className='search-label invoice-label'>Invoice Date:</label>
                    <input
                        type="date"
                        className='invoiceDetail-input'
                        value={invoiceDetails.invoiceDate}
                        onChange={handleInvoiceChange}
                        name={"invoicedate"}
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
                                                value={product.code}
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
                                        <td>
                                            <input
                                                type="text"
                                                value={product.name}
                                                id='productName-pc'
                                                onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                                            />
                                        </td>
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
                                                value={(product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)}
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
                        <button className='btn btn-success search-btn generate-invoice-btn-pc'
                            onClick={(e) => {
                                handleSubmit(e);
                            }}>Generate Invoice</button>

                    </div>
                </div>
            </div>

        </>
    )
}



