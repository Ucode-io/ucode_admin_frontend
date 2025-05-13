import React, {useState} from "react";
import HFTextField from "./HFTextField";
import {IconButton, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function HFPassword({
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
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getType = () => {
    return showPassword ? "text" : "password";
  };

  return (
    <HFTextField
      isDisabled={isDisabled}
      isFormEdit
      updateObject={updateObject}
      isNewTableView={isNewTableView}
      isBlackBg={isBlackBg}
      control={control}
      name={name}
      fullWidth
      field={field}
      required={field?.required}
      type={getType()}
      placeholder={field?.attributes?.placeholder}
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
      defaultValue={defaultValue}
    />
  );
}

export default HFPassword;
