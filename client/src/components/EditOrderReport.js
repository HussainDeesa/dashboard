import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Loader } from './Loader';

export function EditOrderReport({ onConfirm, orders, }) {

    const [saved, setsaved] = useState(true)
    const [segArrfinal, setsegArrfinal] = useState(orders)
    const handleDealerChange = (index, newDealer) => {
        const updatedSegArr = [...orders];
        updatedSegArr[index].dealer = newDealer;
        setsegArrfinal(updatedSegArr);
    };
    const handleSave = async (e) => {
        setsaved(false)
        e.preventDefault()

        const response = await fetch('api/product/saveorder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": Cookies.get("auth-token"),
            },
            body: JSON.stringify({
                segOrder: segArrfinal
            }),

        })
        let json = await response.json()
        if (json.success) {
            setsaved(true)
            onConfirm()
        }

    };


    return (
        <>

            <div className="delete-confirmation edit-order-report">
                <div className="delete-confirmation-dialog  edit-order-report-dialoge">
                    {!saved ? (
                        <Loader />) : null

                    }
                    <form className="addrecord-form">

                        <div className="product-list-pc invoice-details-container ">
                            <div className="scroll-container-pc">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ISBNCode</th>
                                            <th>Title</th>
                                            <th>Qty</th>
                                            <th>Dealer</th>

                                        </tr>
                                    </thead>
                                    <tbody>


                                        {orders.map((product, index) => (
                                            <tr key={index} className={product.dealer ? "row-selected" : "row-not-selected"}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="productCode-pc"
                                                        value={product.ISBNCode}
                                                        readOnly
                                                        disabled={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input

                                                        type="text"
                                                        value={product.title}
                                                        id="order-report-edit-title"
                                                        readOnly
                                                        disabled={true}

                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        id="productQuantity-pc"
                                                        value={product.quantity}
                                                        readOnly
                                                        disabled={true}

                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        value={product.dealer}
                                                        id="order-report-edit-dealer"

                                                        onChange={(e) => handleDealerChange(index, e.target.value)}
                                                    >
                                                        <option value="">Select</option>
                                                        <option>CBSD</option>
                                                        <option>JAYPEE</option>
                                                        <option>CTL</option>
                                                        <option>ASSORTED</option>
                                                        <option>GENERAL</option>
                                                        <option>R&D Chawla</option>
                                                        <option>UDH</option>
                                                    </select>

                                                </td>

                                            </tr>
                                        ))
                                        }



                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="buttons edit-order-save-btns">
                            <button className="btn btn-outline-success edit-order-save-btn" onClick={(e) => {
                                handleSave(e)
                            }}>
                                Save
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditOrderReport;
