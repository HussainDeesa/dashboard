import React, { useState, useContext } from 'react';
import recordContext from "../context/recordContext";
import { Alert } from './Alert';
export function EditRecord({ onCancel, onConfirm, id, order,alert,showAlert }) {
    const [added, setadded] = useState(false)
    const [record, setRecord] = useState({ orderid: order.orderID, trackingid: order.trackingID, date: order.date, post: order.post, status: order.status })
    const context = useContext(recordContext);
    const { editRecord, deleteRecord } = context;

    const handleSubmit = (e) => {
        e.preventDefault(); 
        editRecord(id, record.orderid, record.trackingid, record.post, record.date, record.status).then(() => {
      
            onConfirm();
            window.location.reload()
        })
    }
    const handleOnChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value })
    }

    return (
        <div className="delete-confirmation">
            <div className="delete-confirmation-dialog">
                <h3>Edit</h3>
                <form className='addrecord-form' onSubmit={(e) => {
                    handleSubmit(e)
                }}>
                    <label className='search-label'>Order ID : </label>
                    <input required className='order-input' value={record.orderid} name='orderid' onChange={handleOnChange} type='text' />
                    <br />
                    <label className='search-label'>Tracking ID : </label>
                    <input required className='tracking-input' name='trackingid' value={record.trackingid} onChange={handleOnChange} type='text' />
                    <br />  <label className='search-label'>Post : </label>
                    <select required className='post-input' name="post" onChange={handleOnChange} value={record.post} id="post">
                        <option value="">Select</option>
                        <option value="Indiapost">India Post</option>
                        <option value="Professional">Professional</option>
                        <option value="UPS">UPS</option>

                    </select>

                    <br />  <label className='search-label'>Date : </label>
                    <input required className='date-input' onChange={handleOnChange} value={record.date} name='date' type='date' />
                    <br />

                    <label className='search-label'>Status : </label>
                    <input required className='status-input' name='status' onChange={handleOnChange} value={record.status} type='text' />
                    <br />
                    {/* <button type="submit" className="btn btn-outline-success search-btn" onClick={(e)=>{
                handleSubmit(e)
            }} >Add Record</button> */}
                    <div className="buttons">
                        <button className='btn btn-outline-success' onClick={onCancel}>Cancel</button>
                        <button className='btn btn-warning' onClick={(e) => {
                            handleSubmit(e);

                        }}>Edit</button>
                    </div>
                </form>
            </div>
        
        </div>

    );
};

export default EditRecord;
