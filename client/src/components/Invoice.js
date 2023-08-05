
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InvoiceItem } from './invoiceitem';
import Cookies from 'js-cookie';
import { Accordion } from './Accordion';

export function Invoice(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false })
    let count=0
    useEffect((e) => {
        const getallinvoice = async (e) => {
            const response = await fetch(`api/invoice/fetchallinvoices`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': Cookies.get("auth-token")
                },
            })
            let json = await response.json()
            setState({ data: json, isLoading: false, success: json.success })
        };
        getallinvoice(e)
        console.log(state);
    }, [])
    if (state.isLoading) {
        return null;
    }
    return (
        <>
            <Link to="/createinvoice">
                <button className='btn btn-outline-success search-btn generate-invoice-btn'>Create Invoice</button>
            </Link>
            <Link to="/createestimate">
                <button className='btn btn-outline-success search-btn generate-estimate-btn'>Create Estimate</button>
            </Link>
            <div class="accordion" id="accordionExample">

                { 
                    state.data.map((element) => {
                        return <Accordion count={count++} key={element._id} item={element}
                        />

                    })}
            </div>
            {/* <div class="accordion" id="accordionExample">
                <InvoiceItem data={state} />
            </div> */}
        </>

    )
}


