import React, { useState } from "react";
import recordcontext from "./recordContext";
import Cookies from 'js-cookie';
const RecordState = (props) => {

   // const host = 'http://localhost:5000/'
   const recordsInitial = []
   const [orders, setOrders] = useState(recordsInitial)
   const [count, setCount] = useState('')

   const getallorders = async () => {
      // API Call
      // const response = await fetch(`${host}api/notes/fetchallnotes`, {
      const response = await fetch('api/order/fetchallorders', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

         }
      });
      const json = await response.json()
      setOrders(json)

   }

   const deleteRecord = async (id) => {
      // API Call
      const response = await fetch(`api/order/deleteorder/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

         },

      });
      const json = await response.json()

      const newOrder = orders.filter((order) => { return order._id !== id })
      setOrders(newOrder)
   }
   const countRecord = async (id) => {
      // API Call
      const response = await fetch(`api/order/gettodaycount`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

         },

      });
      const json = await response.json()
   
      // let count=json.count
      return json.count
   }

   const editRecord = async (id, orderid, trackingid, post, date, status) => {
      // API Call
      const response = await fetch(`api/order/updateorder/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

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
      <recordcontext.Provider value={{ orders, deleteRecord, editRecord, getallorders,countRecord,count }}>
         {props.children}
      </recordcontext.Provider>
   )
}

export default RecordState;