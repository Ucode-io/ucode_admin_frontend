import {Controller} from "react-hook-form";
import {PatternFormat} from "react-number-format";
import style from "./style.module.scss";
import {Box, FormHelperText} from "@mui/material";
import {Lock} from "@mui/icons-material";

const HFCardnumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  updateObject = () => {},
  isNewTableView = false,
  isTransparent = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  newColumn,
  format = "",
  field,
  type = "text",
  newUi,
  error = {},
  ...props
}) => {
  const regexValidation = field?.attributes?.validation;

  const styles = isTransparent
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
          border: error?.type === "required" ? "1px solid red" : "",
        };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is a required field" : false,
        validate: (value) => {
          if (regexValidation && !new RegExp(regexValidation).test(value)) {
            return field?.attributes?.validation_message;
          }
          return true;
        },
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
                    position: "relative",
                  }
                : disabled
                  ? {
                      background: "#DEDEDE",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "4px",
                      position: "relative",
                    }
                  : {
                      background: isBlackBg ? "#2A2D34" : "",
                      color: isBlackBg ? "#fff" : "",
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }
            }>
            <PatternFormat
              format={format}
              mask="_"
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              autoComplete="off"
              id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
              allowNegative
              value={typeof value === "number" ? value : ""}
              onValueChange={(e) => onChange(e.value)}
              className={`${isFormEdit ? "custom_textfield" : ""} ${
                style.numberField
              }`}
              name={name}
              readOnly={disabled}
              style={{...styles, height: newUi ? "25px" : undefined}}
              {...props}
            />
            {!disabledHelperText && error?.message && (
              <FormHelperText
                sx={{
                  position: "absolute",
                  bottom: newColumn ? "-10px" : "-20px",
                  left: "10px",
                }}
                error>
                {error?.message}
              </FormHelperText>
            )}

            {disabled && (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}>
                <Lock style={{fontSize: "20px"}} />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default HFCardnumberField;
