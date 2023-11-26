import React, { useContext, useEffect, useRef, useState } from 'react'
import { Search } from './Search'
import { Addrecord } from './Addrecord'
import { Link,useNavigate } from "react-router-dom";
import { Records } from './Records';
import { CSV } from './CSV';
import { Report } from './Report';
import MobileMenu from './MobileMenu';
import Cookies from 'js-cookie';
import { Payment } from './Payment';

export const Dashboard = (props) => {
	let navigate = useNavigate();
	
    const {setprogress,showAlert,alert}=props
	useEffect(() => {
		if(Cookies.get("auth-token")===undefined){
			navigate('/login')
		}
	}, [])
	
    return (
        <>
            <div className="app">
	<header className="app-header">
		<div className="app-header-logo">
			<div className="logo">
				<span className="logo-icon">
					<img src="https://assets.codepen.io/285131/almeria-logo.svg" />
				</span>
				<h1 className="logo-title">
					<span>MyBooksFactory</span>
					<span>Dashboard</span>
				</h1>
			</div>
		</div>
		<div className="app-header-navigation">
			<div className="tabs">
			
				<Link to="/csv" >
					CSV
				</Link>
				<Link to="/report" >
					Report
				</Link>
				<Link to="/search">
					Search
				</Link>
				<Link to="/payment">
					Payment
				</Link>
				<a href="#">
					
				</a>
				<a href="#">
					
				</a>
			</div>
		</div>
		<div className="app-header-actions">
			<button className="user-profile">
				<span>Admin</span>
				<span>
					<img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" />
				</span>
			</button>
			
		</div>
		<div className="app-header-mobile">
			<button className="icon-button large">
				<i className="ph-list"></i>
				<MobileMenu dash={"posdashboard"}/>
			</button>
		</div>

	</header>
	<div className="app-body">
		<div className="app-body-navigation">
			<nav className="navigation">
				<Link to="/">
					<i className="ph-browsers"></i>
					<span>Dashboard</span>
				</Link>
				<Link to="/addrecord">
					<i className="ph-check-square"></i>
					<span>Add Record</span>
				</Link>
				<Link to="/allrecords">
				<i className="ph-check-square"></i>
					Records
				</Link>
				<Link to="/posdashboard">
				<button className='btn btn-outline-success search-btn switch-order'>Switch to POS</button>	
				</Link>

				
			</nav>
		</div>
		<div className="app-body-main-content">
			<section className="service-section">
				<div className='dashboard'></div>
		
				
				 <div>
      {(() => {
        if (props.page=="Search") {
			
			return (
				<Search  alert={alert} showAlert={props.showAlert} searchpage={props.searchPage}/>
			)
        } 
        if (props.page=="Payment") {
			
			return (
				<Payment  alert={alert} showAlert={props.showAlert} searchpage={props.searchPage}/>
			)
        } 
        if (props.page=="Addrecord") {
			return (
				<Addrecord alert={alert} showAlert={props.showAlert}/>
			)
        } 
        if (props.page=="allrecords") {
			return (
				<Records alert={alert} showAlert={props.showAlert}/>
			)
        } 
        if (props.page=="csv") {
			return (
				<CSV alert={alert} showAlert={props.showAlert}/>
			)
        } 
        if (props.page=="report") {
			return (
				<Report alert={alert} showAlert={props.showAlert}/>
			)
        } 
      })()}
    </div>
			</section>
	</div>
</div>
</div>
        </>
    )
}
