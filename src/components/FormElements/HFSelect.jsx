import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import { Controller } from "react-hook-form"

const HFSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "THIS IS REQUIRED FIELD" }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl style={{ width }}>
          <InputLabel size="small">{label}</InputLabel>
          <Select
            value={value}
            label={label}
            size="small"
            error={error}
            fullWidth
            onChange={(e) => {
              onChange(e.target.value)
            }}
            {...props}
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {!disabledHelperText && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    ></Controller>
  )
}

export default HFSelect
