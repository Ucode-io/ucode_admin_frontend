import React from "react";
import {Controller} from "react-hook-form";
import {MenuItem, Select, FormHelperText, FormControl} from "@mui/material";
import {useTranslation} from "react-i18next";

function HFFairSelect({
  name = "",
  control,
  defaultValue = "",
  options = [],
  required = false,
  rules = {},
}) {
  const {t} = useTranslation();
  return (
    <Controller
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <FormControl fullWidth error={!!error}>
          <Select
            onChange={onChange}
            value={value || ""}
            displayEmpty
            sx={{
              height: "44px",
              borderColor: error ? "red" : "#DBE0E4",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: error ? "red" : "#DBE0E4",
              },
              color: Boolean(value) ? "#000" : "#667085",
            }}>
            <MenuItem value="" disabled>
              {t("select_tariff")}
            </MenuItem>
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

export default HFFairSelect;
