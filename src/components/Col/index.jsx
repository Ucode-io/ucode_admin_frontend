import React from "react"

export default function Col({ children, className = "" }) {
  return (
    <div
      className={`border p-6 rounded-md w-full flex justify-between items-center ${className}`}
    >
      {children}
    </div>
  )
}
