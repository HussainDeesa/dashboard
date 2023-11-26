import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { SearchResult } from "./SearchResult";
import { Alert } from "./Alert";
import { CustomerSearchResult } from "./CustomerSearchResult";
import { Loader } from "./Loader";

export function SearchByPayment(props) {
  const [record, setRecord] = useState({ payment: "all" });
  const [state, setState] = useState({
    data: {},
    isLoading: false,
    success: "",
  });

  const getByPayment = async (paymentStatus, e) => {
    setState({ data: {}, isLoading: true, success: "" });
    e.preventDefault();
    const response = await fetch(
      `api/order/fetchorderbypaymentstatus/${paymentStatus}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": Cookies.get("auth-token"),
        },
      }
    );
    let json = await response.json();
    if (!json.success) {
      props.showAlert(json.error, 3000);
    }
    setState({ data: json.data, isLoading: false, success: json.success });
  };

  const handleOnChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };
  const handleReload = (e) => {
    getByPayment(record.payment, e);
  };
  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="search-tracking">
        <h4> 'Payment Status </h4>
        <form>
          <input
            defaultChecked
            type="radio"
            value={"all"}
            name="payment"
            onChange={handleOnChange}
          ></input>
          <label style={{ marginLeft: "5px" }}>All</label>
          <br />
          <input
            type="radio"
            value={"paid"}
            name="payment"
            onChange={handleOnChange}
          ></input>
          <label style={{ marginLeft: "5px" }}>Paid</label>
          <br />
          <input
            type="radio"
            value={"unpaid"}
            name="payment"
            onChange={handleOnChange}
          ></input>
          <label style={{ marginLeft: "5px" }}>Unpaid</label>
          <br />
          <button
            type="submit"
            className="btn btn-outline-success search-btn"
            onClick={(e) => {
              getByPayment(record.payment, e);
            }}
          >
            Search
          </button>
        </form>
      </div>
      {(() => {
        if (state.isLoading) {
          return <Loader />;
        } else if (state.success) {
          return (
            <CustomerSearchResult
              reload={handleReload}
              alert={props.alert}
              data={state.data}
            />
          );
        }
      })()}
      <Alert alert={props.alert} />
    </>
  );
}
