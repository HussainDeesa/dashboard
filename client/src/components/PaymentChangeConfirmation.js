
import React from 'react';
export function PaymentChangeConfirmation({onCancel,onConfirm,type}){
  return (
    <div class="delete-confirmation">
  <div class="delete-confirmation-dialog" style={{maxWidth:"430px"}}>
    <h3>Confirmation</h3>
    <p>Are you sure you want to mark this item as {type}?</p>
    <div class="buttons">
      <button className='btn btn-outline-success' onClick={onCancel}>Cancel</button>
      <button className={`btn btn-${type=="Paid"?"success":"danger"}`} onClick={(e)=>{onConfirm(e)}}>Mark as {type}</button>
    </div>
  </div>
</div>

  );
};

export default PaymentChangeConfirmation;
