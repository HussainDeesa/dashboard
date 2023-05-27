import React, { useState } from "react";
import recordcontext from "./recordContext";

const RecordState = (props) => {

   // const host = 'http://localhost:5000/'
   const recordsInitial = []
   const [orders, setOrders] = useState(recordsInitial)

   const getallorders = async () => {
      // API Call
      // const response = await fetch(`${host}api/notes/fetchallnotes`, {
      const response = await fetch('api/order/fetchallorders', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         }
      });
      const json = await response.json()
      setOrders(json)

   }

   // ADD note
   // const addNote = async (orderid, trackingid, post) => {

   //    // API Call
   //    // const response = await fetch(`${host}api/notes/addnote`, {
   //    const response = await fetch('api/notes/addnote', {
   //       method: 'POST',
   //       headers: {
   //          'Content-Type': 'application/json',
   //          'auth-token': localStorage.getItem('token')
   //       },
   //       body: JSON.stringify({orderid, trackingid, post})
   //    });
   //    const note = await response.json()
   //    setNotes(notes.concat(note))
   // }

   // DELETE note
   const deleteRecord = async (id) => {
      // API Call
      const response = await fetch(`api/order/deleteorder/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },

      });
      const json = await response.json()

      const newOrder = orders.filter((order) => { return order._id !== id })
      setOrders(newOrder)
   }

   const editRecord = async (id, orderid, trackingid, post, date, status) => {
      // API Call
      const response = await fetch(`api/order/updateorder/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ orderid, trackingid, post, date, status })

      });
      const json = response.json()
      let newOrder = JSON.parse(JSON.stringify(orders))
      console.log(newOrder);
      for (let index = 0; index < newOrder.length; index++) {
         const element = newOrder[index];
         if (element._id === id) {
            newOrder[index].orderID = orderid;
            newOrder[index].trackingID = trackingid;
            newOrder[index].post = post;
            newOrder[index].date = date;
            newOrder[index].status = status;
            break;
         }
      }
      setOrders(newOrder)
   }

   return (
      <recordcontext.Provider value={{ orders, deleteRecord, editRecord, getallorders }}>
         {props.children}
      </recordcontext.Provider>
   )
}

export default RecordState;