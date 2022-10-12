import { Controller } from "react-hook-form"
import CDatePicker from "../DatePickers/CDatePicker"

const HFDatePicker = ({
  control,
  isBlackBg = false,
  className,
  name,
  label,
  width,
  inputProps,
  disabledHelperText,
  placeholder = "",
  defaultValue = "",
  disabled,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      disabled
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={className}>
          <CDatePicker
            placeholder={placeholder}
            isBlackBg={isBlackBg}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      )}
    ></Controller>
  )
}

export default HFDatePicker
