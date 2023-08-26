
import React, { useState, useContext, useEffect } from 'react';
import Cookies from "js-cookie";
import { Loader } from './Loader';
import { EditOrderReport } from './EditOrderReport';
import * as XLSX from 'xlsx';

export function OrderReport1(props) {

    const [state, setState] = useState({ segArr: '', isLoading: false, success: false, notfound: '', unsegArr: '', uncategorizedArr: '' })
    const [reportReady, setreportReady] = useState(false)
    const [reportGenerating, setReportGenerating] = useState(false)
    const [csvGenerating, setCSVGenerating] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [file, setFile] = useState()
    const [selectedDealerData, setselectedDealerData] = useState({selectedDate:'',selectedDealer:''})
    const generateCSV = async (e) => {
        setCSVGenerating(true)
        e.preventDefault()

    };
    const handleGenerateReport = async (e) => {
        setCSVGenerating(false)

        setReportGenerating(true)
        e.preventDefault()
        const response = await fetch('api/product/generatereport', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "auth-token": Cookies.get("auth-token"),
            },
        })
        let json = await response.json()
        if (json.success) {
            setreportReady(true)
            setReportGenerating(false)

            setState({ isLoading: false, segArr: json.segArr, notfound: json.notfound, success: json.success, uncategorizedArr: json.uncategorizedArr })
        }

    };

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }
    const handleDownload = (e) => {
        e.preventDefault();
        let today_date = new Date().toISOString().split('T')[0].split('-').reverse().join('-');
        const newData = selectedDealerData.selectedDate.map(item => {
            const { dealer, ...rest } = item;
            const rearrangedItem = {
                ISBNCode: rest.ISBNCode,
                title: rest.title,
                quantity: rest.quantity,
            };
            return rearrangedItem
        }); 
        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedDealerData.selectedDealer} - ${today_date}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleRadioChange = (event) => {
        const selectedDealerName = event.target.value;

        if (selectedDealerName === "Unknown") {
            setselectedDealerData({selectedDate:state.notfound,selectedDealer:event.target.value})
        }
        else {
            setselectedDealerData({selectedDate:state.segArr[selectedDealerName],selectedDealer:event.target.value})
        }
        generateCSV(event)


    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };
    const handleUpload = async (e) => {
        setUploaded(false)
        setState({ data: '', isLoading: true, success: '', csv: '' })

        e.preventDefault()
        if (file) {
            const formData = new FormData();
            formData.append('file', file, "order.xlsx");

            const response = await fetch('api/product/uploadorder', {
                method: 'POST',
                body: formData,
            })
            let json = await response.json()
            if (json.success) {
                setState({ success: json.success, uncategorizedArr: json.segArr, isLoading: false })
                setUploaded(true)
            }

            else {
                setState({ success: json.success, message: json.error })
            }
        }
    };

    const [showEditModel, setShowEditModel] = useState(false);



    const handleEditClick = (e) => {
        e.preventDefault()
        setShowEditModel(true);
    };

    const handleCOnfirmEdit = () => {
        setreportReady(false)
        setCSVGenerating(false)
        setShowEditModel(false);

    };
    useEffect(() => {


    }, [])
    if (state.isLoading) {
        return null
    }
    return (
        <>
            <div className='search-dates'>
                <div className='orderReport'>
                    <form >
                        <label>Order list</label>
                        <input className='date-input ' onChange={handleFileChange} name='fileupload' type='file' required /> <br />


                        <button type="submit" className="btn btn-outline-success search-btn" disabled={uploaded} onClick={(e) => {
                            handleUpload(e)
                        }}
                        >
                            Upload</button>

                        {uploaded ? (<button className="btn btn-outline-danger search-btn order-report-edit-button" onClick={(e) => {
                            handleEditClick(e);
                        }}
                        >
                            Edit</button>) : null

                        }

                        {uploaded ? (<button className="btn btn-outline-success search-btn" onClick={(e) => {
                            handleGenerateReport(e);
                        }}
                        >
                            Generate Report</button>) : null}

                    </form>
                </div>

            </div>
            {(() => {
                if (state.isLoading || reportGenerating ) {
                    return (
                        <Loader />
                    )
                }

                if (reportReady) {
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

            {csvGenerating ? (<div>
                <button type="submit" className={`btn btn-outline-success search-btn`} onClick={(e) => {
                    handleDownload(e)
                }}
                >
                    Download Report-{selectedDealerData.selectedDealer}</button>
            </div>) : null
            }


            {showEditModel &&
                (
                    <EditOrderReport
                        alert={props.alert}
                        showAlert={props.showAlert}
                        orders={state.uncategorizedArr}
                        onConfirm={handleCOnfirmEdit}
                    />
                )}

        </>

    )
}


