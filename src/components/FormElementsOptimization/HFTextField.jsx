import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { numberWithSpaces } from "@/utils/formatNumbers";
import clsx from "clsx";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  input: {
    padding: "0px",
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTextField = ({
  name = "",
  isFormEdit = false,
  isBlackBg,
  isNewTableView = false,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  disabled,
  tabIndex,
  placeholder,
  endAdornment,
  field,
  inputHeight,
  // disabled_text = "This field is disabled for this role!",
  exist = false,
  className,
  inputStyles = {},
  wrapperStyles = {},
  startAdornment = <></>,
  handleChange = () => {},
  row,
  ...props
}) => {
  const [error, setError] = useState({});
  const classes = useStyles();

  const handleBlur = (e) => {
    const value = e.target.value;

    if (required && !value?.trim()) {
      setError({
        message: "This field is required",
      });
    } else {
      setError({});
    }

    handleChange({
      value: withTrim
        ? value?.trim()
        : typeof value === "number"
          ? numberWithSpaces(value)
          : value,
      name: field?.slug,
      rowId: row?.guid,
    });
  };

  return (
    <TextField
      size="small"
      defaultValue={row?.[field?.slug]}
      onBlur={handleBlur}
      disabled={disabled}
      sx={{
        width: "100%",
        padding: "0px",
        margin: "0px",
        border: exist ? "1px solid red" : "0px solid #000",
        borderRadius: "8px",
        ...wrapperStyles,
      }}
      required={required}
      // inputProps={{ style: { height: "25px", padding: "0px 2px 0 7px" } }}
      name={name}
      id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
      fullWidth={fullWidth}
      placeholder={placeholder}
      autoFocus={tabIndex === 1}
      InputProps={{
        readOnly: disabled,
        startAdornment,
        inputProps: {
          tabIndex,
          style: { height: inputHeight, ...inputStyles },
        },
        classes: {
          input: isBlackBg ? classes.input : "",
        },
        style: disabled
          ? {
              background: isNewTableView ? "inherit" : "#c0c0c039",
              padding: "0px",
              paddingLeft: "14px",
            }
          : isNewTableView
            ? {
                background: "inherit",
                color: "inherit",
                padding: "0px !important",
                margin: "0px !important",
                height: "25px",
              }
            : {},

        endAdornment,
      }}
      helperText={!disabledHelperText && error?.message}
      className={clsx(className, { custom_textfield: isFormEdit })}
      error={!disabledHelperText && Boolean(error?.message)}
      {...props}
    />
  );
};

export default HFTextField;
