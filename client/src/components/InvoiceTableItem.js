import React, { useState, useContext, useEffect } from "react";
import recordContext from "../context/recordContext";
import { DeleteConfirmation } from "./DeleteConfirmtion";
import EditRecord from "./EditRecord";
export function InvoiceTableItem(props) {
  const { item } = props;

  return (
    <>
      <tr>
        <td scope="row">{item.productCode}</td>
        <td>{item.author}</td>
        <td>{item.productName}</td>
        <td>{item.quantity}</td>
        <td>{item.price}</td>
        <td>{item.discount}</td>
        <td>{((item.quantity*item.price)-(item.discount/100)*item.price*item.quantity).toFixed(0)}</td>
      </tr>


    </>
  );
}
