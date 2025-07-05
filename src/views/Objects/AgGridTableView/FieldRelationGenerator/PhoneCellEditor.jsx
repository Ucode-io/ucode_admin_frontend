import {makeStyles} from "@mui/styles";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {Box} from "@mui/material";
import styles from "./style.module.scss";
import useDebounce from "../../../../hooks/useDebounce";
import {isString} from "lodash-es";
import RowClickButton from "../RowClickButton";
import React from "react";

const PhoneCellEditor = (props) => {
  const {setValue = () => {}, value = "", data, colDef} = props;
  const disabled = colDef?.disabled;
  const inputChangeHandler = useDebounce((val) => setValue(val), 500);

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
      {" "}
      <Box sx={{padding: " 0 6px 0 13px"}}>
        <PhoneInput
          disabled={disabled}
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
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} right="5px" />
      {/* )} */}
    </Box>
  );
};

export default React.memo(PhoneCellEditor);
