import React from 'react'
import Cookies from 'js-cookie';
import { InvoiceItem } from './invoiceitem';
export const Accordion = (props) => {
    return (
            <InvoiceItem  count={props.count} item={props.item} invoiceType={props.invoiceType}/>

    )
}
