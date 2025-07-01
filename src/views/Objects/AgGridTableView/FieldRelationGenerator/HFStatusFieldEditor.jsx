import React from "react";
import styles from "./style.module.scss";
import {Box, Select, MenuItem, ListSubheader} from "@mui/material";
import RowClickButton from "../RowClickButton";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";

function HFStatusFieldEditor({value, setValue, colDef, data}) {
  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  const field = colDef?.fieldObj;
  const disabled = field?.disabled;
  return (
    <MaterialUIProvider>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: "#0000",

          "&:hover .rowClickButton": {
            display: "block",
          },
        }}>
        {" "}
        <Box>
          <Select
            disabled={disabled}
            className={styles.statusSelect}
            sx={{
              width: "100%",
              height: "32px",
              border: "none",
              background: "transparent",
              borderRadius: "0px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
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
            {field?.attributes?.progress?.options?.map((el) => (
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
            ))}

            <ListSubheader className={styles.selectGroup}>
              Complete
            </ListSubheader>
            {field?.attributes?.complete?.options?.map((el) => (
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
            ))}
          </Select>
        </Box>
        {disabled && (
          <Box
            sx={{
              position: "absolute",
              top: "4px",
              right: "10px",
              height: "20px",
              width: "20px",
              borderRadius: "4px",
              overflow: "hidden",
              padding: "0 0 0 0",
              background: "#fff",
            }}>
            <img
              src="/table-icons/lock.svg"
              style={{width: "20px", height: "20px"}}
              alt="lock"
            />
          </Box>
        )}
        {/* {colDef?.colIndex === 0 && ( */}
        <RowClickButton onRowClick={onNavigateToDetail} right="25px" />
        {/* )} */}
      </Box>
    </MaterialUIProvider>
  );
}

export default HFStatusFieldEditor;
