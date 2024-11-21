import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import styles from "./style.module.scss";
import "react-phone-number-input/style.css";
import {isString} from "lodash-es";
import {Box} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFPhoneLoginField = ({
  control,
  name = "",
  isBlackBg = false,
  isFormEdit = false,
  disabledHelperText = false,
  required = false,
  rules = {},
  mask,
  disabled,
  tabIndex,
  placeholder,
  defaultValue,
  isTableView,
  updateObject,
  isNewTableView,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Box className="phone_input">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is a required field" : false,
          ...rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Box sx={{position: "relative"}}>
            <Box
              sx={{
                position: "absolute",
                left: "12px",
                width: "30px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <img src="/img/phone.svg" alt="" />
            </Box>
            <PhoneInput
              disabled={disabled}
              placeholder={placeholder}
              value={
                isString(value)
                  ? value?.includes("+")
                    ? value
                    : `+${value}`
                  : ""
              }
              id={`phone_${name}`}
              onChange={(newValue) => {
                if (
                  newValue === undefined ||
                  newValue === null ||
                  newValue === ""
                ) {
                  isNewTableView && updateObject();
                  onChange("");
                } else {
                  isNewTableView && updateObject();
                  onChange(newValue);
                }
              }}
              international
              className={
                isTableView ? styles.inputTable : styles.phoneNumberLogin
              }
              name={name}
              limitMaxLength={true}
              {...props}
              isValidPhoneNumber
              renderInput={(inputProps) => (
                <>
                  <input
                    {...inputProps}
                    className={classes.input}
                    data-valid={inputProps.isValidPhoneNumber}
                  />
                </>
              )}
            />
          </Box>
        )}></Controller>
    </Box>
  );
};

export default HFPhoneLoginField;
