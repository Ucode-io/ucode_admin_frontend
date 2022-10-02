import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"

const HFTextField = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          size="small"
          value={value}
          onChange={(e) => {
            onChange(withTrim ? e.target.value?.trim() : e.target.value)
          }}
          name={name}
          error={error}
          fullWidth={fullWidth}
          InputProps={{
            readOnly: disabled,
            style: disabled
              ? {
                  background: "#c0c0c039",
                }
              : {},
          }}
          helperText={!disabledHelperText && error?.message}
          {...props}
        />
        
      )}
    ></Controller>
  )
}

export default HFTextField
