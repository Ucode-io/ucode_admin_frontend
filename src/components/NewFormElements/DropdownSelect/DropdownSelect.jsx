import React, { useState } from "react";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  IconButton,
  Box,
  CircularProgress,
  TextField as MuiTextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import { columnIcons } from "@/utils/constants/columnIcons";
import IconGenerator from "../../IconPicker/IconGenerator";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
  handleScroll = () => {},
  isLoading = false,
  searchable = false,
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange = () => {},
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
        if (searchable) {
          const selectedOption =
            options?.find(
              (option) => option?.value === (value || selectedValue),
            ) || null;

          return (
            <FormControl style={{ width }}>
              <Autocomplete
                value={selectedOption}
                inputValue={searchValue}
                options={options}
                loading={isLoading}
                disabled={disabled}
                disableClearable={!isClearable}
                filterOptions={(items) => items}
                getOptionLabel={(option) => option?.label ?? ""}
                isOptionEqualToValue={(option, selectedOption) =>
                  option?.value === selectedOption?.value
                }
                onChange={(_, option) => {
                  const nextValue = option?.value || "";

                  onFormChange(nextValue);
                  onChange(nextValue);
                  setSelectedValue(nextValue);
                  onSearchChange(option?.label || "", {
                    skipQuery: Boolean(option),
                  });
                  if (option) getOnchangeField(option);
                }}
                onInputChange={(_, inputValue, reason) => {
                  if (reason === "input" || reason === "clear") {
                    onSearchChange(inputValue);
                  }
                }}
                onOpen={onOpen}
                ListboxProps={{
                  onScroll: (event) => {
                    const target = event.currentTarget;
                    if (
                      target.scrollTop + target.clientHeight >=
                      target.scrollHeight - 5
                    ) {
                      handleScroll(event);
                    }
                  },
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label={label}
                    placeholder={placeholder || searchPlaceholder}
                    size="small"
                    error={Boolean(error)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                {...props}
              />
              {!disabledHelperText && error?.message && (
                <FormHelperText error>{error?.message}</FormHelperText>
              )}
            </FormControl>
          );
        }

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
              MenuProps={{
                PaperProps: {
                  onScroll: (e) => {
                    const target = e.currentTarget;
                    if (
                      target.scrollTop + target.clientHeight >=
                      target.scrollHeight - 5
                    ) {
                      handleScroll(e);
                    }
                  },
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                },
                autoFocus: false,
                disableAutoFocusItem: true,
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
                    <KeyboardArrowDownIcon
                      style={{ marginRight: "5px" }}
                      htmlColor="#637381"
                    />
                  );
                }
              }}
              {...props}
            >
              {optionType === "GROUP"
                ? options?.map((group, groupIndex) => [
                    <MenuItem
                      key={groupIndex}
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
              {isLoading && (
                <MenuItem disabled style={{ justifyContent: "center" }}>
                  <CircularProgress size={20} />
                </MenuItem>
              )}
            </MuiSelect>
            {!disabledHelperText && error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    ></Controller>
  );
};

export default DropdownSelect;
