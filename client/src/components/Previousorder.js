import React, { useState, useContext, useEffect } from 'react';
import { TableItem } from './TableItem';
import Cookies from 'js-cookie';
export function PreviousOrder(props) {

    let json
    const [state, setState] = useState({data:{},isLoading:true})
      useEffect(() => {
        const getpreviousorder = async () => {
            const response = await fetch(`api/order/previoustwoorders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                'auth-token':Cookies.get("auth-token")

                },
            })
            json = await response.json()
            setState({data:json, isLoading:false})
        
        };   
        getpreviousorder()
        // eslint-disable-next-line
    }, [props.added])

    if (state.isLoading) {
        return null;
    }
    return (
            
                <div className='table-box'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">OrderID</th>
                                <th scope="col">TrackingID</th>
                                <th scope="col">POST</th>
                                <th scope="col">Date</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                                               <tbody>
                        {state.data.map((element) => {
                           return <TableItem key={element._id} item={element}/>
                           
                             })} 
                        </tbody>
                    </table>
           
        </div>
    )
}


