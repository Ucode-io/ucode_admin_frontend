import {Box, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import {Controller} from "react-hook-form";
import styles from "./style.module.scss";
import {NumericFormat} from "react-number-format";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {useSelector} from "react-redux";

function HFMoneyField({
  name,
  watch,
  control,
  disabled = false,
  updateObject = () => {},
  newUi,
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

  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "32px",
              width: "325px",
            }}>
            <NumericFormat
              style={{
                height: "32px",
                fontSize: "11px",
                color: "#787774",
                outline: "none",
              }}
              disabled={disabled}
              id="moneyField"
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
                setValueArray([newValue, valueArray[1]]);
                onChange([newValue, value[1]]);
              }}
              // style={

              // }
            />
            <button
              id="currency_field"
              className={styles.moneyBtn}
              onClick={handleMenuClick}
              style={{cursor: "pointer", paddingLeft: "5px"}}>
              <div style={{fontSize: "11px"}}>{value?.[1]}</div>
              <ArrowDropDownIcon style={{fontSize: "15px"}} />
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
                  sx={{fontSize: "11px"}}
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
