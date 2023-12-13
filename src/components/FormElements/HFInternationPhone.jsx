import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import styles from "./style.module.scss";
import "react-phone-number-input/style.css";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFInternationPhone = ({
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
  ...props
}) => {
  const classes = useStyles();

  return (
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
          placeholder="Enter phone number"
          value={value?.includes("+") ? value : `+${value}`}
          onChange={onChange}
          defaultCountry="UZ"
          international
          className={isTableView ? styles.inputTable : styles.phoneNumber}
          name={name}
          limitMaxLength={true}
          {...props}
          isValidPhoneNumber
          renderInput={(inputProps) => (
            <input
              {...inputProps}
              className={classes.input}
              data-valid={inputProps.isValidPhoneNumber}
            />
          )}
        />
      )}
    ></Controller>
  );
};

export default HFInternationPhone;
