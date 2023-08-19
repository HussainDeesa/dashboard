
import React, { useState, useContext, useEffect } from 'react';
import { Report1 } from './Report1';
import Cookies from "js-cookie";

export function OrderReport1(props) {

    const [state, setState] = useState({ segArr: '', isLoading: true, success: false, notfound: '' })
    const [csvReady, setcsvReady] = useState({ success: true, csv: '',dealer:'' })
    const [dealer, setdealer] = useState()
    const [file, setFile] = useState()
    const [hide, sethide] = useState(true)
    const generateCSV = async (e, data,dealer) => {
        console.log(dealer);
        sethide(true)
        e.preventDefault()
        if (file) {

            const response = await fetch('api/product/generatecsv', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": Cookies.get("auth-token"),
                },
                body: JSON.stringify({
                    data: data,
                    dealer:dealer
                }), 
            })
            let json = await response.json()
            if (json.success) {
                sethide(false)
            }
            setcsvReady({ success: json.success, csv: json.csv,dealer:json.dealer })
            console.log(csvReady);
        }
    };
    const handleDownload = (e) => {
        e.preventDefault();
        const blob = new Blob([csvReady.csv], { type: 'text/x-csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${csvReady.dealer}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    };
    const handleRadioChange = (event) => {
        const selectedDealerName = event.target.value;
        let selectedDealerData
        if (selectedDealerName === "Unknown") {
            selectedDealerData = state.notfound
        }
        else {
            selectedDealerData = state.segArr[selectedDealerName];
        }
            generateCSV(event, selectedDealerData,selectedDealerName)


    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };
    const handleUpload = async (e) => {
        e.preventDefault()
        if (file) {
            const formData = new FormData();
            formData.append('file', file, "order.xlsx");

            const response = await fetch('api/product/generatereport', {
                method: 'POST',
                body: formData,
            })
            let json = await response.json()
            console.log(json);
            if (json.success) {
                setState({ success: json.success, notfound: json.notfound, segArr: json.segArr, isLoading: false })
            }
            else {
                setState({ success: json.success, message: json.error })
            }
        }
    };
    useEffect(() => {


    }, [])

    return (
        <>
            <div className='search-dates'>
                <div className='orderReport'>
                    <form onSubmit={(e) => {
                        handleUpload(e)
                    }}>
                        <label>Order list</label>
                        <input className='date-input ' onChange={handleFileChange} name='fileupload' type='file' required /> <br />

                        <button type="submit" className="btn btn-outline-success search-btn"
                        >
                            Upload</button>
                    </form>
                </div>

            </div>
            {(() => {
                if (state.success) {
                    return (
                        <>
                        <div className='radio-buttons '>
                            {Object.keys(state.segArr).map((dealerName, index) => (
                                <div className='radio-button' key={index}>
                                    <label>
                                        <input
                                            type='radio'
                                            name={`dealerRadio`}
                                            value={dealerName}
                                            onChange={handleRadioChange}
                                        />
                                        {dealerName}

                                    </label>
                                </div>
                            ))}

                            {state.notfound.length > 0 ? (<label>
                                <input
                                    type='radio'
                                    name={'dealerRadio'}
                                    value={'Unknown'}
                                    onChange={handleRadioChange}
                                />
                                {'Unknown'}

                            </label>) : null}
                            </div>

                        </>
                    )
                }
            })()}

            <div>
                <button type="submit" hidden={hide} className={`btn btn-outline-success search-btn`} onClick={(e) => {
                    handleDownload(e)
                }}
                >
                    Download Report-{csvReady.dealer}</button>
            </div>


        </>

    )
}


