import React, {useState} from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";
import {Controller} from "react-hook-form";
import IconGenerator from "../IconPicker/IconGenerator";
import ClearIcon from "@mui/icons-material/Clear";
import {columnIcons} from "../../utils/constants/columnIcons";
import IconGeneratorIconjs from "../IconPicker/IconGeneratorIconjs";

const HFSelect = ({
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
          <FormControl style={{width}}>
            <InputLabel size="small">{label}</InputLabel>
            <Select
              disablePortal={true}
              value={value || selectedValue}
              label={label}
              defaultValue={selectedValue}
              size="small"
              className="hf-select"
              error={error}
              inputProps={{placeholder}}
              fullWidth
              id={idSet}
              displayEmpty={displayEmpty}
              renderValue={
                value !== ""
                  ? undefined
                  : () => <span style={{color: "#909EAB"}}>{placeholder}</span>
              }
              onChange={(e) => {
                onFormChange(e.target.value);
                onChange(e.target.value);
                setSelectedValue(e.target.value);
              }}
              onOpen={() => onOpen()}
              disabled={disabled}
              {...props}>
              {optionType === "GROUP"
                ? options?.map((group, groupIndex) => [
                    <MenuItem
                      key={`group_${groupIndex}`}
                      onClick={() => getOnchangeField(group)}
                      style={{
                        fontWeight: 600,
                        color: "#000",
                        fontSize: 15,
                      }}>
                      {group.label}
                    </MenuItem>,
                    group.options?.map((option) => (
                      <MenuItem
                        onClick={() => getOnchangeField(option)}
                        key={option.value}
                        value={option.value}
                        style={{paddingLeft: 30}}>
                        <div className="flex align-center gap-2">
                          {option?.icon?.includes(":") ? (
                            <IconGeneratorIconjs
                              icon={option.icon}
                              size={15}
                              style={{color: "#6E8BB7"}}
                            />
                          ) : (
                            <IconGenerator
                              icon={option.icon}
                              size={15}
                              style={{color: "#6E8BB7"}}
                            />
                          )}
                          {/* <IconGenerator
                            icon={option.icon}
                            size={15}
                            style={{color: "#6E8BB7"}}
                          /> */}
                          {option.label}
                        </div>
                      </MenuItem>
                    )),
                  ])
                : options?.map((option) => (
                    <MenuItem
                      id={`field_option_${option?.value}`}
                      onClick={() => getOnchangeField(option)}
                      key={option?.value}
                      value={option?.value}>
                      <div className="flex align-center gap-2">
                        {option?.icon && columnIcons(option?.value)}
                        {option?.label}
                      </div>
                    </MenuItem>
                  ))}
            </Select>
            {!disabledHelperText && error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
            {(selectedValue || value || defaultValue) && (
              <Box sx={{position: "absolute", right: "20px", top: "3px"}}>
                {isClearable && !disabled && (
                  <IconButton
                    onClick={() => handleClear(onFormChange)}
                    size="small">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default HFSelect;
