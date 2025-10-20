import React, {useState} from "react";
import HFTextField from "./HFTextField";
import {IconButton, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function HFPassword({
  isBlackBg,
  name,
  isNewTableView = false,
  isTransparent,
  props,
  field,
  newUi,
  row,
  handleChange = () => {}
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <HFTextField
      isFormEdit
      isNewTableView={isNewTableView}
      isBlackBg={isBlackBg}
      name={name}
      fullWidth
      field={field}
      required={field?.required}
      placeholder={field?.attributes?.placeholder}
      row={row}
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
      handleChange={handleChange}
    />
  );
}

export default HFPassword;
