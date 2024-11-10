import React from 'react'
import "./CardLoader.css"

const CardLoader = () => {
  return (
    <div className="card-loader">
      <div className="image-placeholder"></div>
      <div className="text-placeholder">
        <div className="line"></div>
        <div className="line short"></div>
      </div>
    </div>
  )
}

export default CardLoader
