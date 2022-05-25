import ReactDatePicker from "react-datepicker"
import "./style.scss"

const CRangePicker = ({ value = [null, null], onChange }) => {

  return (
    <ReactDatePicker
      selected={value[0]}
      onChange={onChange}
      startDate={value[0]}
      endDate={value[1]}
      selectsRange
      showPopperArrow={false}
      dateFormat="dd.MM.yyyy"
    />
  )
}

export default CRangePicker
