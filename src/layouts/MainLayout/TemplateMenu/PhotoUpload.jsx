import {FormHelperText} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import TemplateImage from "./TemplateImage";

export default function PhotoUpload({
  control,
  name = "",
  required = false,
  tabIndex = 0,
  isNewTableView = false,
  rules = {},
  disabledHelperText = false,
  disabled = false,
  field = {},
  ...props
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <TemplateImage
            name={name}
            value={value}
            tabIndex={tabIndex}
            field={field}
            isNewTableView={isNewTableView}
            onChange={(val) => {
              onChange(val);
            }}
            disabled={disabled}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}></Controller>
  );
}
