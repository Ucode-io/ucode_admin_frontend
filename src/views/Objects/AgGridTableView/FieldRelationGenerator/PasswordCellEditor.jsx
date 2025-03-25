import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import React, {useState} from "react";
import useDebounce from "../../../../hooks/useDebounce";
import RowClickButton from "../RowClickButton";

function PasswordCellEditor(props) {
  const {setValue, value, colDef} = props;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getType = () => {
    return showPassword ? "text" : "password";
  };

  const inputChangeHandler = useDebounce((val) => setValue(val), 500);
  return (
    <>
      <TextField
        value={value}
        type={getType()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
          style: {
            background: "transparent",
            width: "100%",
          },
        }}
        onChange={(e) => inputChangeHandler(e.target.value)}
        className={"custom_textfield_new"}
      />
      {props?.colDef?.colIndex === 0 && <RowClickButton right="5px" />}
    </>
  );
}

export default PasswordCellEditor;
