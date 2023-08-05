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
//   console.log(record);
  const fetchCount = async () => {
    const count = await countRecord();
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
        skip_check: false,
      }),
    });
    let json = await response.json();
    setadded(added == false ? true : false);
    // setadded(true)
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
      fetchCount();
    }
    orderInputRef.current.focus();
  };
  const handleSubmit = (e) => {
    addRecord(e);
  };
  const handleOnChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    if (name === "orderid" && value.length === 5) {
      trackingInputRef.current.focus();
    }
  };
  useEffect(() => {
    orderInputRef.current.focus();
    fetchCount();
  }, []);

  return (
    <>
      <div>
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
          <br />
          <label className="search-label">Status : </label>
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
