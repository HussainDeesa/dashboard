
import React, { useState, useContext, useEffect } from 'react';
import { Alert } from './Alert';
import { CsvResult } from './CsvResult';
import Cookies from 'js-cookie';
export function Report1(props) {

    const [state, setState] = useState({ csv: '', isLoading: true, success: false, message: '' })
    const [show, setShow] = useState("hide")
    const [orderIds, setOrderIds] = useState([]);
    const generateReport = async (e) => {
        setShow('hide')
        orderIds.unshift("\n")
        e.preventDefault()       
        const response = await fetch(`api/order/generatereport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': Cookies.get("auth-token")
            },
            body: JSON.stringify({ orderids: orderIds })
        })
        let json = await response.json()
        if (json.success) {        
        setState({ csv: json.csv, isLoading: false, success: json.success })
        setOrderIds([])
        setShow("show")
    }
    };
    const handleOnChange = (e) => {
        let inputValues=e.target.value.split('\n')
        setOrderIds(inputValues);
    };
    const handleDownload = (e) => {
        e.preventDefault();
        const blob = new Blob([state.csv], { type: 'text/x-csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Report.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);


    };

    return (
        <>
            <div className='search-dates'>

                <form onSubmit={(e) => {
                    generateReport(e)
                }}>
                    <textarea required className='textarea-input' onChange={handleOnChange} placeholder='Enter Order Ids, each in new line' value={orderIds.join('\n')} name='orderids' type='text' /> <br />

                    <button type="submit" className="btn btn-outline-success search-btn"
                    >
                        Generate Report</button>
                </form>
            </div>

            {(() => {
                if (state.success) {

                    return (
                        <button type="submit" className={`btn btn-outline-success search-btn ${show}`} onClick={(e) => {
                            handleDownload(e)
                        }}
                        >
                            Download Report</button>

                    )
                }



            })()}
        </>

    )
}


