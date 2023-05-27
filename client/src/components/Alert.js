import React from 'react'

export const Alert = (props) => {
  return (
  
    <div >
       
      {(props.alert && props.alert.message!=undefined)&&<div className={`alert ${props.alert.class}`} role="alert">
   {props.alert.message} 
     </div>}
   
    </div>

  )
}
