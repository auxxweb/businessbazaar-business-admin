import React from 'react'
import './FullPageLoader.css'

const FullPageLoader = () => {
  return (
    <div className="fullscreen-overlay">
      <div className="main-loader">
        <div className="loader"></div>
      </div>
    </div>
  )
}

export default FullPageLoader
