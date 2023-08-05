import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React from 'react';
import { Link,useNavigate } from "react-router-dom";

import { Dashboard } from './components/Dashboard';
import { POSDashboard } from './components/POSDashboard';
import RecordState from './context/recordState';
import { useState } from 'react';
import { Login } from './components/Login';
import { CreateEstimate } from './components/Createestimate';
import { CreateInvoicePC } from './components/CreateInvoicePC';
import { CreateEstimatePC } from './components/CreateEstimatePc';

function App() {
  const [alert, setAlert] = useState(null)
  const showAlert = (message,time) => {
    setAlert({
      message: message,
      class: 'alert-danger'
    })
    setTimeout(() => {
      setAlert({
        message: "",
        class: ''
      })
    }, time);
  }
  // const [progress, setprogress] = useState(0)
  // const setProgress=(progress)=>{
  //   setprogress(progress)
  // }
  return (
    <RecordState>
      <BrowserRouter>
        {/* <Dashboard /> */}
        {/* <div className='container'> */}
          {/* <LoadingBar
          color='#ff9400'
          progress={progress}
        /> */}
          <Routes>
            <Route exact path="/login" element={<Login alert={alert} showAlert={showAlert} />} />
            <Route exact path="/" element={<Dashboard showAlert={showAlert} />} />
            <Route exact path="/allrecords" element={<Dashboard page={"allrecords"} showAlert={showAlert} />} />
            <Route exact path="/dashboard" element={<Dashboard alert={alert} showAlert={showAlert} />} />
            <Route exact path="/search" element={<Dashboard alert={alert} showAlert={showAlert} page={"Search"} />} />
            <Route exact path="/addrecord" element={<Dashboard showAlert={showAlert} alert={alert} page={"Addrecord"} />} />
            <Route exact path="/searchbyorderID" element={<Dashboard alert={alert} showAlert={showAlert} page={"Search"} searchPage={"searchbyorderID"} />} />
            <Route exact path="/searchbytrackingID" element={<Dashboard showAlert={showAlert} alert={alert} page={"Search"} searchPage={"searchbytrackingID"} />} />
            <Route exact path="/csv" element={<Dashboard showAlert={showAlert} alert={alert} page={"csv"} />} />
            <Route exact path="/report" element={<Dashboard showAlert={showAlert} alert={alert} page={"report"} />} />
            <Route exact path="/posdashboard" element={<POSDashboard showAlert={showAlert} alert={alert} />} />
            <Route exact path="/stock" element={<POSDashboard showAlert={showAlert} alert={alert} page={"stock"}  />} />
            <Route exact path="/invoice" element={<POSDashboard showAlert={showAlert} alert={alert} page={"invoice"}  />} />
            {/* <Route exact path="/createinvoice" element={<POSDashboard showAlert={showAlert} alert={alert} page={"createinvoice"}  />} />
            <Route exact path="/createestimate" element={<POSDashboard showAlert={showAlert} alert={alert} page={"createestimate"}  />} /> */}


            {window.innerWidth <= 1000 ? (
            <Route exact path="/createinvoice" element={<POSDashboard showAlert={showAlert} alert={alert} page={"createinvoice"} />} />
          ) : (
            <Route exact path="/createinvoice" element={<CreateInvoicePC showAlert={showAlert} alert={alert} page={"createinvoice"} />} />
          )}
          
          {window.innerWidth <= 1000 ? (
            <Route exact path="/createestimate" element={<POSDashboard showAlert={showAlert} alert={alert} page={"createestimate"} />} />
          ) : (
            <Route exact path="/createestimate" element={<CreateEstimatePC showAlert={showAlert} alert={alert} page={"createestimate"} />} />
          )}

          </Routes>  
        {/* </div> */}
      </BrowserRouter>
    </RecordState>
  );
}

export default App;
