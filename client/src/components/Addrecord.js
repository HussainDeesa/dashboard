import React, { useState, useContext, useEffect } from 'react';
import { PreviousOrder } from './Previousorder';
import { Alert } from './Alert';
export function Addrecord(props) {
    const [added,setadded]=useState(false)
    const [record, setRecord] = useState({ orderid: '', trackingid: '',date:'',post:'',status:''})

    const addRecord = async (e) => {
        setadded(added==false?true:false)
        e.preventDefault()
        const response = await fetch(`api/order/addorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ orderid: record.orderid, trackingid: String(record.trackingid), post:record.post, date:record.date, status:record.status  })
            
        })
        let json=await response.json(); 
        setadded(true)
        if(!json.success){
            props.showAlert(json.error);
        }
        setRecord({ orderid: '', trackingid: '',date:'',post:'',status:''})
    }
    const handleSubmit=(e)=>{
        addRecord(e);
    }
    const handleOnChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value })
    }
   
    useEffect(() => {
       
        // eslint-disable-next-line
    }, [])

    return (
        <>
        <div>
           <h3> Add Order Details </h3>
            <form className='addrecord-form' onSubmit={(e)=>{
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
                    <option value="India Post">India Post</option>
                    <option value="Professional">Professional</option>
                    <option value="UPS">UPS</option>
                    
                </select>
                
                <br />  <label className='search-label'>Date : </label>
                <input required className='date-input' onChange={handleOnChange} value={record.date} name='date' type='date' />
                <br />
                
              <label className='search-label'>Status : </label>
                <input required className='status-input' name='status'  onChange={handleOnChange} value={record.status} type='text' />
                <br />
                <button type="submit" className="btn btn-outline-success search-btn" onClick={(e)=>{
                handleSubmit(e)
            }} >Add Record</button>
            </form>
        </div>
        <Alert alert={props.alert} />
        <PreviousOrder added={added} />
        </> 
    )
}


