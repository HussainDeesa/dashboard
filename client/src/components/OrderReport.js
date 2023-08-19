
import React, { useState, useContext, useEffect } from 'react';
import { Report1 } from './Report1';
import { OrderReport1 } from './OrderReport1';
export function OrderReport(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false, message: '' })
    const [checkFileState, setcheckFileState] = useState()
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
            formData.append('file', file, "dealer.csv");

            const response = await fetch('api/product/dealerupload', {
                method: 'POST',
                body: formData,
            })
            let json = await response.json()
            if (json.success) {
                props.showAlert(json.message, 3000)
                setState({ success: json.success, message: json.message })
                setcheckFileState(true)
            }
            else {
                setState({ success: json.success, message: json.error })
                props.showAlert(json.error, 3000)
            }
        }
    };
    useEffect(() => {
        const checkFile = async () => {

            const response = await fetch('api/order/checkupload', {
                method: 'POST',
            })
            let json = await response.json()
            setcheckFileState(json.exists)
        };
        checkFile()

    }, [])
    if (checkFileState == undefined) {
        return null
    }
    return (
        <>
            <div className='search-dates'>
              
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Dealer List
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse " data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <form onSubmit={(e) => {
                                    handleUpload(e)
                                }}>
                                    <input className='date-input ' onChange={handleFileChange} name='fileupload' type='file' required/> <br />

                                    <button type="submit" className="btn btn-outline-success search-btn"
                                    >
                                        Upload</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {(() => {
                if (checkFileState === true) {
                    return (
                        <OrderReport1 alert={state.message} />

                    )
                }
           



            })()}
        </>

    )
}


