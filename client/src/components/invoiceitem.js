import React, { useState, useContext, useEffect } from "react";
import del from "../images/delete.png";
import edit from "../images/edit.png";
import download from "../images/download.png";
import recordContext from "../context/recordContext";
import { DeleteConfirmation } from "./DeleteConfirmtion";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { TableItem } from "./TableItem";
import { InvoiceTableItem } from "./InvoiceTableItem";
export function InvoiceItem(props) {
  const context = useContext(recordContext);
  const { deleteInvoice } = context;
  const { item } = props;
  const [id, setID] = useState("");
  const [trackDetail, setTrackDetail] = useState();
  const [order, setOrder] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    deleteInvoice(id);
    window.location.reload();
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = () => {
    setShowEditModel(true);
  };

  const handelCancelEdit = () => {
    setShowEditModel(false);
  };
  const track = async (e, id) => {
    e.preventDefault();
    const response = await fetch("api/order/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackingNumber: id }),
    })
      .then((response) => response.text())
      .then((data) => {
        const parsed_data = JSON.parse(data);
        setTrackDetail(parsed_data);
      })
      .catch((error) => {});
  };
  const handleTrackClick = (e, id) => {
    setShowTrack(true);
    track(e, id);
  };

  const handleCloseTrack = () => {
    setShowTrack(false);
  };

  const handleCOnfirmEdit = () => {};

  return (
    <>
      <div className="invoice-items">
        <div className="accordion-item">
          <h2 className="accordion-header" id={`heading${props.count}`}>
            <div className="accordion-head">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${props.count}`}
                aria-expanded="true"
                aria-controls={`collapse${props.count}`}
              >
                <div className="accordion-invoice-details">
                  <div className="accordion-invoice-number">
                    <b>
                      {props.invoiceType} Number: #{item.invoicenumber}
                    </b>
                  </div>
                  <span>
                    <b>Name: {item.customerName}</b>
                  </span>
                </div>
              </button>
              <img
                src={del}
                onClick={() => {
                  setID(item._id);
                  handleDeleteClick();
                }}
                className="accordion-del-img"
              ></img>
              <img src={edit} className="accordion-edit-img"></img>
              <img src={download} className="accordion-download-img"></img>
            </div>
          </h2>
          <div
            id={`collapse${props.count}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${props.count}`}
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="table-box-outer">
                <div className="table-box">
                  <table className="table" id="table">
                    <thead>
                      <tr>
                        <th scope="col">Product Code</th>
                        <th scope="col">Author Name</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Disc%</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {item.products.map((element) => {
                        return (
                          <InvoiceTableItem key={element._id} item={element} />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
