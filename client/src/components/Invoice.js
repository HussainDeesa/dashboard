
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from './Alert';
import { CsvResult } from './CsvResult';
import Cookies from 'js-cookie';
export function Invoice(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false,csv:'' })

    const [record, setRecord] = useState({ startDate: '', endDate: '' })
    let json;

    return (
        <>
           <Link to="/createinvoice">
				<button className='btn btn-outline-success search-btn'>Create Invoice</button>	
			</Link>
        </>

    )
}


