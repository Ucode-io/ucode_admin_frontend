import { Controller } from "react-hook-form"
import CDateTimePicker from "../DatePickers/CDateTimePicker"

const HFDateTimePicker = ({
  control,
  className,
  name,
  label,
  width,
  inputProps,
  disabledHelperText,
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <CDateTimePicker
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )
      }}
    ></Controller>
  )
}

export default HFDateTimePicker
