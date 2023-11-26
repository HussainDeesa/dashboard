import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Alert } from "./Alert";
import { CustomerSearchResult } from "./CustomerSearchResult";
import { Loader } from "./Loader";
export function Payment(props) {
  const [state, setState] = useState({
    data: {},
    isLoading: false,
    success: false,
    message: "",
  });
  const [record, setRecord] = useState({ customerName: "" });
  const [file, setFile] = useState();
  let json;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };
  const handleUpload = async (e) => {
    setState({ data:'', isLoading: true, success: '' });
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file, "customer.csv");

      const response = await fetch("api/order/updateCustomer", {
        method: "POST",
        body: formData,
      });
      let json = await response.json();
      if (json.success) {
        props.showAlert(json.message, 3000);
        setState({
          success: json.success,
          message: json.message,
          isLoading: false,
        });
      } else {
        setState({
          success: json.success,
          message: json.message,
          isLoading: false,
        });
        props.showAlert(json.error, 3000);
      }
    }
    
  };
  const handleOnChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const getByCustomerName = async (e) => {
    e.preventDefault();
    const response = await fetch(`api/order/fetchorderbycustomer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": Cookies.get("auth-token"),
      },
      body: JSON.stringify({ customerName: record.customerName }),
    });
    let json = await response.json();
    if (!json.success) {
      props.showAlert(json.error, 3000);
    }
    setState({ data: json.data, isLoading: false, success: json.success });
  };
  const customerNameReload = (e) => {
    getByCustomerName(e);
  };

  return (
    <>
      <div className="search-dates">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Customer Data
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse "
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <form
                  onSubmit={(e) => {
                    handleUpload(e);
                  }}
                >
                  <input
                    className="date-input "
                    onChange={handleFileChange}
                    name="fileupload"
                    type="file"
                    required
                  />{" "}
                  <br />
                  <button
                    type="submit"
                    className="btn btn-outline-success search-btn"
                  >
                    Upload
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="search-tracking" style={{ marginTop: "5px" }}>
          <form>
            <label className="search-label">Customer Name : </label>
            <input
              style={{ marginTop: "5px" }}
              required
              className="trackingid-input"
              value={record.customerName}
              name="customerName"
              onChange={handleOnChange}
              type="text"
            />
            <br />
            <button
              type="submit"
              className="btn btn-outline-success search-btn"
              onClick={(e) => {
                getByCustomerName(e);
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {(() => {
        if (state.isLoading) {
          return <Loader />;
        }
        if (state.success) {
          return (
            <CustomerSearchResult
              reload={customerNameReload}
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
