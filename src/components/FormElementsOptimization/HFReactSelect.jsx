import React, {useState} from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
} from "@mui/material";
import {Controller} from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import Select from "react-select";
import IconGenerator from "../IconPicker/IconGenerator";
import IconGeneratorIconjs from "../IconPicker/IconGeneratorIconjs";
import {columnIcons} from "../../utils/constants/columnIcons";

const HFReactSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  onOpen = () => {},
  getOnchangeField = () => {},
  optionType,
  defaultValue = "",
  rules = {},
  id,
  isClearable = true,
  disabled = false,
  displayEmpty = true,
  isSearchable = false,
  autoFocus = false,
  fieldProps = {},
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleClear = (onFormChange) => {
    setSelectedValue("");
    onFormChange("");
    onChange("");
  };

  const idSet = id ? `select_${id}` : `select_${name}`;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: {onChange: onFormChange, value},
        fieldState: {error},
      }) => {
        if (isSearchable) {
          return (
            <FormControl style={{width}}>
              <Autocomplete
                disablePortal={true}
                options={options}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option?.label || ""
                }
                value={options.find((opt) => opt.value === value) || null}
                onChange={(event, newValue) => {
                  const newVal = newValue ? newValue.value : "";
                  setSelectedValue(newVal);
                  onFormChange(newVal);
                  onChange(newVal);
                }}
                isOptionEqualToValue={(option, val) =>
                  option.value === val.value
                }
                disabled={disabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    size="small"
                    error={!!error}
                    helperText={!disabledHelperText && error?.message}
                    autoFocus={autoFocus}
                    {...fieldProps}
                  />
                )}
                disableClearable={!isClearable}
                {...props}
              />
            </FormControl>
          );
        }

        return (
          <FormControl style={{width}} error={!!error}>
            {label && (
              <InputLabel shrink htmlFor={idSet}>
                {label}
              </InputLabel>
            )}
            <Select
              inputId={idSet}
              options={optionType === "GROUP" ? undefined : options}
              value={
                options.find((opt) => opt.value === (value || selectedValue)) ||
                null
              }
              onChange={(selectedOption) => {
                const newVal = selectedOption ? selectedOption.value : "";
                setSelectedValue(newVal);
                onFormChange(newVal);
                onChange(newVal);
                if (selectedOption) getOnchangeField(selectedOption);
              }}
              placeholder={placeholder}
              isClearable={isClearable}
              isDisabled={disabled}
              onMenuOpen={onOpen}
              styles={{
                container: (base) => ({
                  ...base,
                  width: "100%",
                }),
                control: (base, state) => ({
                  ...base,
                  minHeight: 38,
                  borderColor: error ? "#d32f2f" : base.borderColor,
                  "&:hover": {
                    borderColor: error ? "#d32f2f" : "#1976d2",
                  },
                }),
              }}
              formatOptionLabel={(option) => (
                <div className="flex align-center gap-2">
                  {option?.icon?.includes(":") ? (
                    <IconGeneratorIconjs
                      icon={option.icon}
                      size={15}
                      style={{color: "#6E8BB7"}}
                    />
                  ) : option?.icon ? (
                    <IconGenerator
                      icon={option.icon}
                      size={15}
                      style={{color: "#6E8BB7"}}
                    />
                  ) : (
                    columnIcons(option?.value)
                  )}
                  {option.label}
                </div>
              )}
              {...props}
            />
            {!disabledHelperText && error?.message && (
              <FormHelperText>{error?.message}</FormHelperText>
            )}
            {/* {(selectedValue || value || defaultValue) && (
              <Box sx={{position: "absolute", right: "20px", top: "3px"}}>
                {isClearable && !disabled && (
                  <IconButton
                    onClick={() => handleClear(onFormChange)}
                    size="small">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            )} */}
          </FormControl>
        );
      }}
    />
  );
};

export default HFReactSelect;
