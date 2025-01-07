import {makeStyles} from "@mui/styles";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {Box} from "@mui/material";
import styles from "./style.module.scss";
import useDebounce from "../../../../hooks/useDebounce";
import {isString} from "lodash-es";

const PhoneCellEditor = (props) => {
  const {setValue = () => {}, value = ""} = props;

  const inputChangeHandler = useDebounce((val) => setValue(val), 500);

  return (
    <Box>
      <PhoneInput
        disabled={false}
        placeholder="Enter phone number"
        value={
          isString(value) ? (value?.includes("+") ? value : `${value}`) : ""
        }
        id={`phone_input`}
        onChange={(newValue) => {
          inputChangeHandler(newValue);
        }}
        defaultCountry="UZ"
        international
        className={styles.inputTable}
        limitMaxLength={true}
        isValidPhoneNumber
      />
    </Box>
  );
};

export default PhoneCellEditor;
