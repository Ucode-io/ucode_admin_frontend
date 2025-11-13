import {Box, Select, MenuItem, ListSubheader} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import styles from "./style.module.scss";
import useDebounce from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";

function HFStatusField({
  field = {},
  control,
  name,
  newUi,
  disabled = false,
  placeholder = "",
  drawerDetail = false,
  updateObject = () => {},
}) {
  const inputUpdateObject = useDebounce(() => updateObject(), 500);

  const { i18n } = useTranslation();

  return (
    <Box sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <Select
              placeholder={placeholder}
              disabled={disabled}
              id="statusField"
              className={styles.statusSelect}
              sx={{
                width: "100%",
                height: newUi ? "25px" : "15px",
                border: "none",
                padding: drawerDetail ? "0 2.6px" : "0",
                backgroundColor: "inherit",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  borderRadius: "4px",
                  cursor: disabled ? "not-allowed" : "pointer",
                },
              }}
              value={value || ""}
              onChange={(e) => {
                onChange(e.target.value);
                inputUpdateObject();
              }}
              fullWidth
              renderValue={(selected) => {
                const isArray = Array.isArray(selected);
                const selectedOption =
                  field?.attributes?.todo?.options?.find(
                    (el) =>
                      (el?.value || el?.label) ===
                      (isArray ? selected[0] : selected),
                  ) ||
                  field?.attributes?.progress?.options?.find(
                    (el) =>
                      (el?.value || el?.label) ===
                      (isArray ? selected[0] : selected),
                  ) ||
                  field?.attributes?.complete?.options?.find(
                    (el) =>
                      (el?.value || el?.label) ===
                      (isArray ? selected[0] : selected),
                  );

                return (
                  <Box
                    sx={{
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: selectedOption
                        ? `${selectedOption.color}30`
                        : "transparent",
                      color: selectedOption?.color || "#000",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                    }}
                  >
                    {selectedOption?.[`label_${i18n?.language}`] ||
                      selectedOption?.label}
                  </Box>
                );
              }}
            >
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
                  key={el?.value || el?.label}
                  value={el?.value || el?.label}
                >
                  {el?.[`label_${i18n?.language}`] || el?.label}
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
                  key={el?.value || el?.label}
                  value={el?.value || el?.label}
                >
                  {el?.[`label_${i18n?.language}`] || el?.label}
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
                  key={el?.value || el?.label}
                  value={el?.value || el?.label}
                >
                  {el?.[`label_${i18n?.language}`] || el?.label}
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
