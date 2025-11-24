import {Box, Popover, TextField} from "@mui/material";
import {format, parse} from "date-fns";
import React, {useEffect, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {HFDayPicker} from "./HFDayPicker";
import HFMonthPicker from "./HFMonthPicker";
import HFQuarterPicker from "./HFQuarterPicker";
import HFYearPicker from "./HFYearPicker";
import styles from "./style.module.scss";
import InputMask from "react-input-mask";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

function HFDatePickerNew({
  withTime = false,
  disabled = false,
  placeholder = "DD.MM.YYYY",
  handleChange = () => {},
  row,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const formatString = withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy";

  const [inputValue, setInputValue] = useState("");

  const value = row?.value;

  useEffect(() => {
    if (value && !isNaN(Date.parse(value))) {
      setInputValue(format(new Date(value), formatString));
    } else {
      setInputValue(value || "");
    }
  }, [value, formatString]);

  const onChange = (value) => {
    handleChange({
      value: value.toISOString(),
      name: row?.slug,
      rowId: row?.guid,
    });
  };

  return (
    <Box>
      <Box
        onClick={(e) => !disabled && setAnchorEl(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          fontSize: "12px",
          height: "30px",
        }}
      >
        <InputMask
          mask={withTime ? "99.99.9999 99:99" : "99.99.9999"}
          value={inputValue}
          onChange={(e) => {
            let raw = e.target.value;

            let parts = raw.split(".");
            if (parts.length >= 2) {
              let month = parts[1];

              if (parseInt(month, 10) > 12) {
                month = "12";
              }

              if (month.length === 1 && parseInt(month, 10) > 0) {
                month = month.padStart(2, "0");
              }

              parts[1] = month;
              raw = parts.join(".");
            }

            setInputValue(raw);

            try {
              const parsed = parse(raw, formatString, new Date());
              const val = parsed.toISOString();
              onChange(val);
              return;
            } catch (err) {
              console.log(err);
            }
          }}
          disabled={disabled}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              placeholder={placeholder}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "12px",
                  height: "30px",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                },
              }}
              fullWidth
            />
          )}
        </InputMask>
        <Box
          sx={{ marginRight: "24px", cursor: "pointer" }}
          onClick={(e) => {
            !disabled && setAnchorEl(e.currentTarget);
          }}
        >
          <img src="/table-icons/date-time.svg" alt="" />
        </Box>
      </Box>

      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            minWidth: "210px",
            minHeight: "250px",
            border: "1px solid #eee",
            borderRadius: "8px",
          }}
        >
          <Tabs className={styles.tabs}>
            <TabList className={styles.tablist}>
              <Tab className={styles.tab}>Day</Tab>
              <Tab className={styles.tab}>Month</Tab>
              <Tab className={styles.tab}>Quarter</Tab>
              <Tab className={styles.tab}>Yearly</Tab>
            </TabList>
            <TabPanel>
              <HFDayPicker
                onChange={onChange}
                withTime={withTime}
                value={value}
                disabled={disabled}
              />
            </TabPanel>
            <TabPanel>
              <HFMonthPicker onChange={onChange} value={value} />
            </TabPanel>
            <TabPanel>
              <HFQuarterPicker onChange={onChange} value={value} />
            </TabPanel>
            <TabPanel>
              <HFYearPicker onChange={onChange} value={value} />
            </TabPanel>
          </Tabs>
        </Box>
      </Popover>
    </Box>
  );
}

export default HFDatePickerNew;
