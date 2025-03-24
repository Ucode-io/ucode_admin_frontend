import React from "react";
import styles from "./style.module.scss";
import {Box, Select, MenuItem, ListSubheader} from "@mui/material";

function HFStatusFieldEditor({value, setValue, colDef} = props) {
  return (
    <Box>
      <Select
        className={styles.statusSelect}
        sx={{
          width: "100%",
          height: "32px",
          border: "none",
          borderRadius: "0px",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            // padding: "8px 8px 8px 8px",
            // borderRadius: "4px",
          },
        }}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        fullWidth
        renderValue={(selected) => {
          const selectedOption =
            colDef?.cellRendererParams?.field?.attributes?.todo?.options?.find(
              (el) => el.label === selected
            ) ||
            colDef?.cellRendererParams?.field?.attributes?.progress?.options?.find(
              (el) => el.label === selected
            ) ||
            colDef?.cellRendererParams?.field?.attributes?.complete?.options?.find(
              (el) => el.label === selected
            );

          return (
            <Box
              sx={{
                background: selectedOption
                  ? `${selectedOption.color}30`
                  : "transparent",
                color: selectedOption?.color || "#000",
                padding: "0px 6px 0px 6px",
                borderRadius: "4px",
              }}>
              {selected}
            </Box>
          );
        }}>
        <ListSubheader className={styles.selectGroup}>To do</ListSubheader>
        {colDef?.cellRendererParams?.field?.attributes?.todo?.options?.map(
          (el) => (
            <MenuItem
              key={el?.id}
              style={{
                background: `${el?.color}30`,
                color: el?.color ? el?.color : "#000",
              }}
              className={styles.optionField}
              value={el?.label}>
              {el?.label}
            </MenuItem>
          )
        )}

        <ListSubheader className={styles.selectGroup}>
          In Progress
        </ListSubheader>
        {colDef?.cellRendererParams?.field?.attributes?.progress?.options?.map(
          (el) => (
            <MenuItem
              key={el?.id}
              style={{
                background: `${el?.color}30`,
                color: el?.color ? el?.color : "#000",
              }}
              className={styles.optionField}
              value={el?.label}>
              {el?.label}
            </MenuItem>
          )
        )}

        <ListSubheader className={styles.selectGroup}>Complete</ListSubheader>
        {colDef?.cellRendererParams?.field?.attributes?.complete?.options?.map(
          (el) => (
            <MenuItem
              key={el?.id}
              style={{
                background: `${el?.color}30`,
                color: el?.color ? el?.color : "#000",
              }}
              className={styles.optionField}
              value={el?.label}>
              {el?.label}
            </MenuItem>
          )
        )}
      </Select>
    </Box>
  );
}

export default HFStatusFieldEditor;
