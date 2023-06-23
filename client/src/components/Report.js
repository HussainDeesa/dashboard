
import React, { useState, useContext, useEffect } from 'react';
import { Report1 } from './Report1';
export function Report(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false, message:'' })
    const [record, setRecord] = useState({ startDate: '', endDate: '' })
    const [file, setFile] = useState()
    let json;


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };
    const handleUpload = async (e) => {
        e.preventDefault()
        if (file) {
            const formData = new FormData();
            formData.append('file', file, "data.csv");

            const response = await fetch('api/order/upload', {
                method: 'POST',
                body: formData,
            })
            let json = await response.json()
            if (json.success) {
                props.showAlert(json.message, 3000)
                setState({ success: json.success,message:json.message })
            }
            else {
                setState({ success: json.success,message:json.error })
                props.showAlert(json.error, 3000)
            }
        }
    };

    return (
        <>
            <div className='search-dates'>

                <form onSubmit={(e) => {
                    handleUpload(e)
                }}>
                    <input className='date-input ' onChange={handleFileChange} name='fileupload' type='file' /> <br />

                    <button type="submit" className="btn btn-outline-success search-btn"
                    >
                        Upload</button>
                </form>
            </div>

            {(() => {
                if (state.success) {

                    return (
                        <Report1 alert={state.message} />

                    )
                }



            })()}
        </>

    )
}


