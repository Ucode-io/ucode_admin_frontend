import {NumericFormat} from "react-number-format";
import {Box, FormHelperText} from "@mui/material";
import { useState } from "react";

const HFNumberField = ({
  name = "",
  isBlackBg = false,
  isNewTableView = false,
  fullWidth = false,
  isTransparent = false,
  disabled,
  newColumn,
  newUi,
  row,
  handleChange = () => {},
  ...props
}) => {
  const [error] = useState({});

  const onBlur = (event) => {
    const inputValue = event.target.value.replace(/\s+/g, "");
    const parsedValue = inputValue ? parseFloat(inputValue) : "";

    if (parsedValue || parsedValue === 0) {
      handleChange({
        value: parsedValue,
        rowId: row?.guid,
        name: row?.slug,
      });
    } else {
      handleChange({
        value: "",
        rowId: row?.guid,
        name: row?.slug,
      });
    }
  };

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

  const innerValue = row?.value;

  return (
    <Box>
      <NumericFormat
        maxLength={19}
        format="#### #### #### ####"
        mask="_"
        thousandsGroupStyle="thousand"
        thousandSeparator=" "
        decimalSeparator="."
        displayType="input"
        isNumericString={true}
        autoComplete="off"
        id={row?.slug ? `${row?.slug}_${name}` : `${name}`}
        allowNegative
        fullWidth={fullWidth}
        value={!isNaN(innerValue) ? innerValue : ""}
        onBlur={onBlur}
        className={"custom_textfield"}
        // name={name}
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
};

export default HFNumberField;
