import React, {useState} from "react";
import HFTextField from "./HFTextField";
import {IconButton, InputAdornment, TextField, Tooltip} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Controller} from "react-hook-form";
import {numberWithSpaces} from "../../utils/formatNumbers";
import clsx from "clsx";

function HFPasswordField({
  isDisabled,
  isFormEdit,
  isBlackBg,
  control,
  name,
  updateObject,
  isNewTableView = false,
  fullWidth,
  isTransparent,
  placeholder,
  props,
  field,
  defaultValue,
  newUi,
  required,
  withTrim = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getType = () => {
    return showPassword ? "text" : "password";
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            size="small"
            value={value}
            onChange={(e) => {
              onChange(
                withTrim
                  ? e.target.value?.trim()
                  : typeof e.target.value === "number"
                    ? numberWithSpaces(e.target.value)
                    : e.target.value
              );
            }}
            sx={{
              width: "100%",
              padding: "0px",
              margin: "0px",
              borderRadius: "8px",
            }}
            type={getType()}
            inputProps={{style: {height: "32px", padding: "0px 2px 0 7px"}}}
            name={name}
            id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
            error={error}
            fullWidth={fullWidth}
            placeholder={placeholder}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    style={newUi ? {padding: "4px"} : undefined}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                background: isTransparent ? "transparent" : "",
              },
            }}
            {...props}
          />
        );
      }}
    />
    // <HFTextField
    //   isDisabled={isDisabled}
    //   isFormEdit
    //   updateObject={updateObject}
    //   isNewTableView={isNewTableView}
    //   isBlackBg={isBlackBg}
    //   control={control}
    //   name={name}
    //   fullWidth
    //   field={field}
    //   required={field?.required}
    //   type={getType()}
    //   placeholder={field?.attributes?.placeholder}
    //   InputProps={{
    //     endAdornment: (
    //       <InputAdornment position="end">
    //         <IconButton
    //           aria-label="toggle password visibility"
    //           onClick={togglePasswordVisibility}
    //           style={newUi ? {padding: "4px"} : undefined}>
    //           {showPassword ? <Visibility /> : <VisibilityOff />}
    //         </IconButton>
    //       </InputAdornment>
    //     ),
    //     style: {
    //       background: isTransparent ? "transparent" : "",
    //     },
    //   }}
    //   {...props}
    //   defaultValue={defaultValue}
    // />
  );
}

export default HFPasswordField;
