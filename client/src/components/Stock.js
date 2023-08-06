
import React, { useState, useContext, useEffect } from 'react';
import { Alert } from './Alert';
import { CsvResult } from './CsvResult';
import Cookies from 'js-cookie';
export function Stock(props) {

    const [state, setState] = useState({ data: {}, isLoading: true, success: false,csv:'' })

    const [record, setRecord] = useState({ startDate: '', endDate: '' })
    let json;

    return (
        <>
           Stock
        </>

    )
}


