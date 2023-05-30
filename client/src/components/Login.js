import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Alert } from './Alert';

export const Login = (props) => {

    let navigate = useNavigate();
    const { setprogress, showAlert, alert } = props

    const [cred, setCred] = useState({ username: '', password: '' })
    const login = async (e) => {

        e.preventDefault()
        const response = await fetch(`api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                

            },
            body: JSON.stringify({ name: cred.username, password: cred.password })

        })
        let json = await response.json();
        if(!json.success){
            props.showAlert("Invalid Crediantials",3000)
            setCred({username:'',password:''})
        }
        if (json.success) {
            Cookies.set('auth-token', json.authtoken, { expires: 1 })
            navigate('/')

        }


    }
    const handleOnChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        login(e);
    }
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
                                <span>Bookstore</span>
                                <span>Dashboard</span>
                            </h1>
                        </div>
                    </div>

                </header>
                <div className="app-body">
                    <div className="app-body-navigation">
                        <nav className="navigation">
                            <Link to="#">
                                <i className="ph-browsers"></i>
                                <span></span>
                            </Link>
                            <Link to="#">
                                <i className="ph-check-square"></i>
                                <span></span>
                            </Link>

                        </nav>
                    </div>
                    <div className="app-body-main-content">
                        <section className="service-section">
                            <div className='dashboard'></div>
                            <h3>Login</h3>
                            <form className='addrecord-form' onSubmit={(e) => {
                                handleSubmit(e)
                            }}>
                                <label className='search-label'>User ID : </label>
                                <input required id='order-input' className='order-input' value={cred.username} name='username' onChange={handleOnChange} type='text' />
                                <br />
                                <label className='search-label'>Password : </label>
                                <input required className='tracking-input' name='password' value={cred.password} onChange={handleOnChange} type='password' />
                                <br />
                                <button type="submit" className="btn btn-outline-success search-btn" onClick={(e) => {
                                    handleSubmit(e)
                                }} >Login</button>
                            </form>

                            <div>

                            </div>
                            <Alert alert={props.alert}/>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}
