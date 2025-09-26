import {Box, Select, MenuItem, ListSubheader} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import styles from "./style.module.scss";

function HFStatusField({
  field = {},
  control,
  name,
  updateObject = () => {},
  newUi,
  disabled = false,
}) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, value}, fieldState: {error}}) => {
          return (
            <Select
              disabled={disabled}
              id="statusField"
              className={styles.statusSelect}
              key={value}
              sx={{
                height: newUi ? "25px" : "41px",
                border: "none",
                backgroundColor: "inherit",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  borderRadius: "4px",
                },
              }}
              value={value || ""}
              onChange={(e) => {
                onChange(e.target.value);
                updateObject();
              }}
              fullWidth
              renderValue={(selected) => {
                const selectedOption =
                  field?.attributes?.todo?.options?.find(
                    (el) => el.label === selected
                  ) ||
                  field?.attributes?.progress?.options?.find(
                    (el) => el.label === selected
                  ) ||
                  field?.attributes?.complete?.options?.find(
                    (el) => el.label === selected
                  );

                return (
                  <Box
                    sx={{
                      background: selectedOption
                        ? `${selectedOption.color}30`
                        : "transparent",
                      color: selectedOption?.color || "#000",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}>
                    {selected}
                  </Box>
                );
              }}>
              <ListSubheader className={styles.selectGroup}>
                To do
              </ListSubheader>
              {field?.attributes?.todo?.options?.map((el) => (
                <MenuItem
                  id={el?.label ?? "selectOptionTodo"}
                  style={{
                    background: `${el?.color}30`,
                    color: el?.color ? el?.color : "#000",
                  }}
                  className={styles.optionField}
                  key={el?.label}
                  value={el?.label}>
                  {el?.label}
                </MenuItem>
              ))}

              <ListSubheader className={styles.selectGroup}>
                In Progress
              </ListSubheader>
              {field?.attributes?.progress?.options?.map((el) => (
                <MenuItem
                  id={el?.label ?? "selectOptionProgress"}
                  style={{
                    background: `${el?.color}30`,
                    color: el?.color ? el?.color : "#000",
                  }}
                  className={styles.optionField}
                  key={el?.label}
                  value={el?.label}>
                  {el?.label}
                </MenuItem>
              ))}

              <ListSubheader className={styles.selectGroup}>
                Complete
              </ListSubheader>
              {field?.attributes?.complete?.options?.map((el) => (
                <MenuItem
                  id={el?.label ?? "selectOptionComplete"}
                  style={{
                    background: `${el?.color}30`,
                    color: el?.color ? el?.color : "#000",
                  }}
                  className={styles.optionField}
                  key={el?.label}
                  value={el?.label}>
                  {el?.label}
                </MenuItem>
              ))}
            </Select>
          );
        }}
      />
    </>
  );
}

export default HFStatusField;
