import React from "react"
import noData from "./img/empty-drawer- (2).png"

function EmptyData({ loading }) {
  if (loading) return null

  return (
    <div className="flex justify-center mt-5 mb-5 w-full">
      <img src={noData} alt="no data" />
    </div>
  )
}

export default EmptyData
