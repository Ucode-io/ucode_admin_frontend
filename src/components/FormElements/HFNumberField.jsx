import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"

const HFNumberField = ({
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
            const val = e.target.value

            if (!val) onChange("")
            else onChange(!isNaN(Number(val)) ? Number(val) : "")
          }}
          name={name}
          error={error}
          fullWidth={fullWidth}
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            readOnly: disabled,
            style: disabled
              ? {
                  background: "#c0c0c039",
                }
              : {},
          }}
          {...props}
        />
      )}
    ></Controller>
  )
}

export default HFNumberField
