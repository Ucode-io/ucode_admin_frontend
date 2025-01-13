import {Box, Select, MenuItem, ListSubheader} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import styles from "./style.module.scss";

function HFStatusField({field = {}, control, name, updateObject = () => {}}) {
  return (
    <Box>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, value}, fieldState: {error}}) => {
          return (
            <Select
              className={styles.statusSelect}
              sx={{height: "41px", border: "none"}}
              value={value || ""}
              onChange={(e) => {
                onChange(e.target.value);
                updateObject();
              }}
              fullWidth>
              <ListSubheader className={styles.selectGroup}>
                To do
              </ListSubheader>
              {field?.attributes?.todo?.options?.map((el) => (
                <MenuItem
                  style={{
                    background: el?.label === value ? "#007aff" : "#eee",
                    color: el?.label === value ? "#fff" : "#000",
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
                  style={{
                    background: el?.label === value ? "#007aff" : "#eee",
                    color: el?.label === value ? "#fff" : "#000",
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
                  style={{
                    background: el?.label === value ? "#007aff" : "#eee",
                    color: el?.label === value ? "#fff" : "#000",
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
    </Box>
  );
}

export default HFStatusField;
