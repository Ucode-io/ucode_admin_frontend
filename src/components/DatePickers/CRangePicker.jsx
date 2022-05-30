import ReactDatePicker, { registerLocale } from "react-datepicker"
import ru from 'date-fns/locale/ru';

import "./style.scss"

registerLocale('ru', ru)


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
      locale="ru"
    />
  )
}

export default CRangePicker
