import React, { useState, useContext, useEffect, useRef } from "react";
import { PreviousOrder } from "./Previousorder";
import { Alert } from "./Alert";
import recordContext from "../context/recordContext";
import Cookies from "js-cookie";
export function Addrecord(props) {
  const orderInputRef = useRef(null);
  const trackingInputRef = useRef(null);

  const context = useContext(recordContext);
  const { countRecord } = context;
  const [added, setadded] = useState(false);
  const [count, setCount] = useState();
  const [location, setlocation] = useState()
  const [payment, setPayment] = useState()
  // console.log(new Date());
  // const today = new Date().toISOString().split('T')[0]

  const currentDate = new Date();
  const utcOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(currentDate.getTime() + utcOffset);
  const today = istDate.toISOString().split("T")[0];
  //   console.log(today);
  const [record, setRecord] = useState({
    orderid: "",
    trackingid: "",
    date: today,
    post: "India Post",
    status: 1,
    skip_check: false,
    count: "",
  });
  const fetchCount = async (location) => {
    const count = await countRecord(location);
    setCount(count);
  };
  const addRecord = async (e) => {
    e.preventDefault();
    const response = await fetch(`api/order/addorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": Cookies.get("auth-token"),
      },
      body: JSON.stringify({
        orderid: record.orderid,
        trackingid: String(record.trackingid),
        post: record.post,
        date: record.date,
        status: record.status,
        location:location,
        payment:payment,
        skip_check: false,  
      }),
    });
    let json = await response.json();
    setadded(added == false ? true : false);
    if (!json.success) {
      props.showAlert(json.error, 7000);
    }
    if (json.success) {
      setRecord({
        orderid: "",
        trackingid: "",
        date: today,
        post: "India Post",
        status: 1,
        count: json.count,
      });
      fetchCount(location);
    }
    orderInputRef.current.focus();
  };
  const handleSubmit = (e) => {
    addRecord(e);
  };
  const handleOnChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    if (name === "orderid" && value.length === 6) {
      trackingInputRef.current.focus();
    }
  };
  const handleOnChangeLocation = (e) => {
    fetchCount(e.target.value);
    Cookies.set('location', e.target.value)
    setlocation(e.target.value)
  };
  const handleOnChangePayment = (e) => {
    Cookies.set('payment', e.target.value)
    setRecord({ ...record, [e.target.name]: e.target.value });
    setPayment(e.target.value)
  };
  useEffect(() => {
    if (Cookies.get('location') != undefined) {
      setlocation(Cookies.get('location'))
    }
    if (Cookies.get('payment') != undefined) {
      setPayment(Cookies.get('payment'))
    }
    orderInputRef.current.focus();
    fetchCount(location);
  }, []);

  return (
    <>
      <div>
        <select className="records-added location-option"
          name="location"
          onChange={handleOnChangeLocation}
          value={location}
        >
          <option value="">Select</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi</option>
        </select>
        <h3 className="records-added">Records Added : {count}</h3>
        <h3> Add Order Details </h3>
        <form
          className="addrecord-form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <label className="search-label">Order ID : </label>
          <input
            required
            id="order-input"
            ref={orderInputRef}
            className="order-input"
            value={record.orderid}
            name="orderid"
            onChange={handleOnChange}
            type="text"
          />
          <br />
          <label className="search-label">Tracking ID : </label>
          <input
            required
            className="tracking-input"
            name="trackingid"
            ref={trackingInputRef}
            value={record.trackingid}
            onChange={handleOnChange}
            type="text"
          />
          <br /> <label className="search-label">Post : </label>
          <select
            required
            className="post-input"
            name="post"
            onChange={handleOnChange}
            value={record.post}
            id="post"
          >
            <option value="India Post">India Post</option>
            <option value="Professional">Professional</option>
            <option value="UPS">UPS</option>
          </select>
          <br /> <label className="search-label">Date : </label>
          <input
            required
            className="date-input"
            onChange={handleOnChange}
            value={record.date}
            name="date"
            type="date"
          />

          <br /> <label className="search-label">Location : </label>
          <select
            required
            className="location-input"
            onChange={handleOnChangeLocation}
            value={location}
            name="location"
          >
            <option value="">Select</option>
            <option value="Chennai">Chennai</option>
            <option value="Delhi">Delhi</option>
          </select>
          <br /> <label className="search-label">Payment: </label>
          <select
            required
            className="location-input"
            style={{marginLeft:"20px"}}
            onChange={handleOnChangePayment}
            value={payment}
            name="payment"
          >
            <option value="">Select</option>
            <option value="Prepaid">Prepaid</option>
            <option value="COD">COD</option>
          </select>
          <br /> <label className="search-label">Status : </label>
          <input
            required
            className="status-input"
            name="status"
            onChange={handleOnChange}
            readOnly
            value={record.status}
            type="text"
          />
          <br />
          <button
            type="submit"
            className="btn btn-outline-success search-btn"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Add Record
          </button>
        </form>
      </div>
      <Alert state={record} alert={props.alert} />
      <PreviousOrder added={added} />
    </>
  );
}
