import {Box, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import {NumericFormat} from "react-number-format";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {useSelector} from "react-redux";
import styles from "./style.module.scss";

function HFMoneyFieldEditor(props) {
  const {
    value,
    setValue,
    isTransparent = false,
    disabled = false,
    isBlackBg = false,
    error = {},
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [valueArray, setValueArray] = useState([
    value?.[0],
    value?.[1] || "USD",
  ]);

  const open = Boolean(anchorEl);
  const currencies = useSelector((state) => state?.auth?.currencies)?.map(
    (item) => ({label: item?.code})
  );

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (currency) => {
    setAnchorEl(null);
    if (currency) {
      setValueArray((prev) => [prev[0], currency]);
    }
  };
  console.log("setValuesetValue", setValue);
  return (
    <Box sx={{display: "flex", alignItems: "center"}}>
      <NumericFormat
        thousandsGroupStyle="thousand"
        thousandSeparator=" "
        decimalSeparator="."
        displayType="input"
        isNumericString={true}
        autoComplete="off"
        className="customMoneyField"
        value={value?.[0] || 0}
        onChange={(event) => {
          const newValue = event.target.value;
          console.log("newValue", newValue);
          setValueArray([newValue, valueArray[1]]);
          setValue([newValue, value[1]]);
        }}
        style={
          isTransparent
            ? {
                background: "transparent",
                border: "none",
                borderRadius: "0",
                outline: "none",
              }
            : disabled
              ? {
                  background: "#c0c0c039",
                  borderRight: 0,
                  outline: "none",
                }
              : {
                  background: isBlackBg ? "#2A2D34" : "",
                  color: isBlackBg ? "#fff" : "",
                  outline: "none",
                  border: error?.type === "required" ? "1px solid red" : "",
                }
        }
      />
      <button
        className={styles.moneyBtn}
        onClick={handleMenuClick}
        style={{cursor: "pointer", paddingLeft: "5px"}}>
        <div>{valueArray?.[1]}</div>
        <ArrowDropDownIcon style={{fontSize: "20px"}} />
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleMenuClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        {currencies?.map((el) => (
          <MenuItem
            onClick={() => {
              setValue([value?.[0] ?? "", el?.label]);
              handleMenuClose(el?.label);
            }}>
            {el?.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default HFMoneyFieldEditor;
