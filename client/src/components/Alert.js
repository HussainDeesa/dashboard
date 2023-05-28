import React from 'react'

export const Alert = (props) => {
  const today = new Date().toISOString().split('T')[0]
  const { state } =props
  const addRecord = async (e) => {
      const response = await fetch(`api/order/addorder`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',

          },
          body: JSON.stringify({ orderid: state.orderid, trackingid: String(state.trackingid), post: state.post, date: state.date, status: state.status, skip_check: true })

      })
      let json = await response.json();
      window.location.reload()

  }
  return (  

    <div >

      {(props.alert && props.alert.message != undefined) && <div className={`alert ${props.alert.class}`} role="alert">
        {props.alert.message}
        {( props.alert.message && props.state) &&<button className='btn btn-warning btn-addanyways' onClick={()=>{
          addRecord()
        }}>Add Anyways</button>}
      </div>}

    </div>

  )
}
