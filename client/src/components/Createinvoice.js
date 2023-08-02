import React, { useState, useContext, useEffect, useRef } from 'react';
import { PreviousOrder } from './Previousorder';
import { Alert } from './Alert';
import recordContext from "../context/recordContext";
import Cookies from 'js-cookie';
export function CreateInvoice(props) {
    const [customerName, setCustomerName] = useState('');

    const [products, setProducts] = useState([
        { code: '', name: '', author: '', price: '', quantity: '' }
      ]);
    
      const handleAddRow = () => {
        setProducts([...products, { code: '', name: '', author: '', price: '', quantity: '' }]);
        console.log(products);
      };
    
      const handleDeleteRow = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
      };
    
      const handleInputChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
      };
    useEffect(() => {
        // orderInputRef.current.focus();
        // fetchCount();
    }, []);

    return (
        <>
        <div>
            <h5>Create Invoice</h5>
            <label className='search-label'>Customer Name:</label>
        <input
          type="text"
         
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className='product-list'>
         
        <div className='scroll-container'>
            {products.map((product, index) => (
        <div className="product-row" key={index}>
          <input
            type="text"
            id='productcode'
            placeholder=" Code"
            value={product.code}
            onChange={(e) => handleInputChange(index, 'code', e.target.value)}
          />
             <input
            type="text"
            id='author'
            placeholder="Author"
            value={product.author}
            onChange={(e) => handleInputChange(index, 'author', e.target.value)}
          />
          <input
            type="text"
            id='productname'
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
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
            placeholder="Price"
            value={product.price}
            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
          />
       
          <button className="delete-button" onClick={() => handleDeleteRow(index)}>-</button>
        </div>
      ))}
      </div>
      </div>
      <button className="add-button" onClick={handleAddRow}>+</button>
      <div className='generate-buttons'>
      <button className='btn btn-outline-success search-btn generate-invoice-btn'>Generate Invoice</button>	
      <button className='btn btn-outline-success search-btn generate-estimate-btn'>Generate Estimate</button>	

      </div>
    </div>
  
            {/* <div>
                <h3 className='records-added'>Records Added : {count}</h3>
                <h3> Add Order Details </h3>
                <form className='addrecord-form' onSubmit={(e) => {
                    handleSubmit(e)
                }}>
                    <label className='search-label'>Order ID : </label>
                    <input required id='order-input' ref={orderInputRef} className='order-input' value={record.orderid} name='orderid' onChange={handleOnChange} type='text' />
                    <br />
                    <label className='search-label'>Tracking ID : </label>
                    <input required className='tracking-input' name='trackingid' ref={trackingInputRef} value={record.trackingid} onChange={handleOnChange} type='text' />
                    <br />  <label className='search-label'>Post : </label>
                    <select required className='post-input' name="post" onChange={handleOnChange} value={record.post} id="post">
                        <option value="India Post">India Post</option>
                        <option value="Professional">Professional</option>
                        <option value="UPS">UPS</option>

                    </select>

                    <br />  <label className='search-label'>Date : </label>
                    <input required className='date-input' onChange={handleOnChange} value={record.date} name='date' type='date' />
                    <br />

                    <label className='search-label'>Status : </label>
                    <input required className='status-input' name='status' onChange={handleOnChange} readOnly value={record.status} type='text' />
                    <br />
                    <button type="submit" className="btn btn-outline-success search-btn" onClick={(e) => {
                        handleSubmit(e)
                    }} >Add Record</button>
                </form>
            </div> */}
            {/* <Alert state={record} alert={props.alert} /> */}
            {/* <PreviousOrder added={added} /> */}
        </>
    )
}



