import {InputAdornment, TextField, Tooltip} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";

import {numberWithSpaces} from "@/utils/formatNumbers";
import {Lock} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTextField = ({
  control,
  name = "",
  isFormEdit = false,
  isBlackBg,
  updateObject,
  isNewTableView = false,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  tabIndex,
  checkRequiredField,
  placeholder,
  endAdornment,
  field,
  disabled_text = "This field is disabled for this role!",
  customOnChange = () => {},
  ...props
}) => {
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          size="small"
          value={typeof value === "number" ? numberWithSpaces(value) : value}
          onChange={(e) => {
            onChange(
              withTrim
                ? e.target.value?.trim()
                : typeof e.target.value === "number"
                ? numberWithSpaces(e.target.value)
                : e.target.value
            );
            customOnChange(e);
            isNewTableView && updateObject();
          }}
          name={name}
          error={error}
          fullWidth={fullWidth}
          placeholder={placeholder}
          autoFocus={tabIndex === 1}
          InputProps={{
            readOnly: disabled,
            inputProps: {tabIndex},
            classes: {
              input: isBlackBg ? classes.input : "",
            },

            endAdornment: disabled ? (
              <Tooltip title={disabled_text}>
                <InputAdornment position="start">
                  <Lock style={{fontSize: "20px"}} />
                </InputAdornment>
              </Tooltip>
            ) : (
              endAdornment
            ),
          }}
          helperText={!disabledHelperText && error?.message}
          className={isFormEdit ? "custom_textfield" : ""}
          {...props}
        />
      )}
    />
  );
};

export default HFTextField;
