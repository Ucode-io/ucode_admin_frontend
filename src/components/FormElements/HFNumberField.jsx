import {Controller} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import style from "./style.module.scss";
import {Box, FormHelperText} from "@mui/material";
import {Lock} from "@mui/icons-material";

const HFNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  updateObject = () => {},
  isNewTableView = false,
  fullWidth = false,
  isTransparent = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  newColumn,
  field,
  type = "text",
  newUi,
  error = {},
  ...props
}) => {
  const handleChange = (event, onChange) => {
    const inputValue = event.target.value.replace(/\s+/g, "");
    const parsedValue = inputValue ? parseFloat(inputValue) : "";

    if (parsedValue || parsedValue === 0) {
      onChange(parsedValue);
    } else {
      onChange("");
    }

    if (isNewTableView) {
      updateObject();
    }
  };

  const regexValidation = field?.attributes?.validation;

  const styles = isTransparent
    ? {
        background: "transparent",
        border: "none",
        borderRadius: "0",
        outline: "none",
      }
    : disabled
      ? {
          background: "#c0c0c039",
          borderRight: 0,
          outline: "none",
        }
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
          <Box>
            <NumericFormat
              key={value}
              maxLength={19}
              format="#### #### #### ####"
              mask="_"
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              isNumericString={true}
              autoComplete="off"
              id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
              allowNegative
              fullWidth={fullWidth}
              value={!isNaN(value) ? value : ""}
              onChange={(e) => handleChange(e, onChange)}
              className={"custom_textfield"}
              name={name}
              readOnly={disabled}
              style={{
                ...styles,
                height: newUi ? "25px" : "38px",
                width: "100%",
                border: isNewTableView
                  ? "none"
                  : error?.message
                    ? "1px solid red"
                    : "1px solid #D4D2D2",
                borderRadius: "4px",
                paddingLeft: "8px",
              }}
              {...props}
            />
            {error?.message && (
              <FormHelperText
                sx={{
                  position: "absolute",
                  bottom: newColumn ? "-10px" : "-20px",
                  left: "10px",
                }}
                error
              >
                {error?.message}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};

export default HFNumberField;
