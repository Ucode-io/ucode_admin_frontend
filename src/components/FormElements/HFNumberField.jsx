import {Controller, useWatch} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import styles from "./style.module.scss";
import {Box} from "@mui/material";
import {Lock} from "@mui/icons-material";

const HFNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  updateObject,
  isNewTableView = false,
  fullWidth = false,
  isTransparent = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  type = "text",
  ...props
}) => {
  const handleChange = (value, onChange) => {
    if (value.floatValue) {
      onChange(value?.floatValue ||0);
      // isNewTableView && updateObject();
    } else {
      onChange("");
      // isNewTableView && updateObject();
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <Box
            style={
              isTransparent
                ? {
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                  }
                : disabled
                ? {
                    background: "#DEDEDE",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "4px",
                  }
                : {
                    background: isBlackBg ? "#2A2D34" : "",
                    color: isBlackBg ? "#fff" : "",
                    display: "flex",
                    alignItems: "center",
                  }
            }
          >
            <NumericFormat
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              isNumericString={true}
              autoComplete="off"
              allowNegative
              fullWidth={fullWidth}
              value={value || 0}
              onValueChange={(value) => {
                handleChange(value, onChange);
              }}
              className={`${isFormEdit ? "custom_textfield" : ""} ${
                styles.numberField
              }`}
              name={name}
              readOnly={disabled}
              style={
                isTransparent
                  ? {
                      background: "transparent",
                      border: "none",
                      borderRadius: "0",
                      outline: "none",
                    }
                  : disabled
                  ? {background: "#c0c0c039", borderRight: 0, outline: "none"}
                  : {
                      background: isBlackBg ? "#2A2D34" : "",
                      color: isBlackBg ? "#fff" : "",
                      outline: "none",
                    }
              }
              {...props}
            />

            {disabled && (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                <Lock style={{fontSize: "20px"}} />
              </Box>
            )}
          </Box>
        );
      }}
    ></Controller>
  );
};

export default HFNumberField;
