import React, { useState, useContext } from 'react';
import recordContext from "../context/recordContext";
import { TrackList } from './TrackList';
export function Tracking({ onCancel, onConfirm, id, order,alert,showAlert,track }) {
    const context = useContext(recordContext);


    return (
        <div className='tracking-details'> 
        <div className="delete-confirmation">
            <div className="delete-confirmation-dialog">
                <h3>Tracking Details</h3>
                    {/* <div className='track-box'>
                    <b>Tracking Id:</b> {track.data.trackings[0].tracker.trackingNumber} <br/>
                   <b>Current Status: </b> {track.data.trackings[0].shipment.statusMilestone}
                   <br/>
                   <div className='track-events'>
                   {(track.data.trackings[0].events).map((e)=>{
                        let date = new Date(e.datetime);
                         let formattedDate
                          formattedDate = date.toLocaleDateString("en-US", {
                           day: "2-digit",
                           month: "2-digit",
                           year: "numeric",
                         });
                        return <TrackList time={formattedDate} status={e.status}/>
                        
                   })}
                   </div>
                   </div> */}
                   <div className='track-box'>
                    Sorry, Tracking is not available at the moment!
                   </div>
                    <div className="buttons">
                        <button className='btn btn-outline-success' onClick={onCancel}>Close</button>
              
                    </div>
               
            </div>
        
        </div>
        </div>
    );
};

export default Tracking;
