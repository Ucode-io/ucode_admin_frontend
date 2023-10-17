import React, { useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
import IconGenerator from "../IconPicker/IconGenerator";
import ClearIcon from "@mui/icons-material/Clear"; // Import the clear icon

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
  optionType,
  defaultValue = "",
  rules = {},
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleClear = () => {
    setSelectedValue("");
    onChange("");
  };

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
            <Select
              value={value || selectedValue}
              label={label}
              size="small"
              error={error}
              inputProps={{ placeholder }}
              fullWidth
              just
              following
              attributes
              into
              select
              displayEmpty
              renderValue={
                value !== ""
                  ? undefined
                  : () => (
                      <span style={{ color: "#909EAB" }}>{placeholder}</span>
                    )
              }
              onChange={(e) => {
                setSelectedValue(e.target.value);
                onChange(e.target.value);
                onFormChange(e.target.value);
              }}
              onOpen={() => {
                onOpen();
              }}
              {...props}
            >
              {optionType === "GROUP"
                ? options?.map((group, groupIndex) => [
                    <MenuItem
                      style={{ fontWeight: 600, color: "#000", fontSize: 15 }}
                    >
                      {group.label}
                    </MenuItem>,
                    group.options?.map((option) => (
                      <MenuItem
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
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
            </Select>
            {!disabledHelperText && error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
            {selectedValue && (
              <Box sx={{position: 'absolute', right: '20px', top: '3px'}}>
                <IconButton onClick={handleClear} size="small">
                    <ClearIcon />
                 </IconButton>
              </Box>
            )}
          </FormControl>
        );
      }}
    ></Controller>
  );
};

export default HFSelect;
