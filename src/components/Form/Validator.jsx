// import { useState, useEffect } from "react"

export default function Validator ({ message, children }) {
  // const [error, setError] = useState(false)
  // const [errorMessage, setErrorMessage] = useState(null)

  // useEffect(() => {
  //   schema.validate({[name]: value})
  //     .then(res => setErrorMessage(null))
  //     .catch(err => setErrorMessage(err.message))
  // }, [value])

  return (
    <>
      {children}
      <div className="min-h-6 w-full" style={{fontSize: '14px', lineHeight: 1.5715, color: '#ff4d4f'}}>
        {message ?? ''}
      </div>
    </>
  )
}