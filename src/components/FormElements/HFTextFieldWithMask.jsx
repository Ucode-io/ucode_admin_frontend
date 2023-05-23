import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import styles from './style.module.scss'
import 'react-phone-number-input/style.css'

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));



const HFTextFieldWithMask = ({
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
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        // <InputMask
        //   mask={mask}
        //   value={value ?? undefined}
        //   onChange={(e) => onChange(e.target.value)}
        //   disabled={disabled}
        // >
        //   {(inputProps) => (
        //     <TextField
        //       size="small"
        //       name={name}
        //       error={error}
        //       helperText={!disabledHelperText && error?.message}
        //       placeholder={placeholder}
        //       className={isFormEdit ? "custom_textfield" : ""}
        //       autoFocus={tabIndex === 1}
        //       {...props}
        //       InputProps={{
        //         ...inputProps,
        //         inputProps: { tabIndex },
        //         classes: {
        //           input: isBlackBg ? classes.input : "",
        //         },
        //         style: {
        //           background: isBlackBg ? "#2A2D34" : "",
        //           color: isBlackBg ? "#fff" : "",
        //         },
        //       }}
        //     />
        //   )}
        // </InputMask>
        <PhoneInput
          placeholder="Enter phone number"
          value={value}
          onChange={onChange}
          defaultCountry="UZ"
          international
          className={styles.phoneNumber}
          name={name}
          />
      )}
    ></Controller>
  );
};

export default HFTextFieldWithMask;
