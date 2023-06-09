import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchByTrackingID } from './SearchByTrackingID';
import { SearchByOrderID } from './SearchByOrderID';
export function Search(props) {
 

    return (
        <div>
           
            <div className="search-header-navigation">

                <div className="search-tabs">
                    <Link to="/searchbyorderID">
                        Search by Order ID
                    </Link>
                    <Link to="/searchbytrackingID" >
                        {/* <a href="#" className="active"> */}
                        Search by Tracking ID
                    </Link>
                    </div>
                    </div>
                    {(() => {
                        if (props.searchpage == "searchbytrackingID") {
                           
                            return (
                                <SearchByTrackingID  alert={props.alert} showAlert={props.showAlert} />
                            )
                        }
                        if (props.searchpage == "searchbyorderID") {
                            
                            return (
                                <SearchByOrderID  alert={props.alert} showAlert={props.showAlert} />
                            )
                        }
                    })()}



               
            
        </div>
    )
}


