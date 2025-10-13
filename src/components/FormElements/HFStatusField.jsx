import {Box, Select, MenuItem, ListSubheader} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";

function HFStatusField({
  field = {},
  control,
  name,
  updateObject = () => {},
  newUi,
  disabled = false,
}) {
  const { i18n } = useTranslation();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <Select
              disabled={disabled}
              id="statusField"
              className={styles.statusSelect}
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
                    (el) => el[`label_${i18n?.language}`] === selected
                  ) ||
                  field?.attributes?.progress?.options?.find(
                    (el) => el[`label_${i18n?.language}`] === selected
                  ) ||
                  field?.attributes?.complete?.options?.find(
                    (el) => el[`label_${i18n?.language}`] === selected
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
                    }}
                  >
                    {selected}
                  </Box>
                );
              }}
            >
              <ListSubheader className={styles.selectGroup}>
                To do
              </ListSubheader>
              {field?.attributes?.todo?.options?.map((el) => (
                <MenuItem
                  id={el?.[`label_${i18n.language}`] ?? "selectOptionTodo"}
                  style={{
                    background: `${el?.color}30`,
                    color: el?.color ? el?.color : "#000",
                  }}
                  className={styles.optionField}
                  key={el?.[`label_${i18n.language}`]}
                  value={el?.[`label_${i18n.language}`]}
                >
                  {el?.[`label_${i18n.language}`]}
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
                  key={el?.[`label_${i18n.language}`]}
                  value={el?.[`label_${i18n.language}`]}
                >
                  {el?.[`label_${i18n.language}`]}
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
                  key={el?.[`label_${i18n.language}`]}
                  value={el?.[`label_${i18n.language}`]}
                >
                  {el?.[`label_${i18n.language}`]}
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
