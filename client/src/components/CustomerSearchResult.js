import React, { useState, useContext, useEffect } from "react";
import { CustomerSearchTableItem } from "./CustomerSearchTableItem";

export function CustomerSearchResult(props) {
  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return (
    <div className="table-box-outer">
      <div className="table-box">
        <table className="table" id="table">
          <thead>
            <tr>
              <th scope="col">OrderID</th>
              <th scope="col">Date</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Payment</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {props.data.map((element) => {
              return <CustomerSearchTableItem reload={props.reload} key={element._id} item={element} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
