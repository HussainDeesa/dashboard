import React, { useState, useContext, useEffect } from "react";
import del from "../images/delete.png";
import edit from "../images/edit.png";
import recordContext from "../context/recordContext";
import { DeleteConfirmation } from "./DeleteConfirmtion";
import EditRecord from "./EditRecord";
import Tracking from "./Tracking";
export function InvoiceTableItem(props) {
  const context = useContext(recordContext);
  const { editRecord, deleteRecord } = context;
  const { item } = props;
  const [id, setID] = useState("");
  const [trackDetail,setTrackDetail]=useState()
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
    deleteRecord(id);
    window.location.reload();
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = () => {
    setShowEditModel(true);
  };

  const handelCancelEdit = () => {
    setShowEditModel(false);
  };
  const track =async (e,id)=>{
    e.preventDefault()
      const response=await fetch('api/order/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trackingNumber: id })
      })
        .then(response => response.text())
        .then(data => {
          const parsed_data = JSON.parse(data);
          setTrackDetail(parsed_data)
        })
        .catch(error => {
        });
}
  const handleTrackClick = (e,id) => {
    setShowTrack(true);
    track(e,id);
  };

  const handleCloseTrack = () => {
    setShowTrack(false);
  };

  const handleCOnfirmEdit = () => {};

  return (
    <>
      <tr>
        <th scope="row">{item.productCode}</th>
        <td>{item.author}</td>
        <td>{item.productName}</td>
        <td>{item.quantity}</td>
        <td>{item.price}</td>
        <td>{item.discount}</td>
        <td>{(item.quantity*item.price)-(item.discount/100)*item.price*item.quantity}</td>
      </tr>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showEditModel && (
        <EditRecord
          alert={props.alert}
          showAlert={props.showAlert}
          id={id}
          order={order}
          onCancel={handelCancelEdit}
          onConfirm={handleCOnfirmEdit}
        />
      )}
      {(showTrack && trackDetail)&& (
        <Tracking
          alert={props.alert}
          showAlert={props.showAlert}
          id={id}
          track={trackDetail}
          onCancel={handleCloseTrack}
        />
      )}
    </>
  );
}
