
import React, { useState, useContext, useEffect } from 'react';

import { SearchResult } from './SearchResult';
import { Alert } from './Alert';

export function SearchByTrackingID(props) {
    const [record, setRecord] = useState({ trackingid: '' })
    const [state, setState] = useState({ data: {}, isLoading: true, success: '' })


    const getbytrackingid = async (id, e) => {
        e.preventDefault()
        // let trackingid = String(id)
        const response = await fetch(`api/order/fetchorderbytrackingid/${id}`, {
            method: 'GET'
        })
        let json = await response.json()
        if (!json.success) {
            props.showAlert(json.error)
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

                <h4> Tracking ID </h4>
                <form>
                    <label className='search-label'>Tracking ID : </label>
                    <input required className='trackingid-input' value={record.trackingid} name='trackingid' onChange={handleOnChange} type='text' />
                    <br />
                    <button type="submit" className="btn btn-outline-success search-btn" onClick={(e) => {
                        getbytrackingid(record.trackingid, e)
                    }} >Search</button>
                </form>
            </div>
            {(() => {
                if (state.success) {

                    return (
                        <SearchResult alert={props.alert} data={state.data} />
                    )
                }

            })()}
            <Alert alert={props.alert} />
        </>
    )
}


