import {makeStyles} from "@mui/styles";
import PhoneInput from "react-phone-number-input";
import styles from "./style.module.scss";
import "react-phone-number-input/style.css";
import {isString} from "lodash-es";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFInternationPhone = ({
  name = "",
  disabled,
  isTableView,
  newUi,
  row,
  handleChange,
  field,
  ...props
}) => {
  const classes = useStyles();

  const [innerValue, setInnerValue] = useState(row?.[field?.slug]);


  const onChange = useDebounce((value) => {
    setInnerValue(value);
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      handleChange({
        value: "",
        rowId: row?.guid,
        name: field?.slug
      })
    } else {
      handleChange({
        value,
        rowId: row?.guid,
        name: field?.slug
      })
    }
  }, 1000);

  return (
    <PhoneInput
          disabled={disabled}
          placeholder="Enter phone number"
          value={
            isString(innerValue) ? (innerValue?.includes("+") ? innerValue : `+${innerValue}`) : ""
          }
          id={`phone_${name}`}
          onChange={onChange}
          defaultCountry="UZ"
          international
          className={isTableView ? styles.inputTable : styles.phoneNumber}
          name={name}
          limitMaxLength={true}
          {...props}
          isValidPhoneNumber
          style={{ height: newUi ? "25px" : undefined }}
          renderInput={(inputProps) => (
            <input
              {...inputProps}
              defaultValue={row?.[field?.slug]}
              className={classes.input}
              data-valid={inputProps.isValidPhoneNumber}
            />
          )}
        />
  );
};

export default HFInternationPhone;
