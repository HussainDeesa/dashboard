
import React, { useState, useContext, useEffect } from 'react';

import { TableItem } from './TableItem';


export function SearchResult(props) {
    
    useEffect(() => {
      
        // eslint-disable-next-line
    }, [])
   
    return (
        
            <div className='table-box-outer'>
                <div className='table-box'>
                    <table className="table" id='table'>
                        <thead>
                            <tr>
                                <th scope="col">OrderID</th>
                                <th scope="col">TrackingID</th>
                                <th scope="col">POST</th>
                                <th scope="col">Date</th>
                                <th scope="col">Status</th>
                                <th scope='col'>Action</th>
                            </tr>
                        </thead>
                       
                        <tbody>

                        {props.data.map((element) => {
                                return <TableItem key={element._id} item={element}
                                  />

                            })}
                            {/* <TableItem key={props.data._id} alert={props.alert} showAlert={props.showAlert} item={props.data}/> */}
    
                        </tbody>
                    </table>

                </div>
             </div>               
    )
}


