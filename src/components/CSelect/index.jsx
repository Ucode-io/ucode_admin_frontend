import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material"

const CSelect = ({
  label,
  value,
  error,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  onChange=()=>{},
  ...props
}) => {
  return (
    <FormControl style={{ width }}>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        value={value || ""}
        label={label}
        size="small"
        error={error}
        inputProps={{ placeholder }}
        fullWidth
        onChange={onChange}
        {...props}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!disabledHelperText && (
        <FormHelperText error>{error?.message ?? " "}</FormHelperText>
      )}
    </FormControl>
  )
}

export default CSelect
