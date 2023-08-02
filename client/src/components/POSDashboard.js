import React, { useContext, useEffect, useRef, useState } from 'react'
import { Search } from './Search'
import { Addrecord } from './Addrecord'
import { Link,useNavigate } from "react-router-dom";
import { Records } from './Records';
import { CSV } from './CSV';
import { Report } from './Report';
import MobileMenu from './MobileMenu';
import Cookies from 'js-cookie';
import { Stock } from './Stock';
import { Invoice } from './Invoice';
import POSMobileMenu from './POSMobileMenu';
import { CreateInvoice } from './Createinvoice';

export const POSDashboard = (props) => {
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
					<span>POSDashboard</span>
				</h1>
			</div>
		</div>
		<div className="app-header-navigation">
			<div className="tabs">
			
				<Link to="/stock" >
					Stock
				</Link>
				<Link to="/invoice" >
					Invoice
				</Link>
				<Link to="">
					{/* Search */}
				</Link>
				<a href="#">
					
				</a>
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
				<POSMobileMenu dash={"dashboard"}/>
			</button>
		</div>

	</header>
	<div className="app-body">
		<div className="app-body-navigation">
			<nav className="navigation">
				<Link to="/stock">
					<i className="ph-browsers"></i>
					<span>Stock</span>
				</Link>
				<Link to="/invoice">
					<i className="ph-check-square"></i>
					<span>Invoice</span>
				</Link>
				{/* <Link to="/allrecords">
				<i className="ph-check-square"></i>
					Records
				</Link> */}
				<Link to="/">
				<button className='btn btn-outline-success search-btn switch-order'>Switch to Order</button>	
				</Link>

				
			</nav>
		</div>
		<div className="app-body-main-content">
			<section >
				<div className='dashboard'></div>
		
				
				 <div>
      {(() => {
        if (props.page=="stock") {
			
			return (
				<Stock  alert={alert} showAlert={props.showAlert} />
			)
        } 
        if (props.page=="invoice") {
			return (
				<Invoice alert={alert} showAlert={props.showAlert}/>
			)
        }
		if (props.page=="createinvoice") {
			return (
				<CreateInvoice alert={alert} showAlert={props.showAlert}/>
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
