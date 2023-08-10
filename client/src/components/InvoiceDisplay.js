import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InvoiceItem } from './invoiceitem';
import Cookies from 'js-cookie';
import { Accordion } from './Accordion';

export function InvoiceDisplay(props) {

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
    }, [])
    if (state.isLoading) {
        return null;
    }
    return (
        <>

            <div class="accordion" id="accordionExample">

                { 
                    state.data.map((element) => {
                        return <Accordion count={count++} key={element._id} invoiceType={"Invoice No."} item={element}
                        />

                    })}
            </div>

        </>

    )
}


