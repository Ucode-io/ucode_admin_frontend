import { useState } from "react"
import CRangePickerNew from "../../../../components/DatePickers/CRangePickerNew"

const DateFilter = ({ onChange }) => {
  const [value, setValue] = useState([])


  return (
    <>
      <CRangePickerNew value={value} onChange={setValue} />
    </>
  )
}

export default DateFilter
