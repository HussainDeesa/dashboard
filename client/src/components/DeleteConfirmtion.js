
import React from 'react';
export function DeleteConfirmation({onCancel,onConfirm}){
  return (
    <div class="delete-confirmation">
  <div class="delete-confirmation-dialog">
    <h3>Confirmation</h3>
    <p>Are you sure you want to delete this item?</p>
    <div class="buttons">
      <button className='btn btn-outline-success' onClick={onCancel}>Cancel</button>
      <button className='btn btn-danger' onClick={onConfirm}>Delete</button>
    </div>
  </div>
</div>

  );
};

export default DeleteConfirmation;
