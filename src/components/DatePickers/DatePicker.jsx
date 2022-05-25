import { useState } from "react"
import ReactDatePicker from "react-datepicker"

const DatePicker = () => {
  const [startDate, setStartDate] = useState(new Date())

  return (
    <ReactDatePicker
      elected={startDate}
      onChange={(date) => setStartDate(date)}
    />
  )
}

export default DatePicker
