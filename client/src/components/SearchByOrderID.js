
import React, { useState, useContext, useEffect } from 'react';
import { SearchResult } from './SearchResult';
import { Alert } from './Alert';

export function SearchByOrderID(props) {

    const [record, setRecord] = useState({ orderid: '' })
    const [state, setState] = useState({ data: {}, isLoading: true, success: false })


    const getbyorderid = async (id, e) => {
        e.preventDefault()
        let orderid = Number(id)
        const response = await fetch(`api/order/fetchorderbyorderid/${orderid}`, {
            method: 'GET'
        })
        let json = await response.json()
        if (!json.success) {
            props.showAlert(json.error,3000)
        }
        setState({ data: json.data, isLoading: false, success: json.success })


    };

 
    const handleOnChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value })
    }

    useEffect(() => {

        // eslint-disable-next-line
    }, [])


    return (
        <>
            <div className='search-tracking'>

                <h4> Order ID </h4>
                <form>
                    <label className='search-label'>Order ID : </label>
                    <input required className='trackingid-input' value={record.orderid} name='orderid' onChange={handleOnChange} type='text' />
                    <br />
                    <button type="submit" className="btn btn-outline-success search-btn" onClick={(e) => {
                        getbyorderid(record.orderid, e)
                    }} >Search</button>
                </form>

            </div>
            {(() => {
                if (state.success) {

                    return (
                        <SearchResult alert={props.alert} showAlert={props.showAlert} data={state.data} />
                    )
                }


            })()}
            <Alert alert={props.alert} />
        </>
    )
}


