import CloseIcon from "@mui/icons-material/Close";
import {Box, Popover, TextField} from "@mui/material";
import {format, parse} from "date-fns";
import React, {useEffect, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {HFDayPicker} from "./HFDayPicker";
import HFMonthPicker from "./HFMonthPicker";
import HFQuarterPicker from "./HFQuarterPicker";
import HFYearPicker from "./HFYearPicker";
import styles from "./style.module.scss";
import {Controller, useWatch} from "react-hook-form";
import {Lock} from "@mui/icons-material";
import InputMask from "react-input-mask";

function HFDatePickerNew({
  withTime = false,
  control,
  name,
  field,
  disabled = false,
  placeholder = "DD.MM.YYYY",
  defaultValue = "",
  updateObject = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const value = useWatch({control, name});
  const formatString = withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy";

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value && !isNaN(Date.parse(value))) {
      setInputValue(format(new Date(value), formatString));
    } else {
      setInputValue("");
    }
  }, [value, formatString]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ""}
      rules={{
        required: field.required ? "This field is required" : false,
      }}
      render={({ field: rhfField }) => (
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
                  let day = parts[0];
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
                  rhfField.onChange(val);
                  updateObject();
                  return;
                } catch (e) {
                  console.log(e);
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

            {Boolean(disabled) && (
              <Box sx={{ marginRight: "20px" }}>
                <Lock />
              </Box>
            )}
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
      )}
    />
  );
}

export default HFDatePickerNew;
