import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material"
import { Controller } from "react-hook-form"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const HFSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  rules = {},
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? "THIS IS REQUIRED FIELD" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl style={{ width }}>
          <InputLabel size="small">{label}</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={value ?? []}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            input={<OutlinedInput id="select-multiple-chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected?.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                // style={getStyles(name, personName, theme)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>

          {/* <Select
            value={value || ""}
            label={label}
            size="small"
            error={error}
            inputProps={{ placeholder }}
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
          </Select> */}
          {!disabledHelperText && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    ></Controller>
  )
}

export default HFSelect
