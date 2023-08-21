import React, { useState, useContext, useEffect } from 'react';
import { TableItem } from './TableItem';

export function CsvResult(props) {

    useEffect(() => {

    }, [props.added])
   
    const handleDownload = (e) => {
        e.preventDefault();
        const blob = new Blob([props.data.csv], { type: 'text/x-csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${props.record.location}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
 
   
      };
    return (
        <div>
            <div className='download-csv-btn' >

                <button className='btn btn-success' onClick={(e)=>{
                    handleDownload(e)
                }}>
                    {/* <a href='../../../data.csv' download={'records.csv'}>Download CSV</a> */}Download CSV
                </button>
            </div>
            <div >

                <div className='table-box'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">OrderID</th>
                                <th scope="col">TrackingID</th>
                                <th scope="col">POST</th>
                                <th scope="col">Date</th>
                                <th scope="col">Location</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.data.map((element) => {

                                return <TableItem key={element._id} item={element}
                                />

                            })}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>

    )
}


