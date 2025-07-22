import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import styles from "./style.module.scss";
import "react-phone-number-input/style.css";
import {isString} from "lodash-es";
import {Box} from "@chakra-ui/react";
import {Lock} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFInternationalPhone = ({
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
  isTableView = false,
  updateObject = () => {},
  isNewTableView,
  newUi,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Box position="relative">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is a required field" : false,
          ...rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <PhoneInput
            disabled={disabled}
            placeholder="Enter phone number"
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
            defaultCountry="UZ"
            international
            className={styles.inputTable}
            name={name}
            limitMaxLength={true}
            {...props}
            isValidPhoneNumber
            style={{
              height: newUi ? "25px" : undefined,
            }}
            renderInput={(inputProps) => (
              <input
                {...inputProps}
                className={classes.input}
                data-valid={inputProps.isValidPhoneNumber}
              />
            )}
          />
        )}
      />
      {disabled && (
        <Box
          sx={{
            position: "absolute",
            right: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Lock style={{fontSize: "20px", color: "#adb5bd"}} />
        </Box>
      )}
    </Box>
  );
};

export default HFInternationalPhone;
