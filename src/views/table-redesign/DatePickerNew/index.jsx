import CloseIcon from "@mui/icons-material/Close";
import {Box, Popover} from "@mui/material";
import {format} from "date-fns";
import React, {useEffect, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {HFDayPicker} from "./HFDayPicker";
import HFMonthPicker from "./HFMonthPicker";
import HFQuarterPicker from "./HFQuarterPicker";
import HFYearPicker from "./HFYearPicker";
import styles from "./style.module.scss";
import {useController, useWatch} from "react-hook-form";
import {Lock} from "@mui/icons-material";
import {DateInput} from "rsuite"; // ✅ React Suite DateInput
import "rsuite/dist/rsuite.min.css";

function HFDatePickerNew({
  withTime = false,
  control,
  name,
  field,
  disabled = false,
  required = false,
  placeholder = "dd.MM.yyyy",
  defaultValue = "",
  isNewTableView = false,
  isTransparent = false,
  updateObject = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const {field: rhfField} = useController({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const value = useWatch({control, name});
  const formatString = withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy";

  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    if (value && !isNaN(Date.parse(value))) {
      setInputValue(new Date(value));
    } else {
      setInputValue(null);
    }
  }, [value]);

  const handleDateChange = (date) => {
    if (date && !isNaN(date.getTime())) {
      rhfField.onChange(date.toISOString());
      updateObject();
    } else {
      rhfField.onChange("");
    }
    setInputValue(date);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          fontSize: "12px",
          height: "30px",
        }}>
        <DateInput
          format={formatString}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleDateChange}
          disabled={disabled}
          style={{
            width: "100%",
            fontSize: "12px",
            height: "30px",
            border: "none",
            outline: "none",
            boxShadow: "none",
            background: "transparent",
          }}
          className="custom-date-input"
        />

        {Boolean(disabled) && (
          <Box sx={{marginRight: "20px"}}>
            <Lock />
          </Box>
        )}
        <Box
          sx={{marginRight: "24px", cursor: "pointer"}}
          onClick={(e) => {
            !disabled && setAnchorEl(e.currentTarget);
          }}>
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
        }}>
        <Box
          sx={{
            minWidth: "210px",
            minHeight: "250px",
            border: "1px solid #eee",
            borderRadius: "8px",
          }}>
          <Tabs className={styles.tabs}>
            <TabList className={styles.tablist}>
              <Tab className={styles.tab}>Day</Tab>
              <Tab className={styles.tab}>Month</Tab>
              <Tab className={styles.tab}>Quarter</Tab>
              <Tab className={styles.tab}>Yearly</Tab>
            </TabList>
            <TabPanel>
              <HFDayPicker
                control={control}
                name={name}
                field={field}
                placeholder={field?.label}
                updateObject={updateObject}
                withTime={withTime}
              />
            </TabPanel>
            <TabPanel>
              <HFMonthPicker
                control={control}
                name={name}
                field={field}
                placeholder={field?.label}
                updateObject={updateObject}
              />
            </TabPanel>
            <TabPanel>
              <HFQuarterPicker
                control={control}
                name={name}
                field={field}
                placeholder={field?.label}
                updateObject={updateObject}
              />
            </TabPanel>
            <TabPanel>
              <HFYearPicker
                control={control}
                name={name}
                field={field}
                placeholder={field?.label}
                updateObject={updateObject}
              />
            </TabPanel>
          </Tabs>
        </Box>
      </Popover>
    </Box>
  );
}

export default HFDatePickerNew;
