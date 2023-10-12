import React from 'react'
import './Missing.css'
import img_4O4 from '../../Assets/1694272456019.jpg'
const Missing = () => {
  return (
    <div className="not-found">
      
      <img src={img_4O4} alt="Page Not Found" id='img_404'/><br />
      <a href="/">Go back to the home page</a>
    </div>
  )
}

export default Missing
