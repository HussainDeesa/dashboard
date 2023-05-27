import React, { useState, useContext, useEffect } from 'react';
import { TableItem } from './TableItem';
import {DeleteConfirmation} from './DeleteConfirmtion'
import recordContext from "../context/recordContext";
export function Records(props) {

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const context = useContext(recordContext);
    // const { getallorders, orders } = context;
    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleConfirmDelete = () => {
        // Perform the delete action here
        setShowDeleteConfirmation(false);
    };


    let json
    const [state, setState] = useState({ data: {}, isLoading: true })
    useEffect(() => {
        const getallorders = async () => {
            const response = await fetch(`api/order/fetchallorders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            json = await response.json()
            setState({ data: json, isLoading: false })

        };
        // getpreviousorder()
        getallorders();
        // setState({data:orders,isLoading:false})
        // eslint-disable-next-line
    }, [props.added])

    if (state.isLoading) {
        return null;
    }
    return (
        <div>
            <div >
                <h3 className='allrecords-heading'>All Records</h3>
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
                                return <TableItem key={element._id} item={element}
                                    handleDeleteClick={handleDeleteClick} />

                            })}
                        </tbody>
                    </table>
                    {showDeleteConfirmation && (
                        <DeleteConfirmation
                            onCancel={handleCancelDelete}
                            onConfirm={handleConfirmDelete}
                        />
                    )}
                </div>
            </div>
        </div>

    )
}


