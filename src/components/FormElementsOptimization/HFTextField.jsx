import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

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
  disabled,
  tabIndex,
  placeholder,
  endAdornment,
  inputHeight,
  exist = false,
  className,
  inputStyles = {},
  wrapperStyles = {},
  startAdornment = <></>,
  row,
  handleBlur,
  error,
  autoFocus,
  ...props
}) => {
  const classes = useStyles();

  return (
    <TextField
      size="small"
      defaultValue={row?.value}
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
      id={row?.slug ? `${row?.slug}_${name}` : `${name}`}
      fullWidth={fullWidth}
      placeholder={placeholder}
      autoFocus={autoFocus || tabIndex === 1}
      InputProps={{
        readOnly: disabled,
        autoFocus,
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
