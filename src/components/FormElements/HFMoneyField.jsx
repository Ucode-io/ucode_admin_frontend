import {Box, Menu, MenuItem} from "@mui/material";
import {makeStyles} from "@mui/styles";
import React, {useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import styles from "./style.module.scss";
import {NumericFormat} from "react-number-format";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useDebounce from "../../hooks/useDebounce";
import {useSelector} from "react-redux";

function HFMoneyField({
  name,
  watch,
  control,
  disabled = false,
  isBlackBg = false,
  isTransparent = false,
  updateObject = () => {},
}) {
  const value = watch(name);

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

  const inputChangeHandler = useDebounce((val) => updateObject(), 500);

  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}, fieldState: {error}}) => {
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
              onChange={(values) => {
                const newValue = values.target.value;
                setValueArray([newValue, valueArray[1]]);
                onChange([newValue, value[1]]);
                inputChangeHandler();
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
                        border:
                          error?.type === "required" ? "1px solid red" : "",
                      }
              }
            />
            <button
              className={styles.moneyBtn}
              onClick={handleMenuClick}
              style={{cursor: "pointer", paddingLeft: "5px"}}>
              <div>{value?.[1]}</div>
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
                    handleMenuClose(el?.label);
                    onChange([value?.[0], el?.label]);
                    updateObject();
                  }}>
                  {el?.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        );
      }}
    />
  );
}

export default HFMoneyField;
