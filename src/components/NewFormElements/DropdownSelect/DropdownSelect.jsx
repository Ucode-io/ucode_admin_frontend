import React, { useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  IconButton,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import { columnIcons } from "@/utils/constants/columnIcons";
import IconGenerator from "../../IconPicker/IconGenerator";

const DropdownSelect = ({
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
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleClear = () => {
    setSelectedValue("");
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
        field: { onChange: onFormChange, value },
        fieldState: { error },
      }) => {
        return (
          <FormControl style={{ width }}>
            <InputLabel size="small">{label}</InputLabel>
            <MuiSelect
              value={value || selectedValue}
              label={label}
              defaultValue={selectedValue}
              size="small"
              className="hf-select"
              error={error}
              inputProps={{ placeholder }}
              fullWidth
              id={idSet}
              displayEmpty
              renderValue={
                value !== ""
                  ? undefined
                  : () => (
                      <span style={{ color: "#909EAB" }}>{placeholder}</span>
                    )
              }
              onChange={(e) => {
                onFormChange(e.target.value);
                onChange(e.target.value);
                setSelectedValue(e.target.value);
              }}
              onOpen={() => {
                onOpen();
              }}
              disabled={disabled}
              IconComponent={() => {
                if (selectedValue || value || defaultValue) {
                  return (
                    <Box
                      sx={{ position: "absolute", right: "5px", top: "3px" }}
                    >
                      {isClearable && !disabled && (
                        <IconButton
                          onClick={() => {
                            onFormChange("");
                            handleClear();
                          }}
                          size="small"
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                    </Box>
                  );
                } else {
                  return (
                    <svg
                      class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSelect-icon MuiSelect-iconOutlined css-jfl0wa-MuiSvgIcon-root-MuiSelect-icon"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ExpandMoreRoundedIcon"
                    >
                      <path d="M15.88 9.29 12 13.17 8.12 9.29a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0"></path>
                    </svg>
                  );
                }
              }}
              {...props}
            >
              {optionType === "GROUP"
                ? options?.map((group, groupIndex) => [
                    <MenuItem
                      onClick={(e) => getOnchangeField(group)}
                      style={{ fontWeight: 600, color: "#000", fontSize: 15 }}
                    >
                      {group.label}
                    </MenuItem>,
                    group.options?.map((option) => (
                      <MenuItem
                        onClick={(e) => getOnchangeField(option)}
                        key={option.value}
                        value={option.value}
                        style={{ paddingLeft: 30 }}
                      >
                        <div className="flex align-center gap-2">
                          <IconGenerator
                            icon={option.icon}
                            size={15}
                            style={{ color: "#6E8BB7" }}
                          />
                          {option.label}
                        </div>
                      </MenuItem>
                    )),
                  ])
                : options?.map((option) => (
                    <MenuItem
                      id={`field_option_${option?.value}`}
                      onClick={(e) => getOnchangeField(option)}
                      key={option?.value}
                      value={option?.value}
                    >
                      <div className="flex align-center gap-2">
                        {option?.icon && columnIcons(option?.value)}
                        {option?.label}
                      </div>
                    </MenuItem>
                  ))}
            </MuiSelect>
            {!disabledHelperText && error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
            {/* {(selectedValue || value || defaultValue) && (
              <Box sx={{ position: "absolute", right: "20px", top: "3px" }}>
                {isClearable && !disabled && (
                  <IconButton
                    onClick={() => {
                      onFormChange("");
                      handleClear();
                    }}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            )} */}
          </FormControl>
        );
      }}
    ></Controller>
  );
};

export default DropdownSelect;
