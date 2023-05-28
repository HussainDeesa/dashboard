import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React from 'react';
import Home from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Search } from './components/Search';
// import Navbar from './components/Navbar';
// import About from './components/About';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Signup from './components/Signup';
// import Order from './components/Order';
// import Cart from './components/Cart';
import RecordState from './context/recordState';
import { useState } from 'react';
import { CSV } from './components/CSV';
import { Login } from './components/Login';
// import LoadingBar from 'react-top-loading-bar'

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
        <div className='container'>
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


          </Routes>
        </div>
      </BrowserRouter>
    </RecordState>
  );
}

export default App;
