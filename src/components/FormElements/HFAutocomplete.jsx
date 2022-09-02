import { FormControl, FormHelperText, InputLabel } from "@mui/material"
import { Controller } from "react-hook-form"
import CAutoCompleteSelect from "../CAutoCompleteSelect"

const HFAutocomplete = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  rules = {},
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
      render={({
        field: { onChange: onFormChange, value },
        fieldState: { error },
      }) => (
        <FormControl style={{ width }}>
          <InputLabel size="small">{label}</InputLabel>
          <CAutoCompleteSelect
            value={value}
            onChange={(val) => {
              onChange(val)
              onFormChange(val)
            }}
            options={options}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    ></Controller>
  )
}

export default HFAutocomplete
