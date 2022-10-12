import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import InputMask from "react-input-mask"

const HFTextFieldWithMask = ({
  control,
  name = "",
  isBlackBg = false,
  disabledHelperText = false,
  required = false,
  rules = {},
  mask,
  disabled,
  placeholder,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputMask
          mask={mask}
          value={value ?? undefined}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {(inputProps) => (
            <TextField
              isBlackBg={isBlackBg}
              size="small"
              name={name}
              error={error}
              helperText={!disabledHelperText && error?.message}
              placeholder={placeholder}
              InputProps={{
                ...inputProps,
                style: {
                  background: isBlackBg ? "#2A2D34" : "",
                  color: isBlackBg ? "#fff" : "",
                },
              }}
              {...props}
            />
          )}
        </InputMask>
      )}
    ></Controller>
  )
}

export default HFTextFieldWithMask
