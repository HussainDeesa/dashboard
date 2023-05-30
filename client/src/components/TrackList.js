import React, { useState, useContext, useEffect } from 'react';

export function TrackList(props) {

    console.log(props.time);

    return (

        <div >
      
            {props.time} <span>:</span> {props.status}
        </div>
    )
}


