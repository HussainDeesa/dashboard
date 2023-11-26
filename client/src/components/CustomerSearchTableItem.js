import React, { useState, useContext, useEffect } from "react";
import recordContext from "../context/recordContext";
import { PaymentChangeConfirmation } from "./PaymentChangeConfirmation";
export function CustomerSearchTableItem(props) {
  const context = useContext(recordContext);
  const { changePaymentStatus } = context;
  const { item, reload } = props;
  const [id, setID] = useState("");
  const [type, setType] = useState();
  const [showUpdatePaymentStatusConfirmation, setshowUpdatePaymentStatusConfirmation] = useState(false);

  const handleConfirmStatusChange = (e) => {
    changePaymentStatus(id,type)
    reload(e)
    setshowUpdatePaymentStatusConfirmation(false);
  };

  const handleChangeStatusClick = (e, id, status) => {
    setType(status)
    setID(id);
    setshowUpdatePaymentStatusConfirmation(true);
  };

  const handleCancelStatusChange = () => {
    setshowUpdatePaymentStatusConfirmation(false);
  };
  return (
    <>
      <tr>
        <th scope="row">{item.orderID}</th>
        <td>{item.date}</td>
        <td>{item.customerName}</td>
        <td>{item.payment}</td>
        <td>
          {item.paymentStatus === false ? (
            <span
              style={{
                background: "#FECACA",
                color: "#991B1B",
                borderRadius: "16px",
                padding: "5px 15px 5px 16px",
              }}
            >
              Unpaid
            </span>
          ) : (
            <span
              style={{
                background: "#BBF7D0",
                color: "#166534",
                borderRadius: "16px",
                padding: "5px 15px 5px 16px",
              }}
            >
              Paid
            </span>
          )}
        </td>

        <td>
          {item.paymentStatus === false ? (
            <span>
              <button
                style={{ width: "145px" }}
                className="btn btn-success track"
                onClick={(e) => {
                    handleChangeStatusClick(e, item._id, true);
                }}
              >
                Mark as Paid
              </button>
            </span>
          ) : (
            <span>
              <button
                style={{ width: "145px" }}
                className="btn btn-danger track"
                onClick={(e) => {
                  handleChangeStatusClick(e, item._id, false);
                }}
              >
                Mark as Unpaid
              </button>
            </span>
          )}
        </td>
      </tr>
      {showUpdatePaymentStatusConfirmation && (
        <PaymentChangeConfirmation
          onCancel={handleCancelStatusChange}
          onConfirm={handleConfirmStatusChange}
          type={type === true ? "Paid" : "Unpaid"}
        />
      )}
    </>
  );
}
