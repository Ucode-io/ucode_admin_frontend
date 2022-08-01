import { Controller } from "react-hook-form"
import CDatePicker from "../DatePickers/CDatePicker"
import CTimePicker from "../DatePickers/CTimePicker"

const HFTimePicker = ({ control, className, name, label, width, inputProps, disabledHelperText, placeholder, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={className}>
          <CTimePicker value={value} onChange={onChange} />
        </div>
      )}
    ></Controller>
  )
}

export default HFTimePicker
