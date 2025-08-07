import CloseIcon from "@mui/icons-material/Close";
import {Box, Popover} from "@mui/material";
import {format} from "date-fns";
import React, {useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {HFDayPicker} from "./HFDayPicker";
import HFMonthPicker from "./HFMonthPicker";
import HFQuarterPicker from "./HFQuarterPicker";
import HFYearPicker from "./HFYearPicker";
import styles from "./style.module.scss";
import {Controller, useWatch} from "react-hook-form";

function HFDatePickerNew({
  isFormEdit,
  isBlackBg,
  control,
  name,
  field,
  showCopyBtn,
  disabled = false,
  required = false,
  placeholder = "",
  defaultValue = "",
  isNewTableView = false,
  isTransparent = false,
  updateObject = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };
  const value = useWatch({
    control,
    name: name,
  });

  return (
    <>
      <Box>
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: "12px",
            height: "32px",
          }}>
          <span>
            {isValidDate(value) ? (
              `${format(new Date(value), "dd.MM.yyyy HH:mm:ss")}`
            ) : (
              <span style={{color: "#909EAB"}}>{"DD.MM.YYYY HH:mm:ss"}</span>
            )}
          </span>

          {Boolean(value?.$gte && value?.$lt) && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              sx={{
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <CloseIcon style={{height: "16px", width: "16px"}} />
            </Box>
          )}
        </Box>

        <Popover
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}>
          <Box
            sx={{
              width: "210px",
              height: "250px",
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
              <TabPanel sx={{height: "200px", width: "100%"}}>
                <HFDayPicker
                  control={control}
                  name={name}
                  field={field}
                  placeholder={field?.label}
                  updateObject={updateObject}
                  withTime={true}
                />
              </TabPanel>
              <TabPanel sx={{height: "100px", width: "100%"}}>
                <HFMonthPicker
                  control={control}
                  name={name}
                  field={field}
                  placeholder={field?.label}
                  updateObject={updateObject}
                  withTime={true}
                />
              </TabPanel>
              <TabPanel sx={{height: "100px", width: "100%"}}>
                <HFQuarterPicker
                  control={control}
                  name={name}
                  field={field}
                  placeholder={field?.label}
                  updateObject={updateObject}
                  withTime={true}
                />
              </TabPanel>
              <TabPanel sx={{height: "100px", width: "100%"}}>
                <HFYearPicker
                  control={control}
                  name={name}
                  field={field}
                  placeholder={field?.label}
                  updateObject={updateObject}
                  withTime={true}
                />
              </TabPanel>
            </Tabs>
          </Box>
        </Popover>
      </Box>
    </>
  );
}

export default HFDatePickerNew;
