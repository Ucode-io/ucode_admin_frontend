


import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import InputMask from "react-input-mask"
import CurrencyFormat from "react-currency-format"

const HFNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  rules = {},
  mask,
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
        <CurrencyFormat
        format="##/##"
          customInput={(inputProps) => (
            <TextField
              size="small"
              name={name}
              error={error}
              helperText={!disabledHelperText && error?.message}
              {...inputProps}
              {...props}
            />
          )}
          value={value ?? undefined}
          onChange={e => onChange(e.target.value)}
        >
        </CurrencyFormat>
      )}
    ></Controller>
  )
}

export default HFNumberField
