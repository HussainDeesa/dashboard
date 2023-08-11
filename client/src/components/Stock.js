
import React, { useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ProductTableItem } from './ProductTableItem';
import recordContext from "../context/recordContext";

export function Stock(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false, message:'' })
    // const [availableProducts, setAvailableProducts] = useState()
    const [file, setFile] = useState()
    let json;
    const context = useContext(recordContext);
    const { getallproducts, availableProducts } = context;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };
    const handleUpload = async (e) => {
        e.preventDefault()
        if (file) {
            const formData = new FormData();
            formData.append('file', file, "products.csv");
 
            const response = await fetch('api/product/upload', {
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
    useEffect((e) => {
        // const getallproducts = async (e) => {
        //     const response = await fetch(`api/product/fetchallproducts`, {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'auth-token': Cookies.get("auth-token")
        //         },
        //     })
        //     let json = await response.json()
        //     console.log(json);
        //     setState({ data: json, isLoading: false, success: json.success })
        // };
        getallproducts()
        }, [])
    if (availableProducts.isLoading) {
        return null;
    }
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
            <div className='table-box-outer'>
                <div className='table-box product-box'>
                    <table className="table" id='table'>
                        <thead>
                            <tr>
                                <th scope="col">ISBN</th>
                                <th scope="col">Title</th>
                                <th scope="col">Author</th>
                                <th scope="col">Publisher</th>
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                       
                        <tbody> 
                        {availableProducts.data.map((element) => {
                                return <ProductTableItem key={element._id} item={element}
                                  />

                            })}
                            {/* <TableItem key={props.data._id} alert={props.alert} showAlert={props.showAlert} item={props.data}/> */}
    
                        </tbody>
                    </table>

                </div>
             </div>   

        </>

    )
}


