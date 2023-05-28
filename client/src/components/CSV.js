
import React, { useState, useContext, useEffect } from 'react';
import { Alert } from './Alert';
import { CsvResult } from './CsvResult';
export function CSV(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false,csv:'' })

    const [record, setRecord] = useState({ startDate: '', endDate: '' })
    let json;
    const getordersbetweendates = async () => {
        const response = await fetch(`api/order/fetchordersbetweendates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate: record.startDate, endDate: record.endDate })
        })
        json = await response.json()
        setState({ data: json.data, isLoading: false, success: json.success,csv:json.csv })
        // console.log(json.data.length);
        if(json.success==false){
            props.showAlert(json.error, 3000)
        }

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        getordersbetweendates().then(()=>{

        })

    }
    const handleOnChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className='search-dates'>

                <form onSubmit={(e)=>{
                    handleSubmit(e)
                }}>
                    <label className='search-label'>Start Date : </label>
                    <input required className='date-input ' onChange={handleOnChange} value={record.startDate} name='startDate' type='date' /> <br />
                    <label className='search-label'>End Date : </label>
                    <input required className='date-input end-date' onChange={handleOnChange} value={record.endDate} name='endDate' type='date' /> <br />
                    <button type="submit" className="btn btn-outline-success search-btn" 
                    // onClick={(e) => {
                    //     handleSubmit(e)
                    // }} 
                    >
                        Get Records</button>
                </form>
            </div>

            {(() => {

                // if(!state.success){
                //     <Alert alert={props.alert}/>
                // }
                if (state.success) {
            
                    return (
                        <CsvResult alert={props.alert} showAlert={props.showAlert} data={state} record={record}  />
                    )
                }
                


            })()}
            <Alert alert={props.alert} />
        </>

    )
}


