import { Controller } from "react-hook-form"
import CDatePicker from "../DatePickers/CDatePicker"

const HFDatePicker = ({ control, className, name, label, width, inputProps, disabledHelperText, placeholder, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={className}>
          <CDatePicker value={value} onChange={onChange} />
        </div>
      )}
    ></Controller>
  )
}

export default HFDatePicker
