import {Box, Popover} from "@mui/material";
import React, {useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./style.module.scss";
import YDatePicker from "./YDatePicker";
import YMonthPicker from "./YMonthPicker";
import YYearPicker from "./YYearPicker";
import {format} from "date-fns";
import YQuarterPicker from "./YQuarterPicker";

function YDateFilter({field, value, onChange = () => {}, name}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  return (
    <>
      <Box>
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid #eee",
            padding: "2px 8px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
          }}>
          <span>
            {isValidDate(value?.$gte) && isValidDate(value?.$lt) ? (
              `${format(new Date(value?.$gte), "dd.MM.yyyy")} - ${format(new Date(value?.$lt), "dd.MM.yyyy")}`
            ) : (
              <span style={{color: "#909EAB"}}>
                {"DD.MM.YYYY - DD.MM.YYYY"}
              </span>
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
              width: "205px",
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
                <YDatePicker
                  field={field}
                  placeholder={field?.label}
                  value={value}
                  onChange={(val) => {
                    console.log("vallll", val);
                    onChange(val, name);
                  }}
                  withTime={true}
                />
              </TabPanel>
              <TabPanel sx={{height: "100px", width: "100%"}}>
                <YMonthPicker
                  field={field}
                  placeholder={field?.label}
                  value={value}
                  onChange={(val) => onChange(val, name)}
                  withTime={true}
                />
              </TabPanel>
              <TabPanel sx={{height: "100px", width: "100%"}}>
                <YQuarterPicker
                  field={field}
                  placeholder={field?.label}
                  value={value}
                  onChange={(val) => onChange(val, name)}
                  withTime={true}
                />
              </TabPanel>
              <TabPanel sx={{height: "100px", width: "100%"}}>
                <YYearPicker
                  field={field}
                  placeholder={field?.label}
                  value={value}
                  onChange={(val) => onChange(val, name)}
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

export default YDateFilter;
