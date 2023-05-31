import React, { useState, useContext, useEffect } from 'react';

export function TrackList(props) {

    return (

        <div >
      
            {props.time} <span>:</span> {props.status}
        </div>
    )
}


