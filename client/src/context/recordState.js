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

   const deleteInvoice = async (id) => {
      const response = await fetch(`api/invoice/deleteinvoice/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")
         },

      });
      
   }
   const countRecord = async (location) => {
      const response = await fetch(`api/order/gettodaycount`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")
         },
         body: JSON.stringify({ location:location })


      });
      const json = await response.json()
   
      // let count=json.count
      return json.count
   }

   const editRecord = async (id, orderid, trackingid, post, date, status,location) => {
      // API Call
      const response = await fetch(`api/order/updateorder/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

         },
         body: JSON.stringify({ orderid, trackingid, post, date, status,location })

      });
      const json = response.json()
      let newOrder = JSON.parse(JSON.stringify(orders))
      for (let index = 0; index < newOrder.length; index++) {
         const element = newOrder[index];
         if (element._id === id) {
            newOrder[index].orderID = orderid;
            newOrder[index].trackingID = trackingid;
            newOrder[index].post = post;
            newOrder[index].date = date;
            newOrder[index].status = status;
            newOrder[index].location = location;
            break;
         }
      }
      setOrders(newOrder)
   }
   const editInvoice = async (id, invoiceDetails, products) => {
      // API Call
      const response = await fetch(`api/invoice/editInvoice/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

         },
         body: JSON.stringify({ editedInvoiceDetails:invoiceDetails,editedProducts:products })

      });
      const json = response.json()
   }
   const editEstimate = async (id, invoiceDetails, products) => {
      // API Call
      const response = await fetch(`api/estimate/editestimate/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'auth-token':Cookies.get("auth-token")

         },
         body: JSON.stringify({ editedEstimateDetails:invoiceDetails,editedProducts:products })

      });
      const json = response.json()
   }
   const [availableProducts, setAvailableProducts] = useState({ data: {}, isLoading: true, success: false, message:'' })

   const getallproducts = async (e) => {
      const response = await fetch(`api/product/fetchallproducts`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'auth-token': Cookies.get("auth-token")
          },
      })
      let json = await response.json()
      setAvailableProducts({ data: json, isLoading: false, success: json.success })
  };

   return (
      <recordcontext.Provider value={{ orders, deleteRecord, editRecord, getallorders,countRecord,count,deleteInvoice,editInvoice,editEstimate,getallproducts,availableProducts }}>
         {props.children}
      </recordcontext.Provider>
   )
}

export default RecordState;