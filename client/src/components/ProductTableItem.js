import React, { useState, useContext, useEffect } from "react";
import recordContext from "../context/recordContext";
import { DeleteConfirmation } from "./DeleteConfirmtion";
import EditRecord from "./EditRecord";
export function ProductTableItem(props) {
  const { item } = props;

  return (
    <>
      <tr>
        <td scope="row">{item.ISBNCode}</td>
        <td>{item.Title}</td>
        <td>{item.Author}</td>
        <td>{item.Publisher}</td>
        <td>{item.Price}</td>
      </tr>


    </>
  );
}
