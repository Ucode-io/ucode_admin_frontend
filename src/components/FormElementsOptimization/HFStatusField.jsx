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
  handleChange,
  row,
  index,
}) {
  const { i18n } = useTranslation();

  const onChange = (e) => {
    const value = e.target.value

    handleChange({
      value,
      name: field?.slug,
      rowId: row?.guid,
    })
  }

  return (
    <>
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
      value={row?.[field?.slug] || ""}
      // value={row?.[field?.slug]}
      onChange={onChange}
      fullWidth
      renderValue={(selected) => {
        const selectedOption =
          field?.attributes?.todo?.options?.find((el) =>
            el?.value ? el?.value === selected : selected === el?.label
          ) ||
          field?.attributes?.progress?.options?.find((el) =>
            el?.value ? el?.value === selected : selected === el?.label
          ) ||
          field?.attributes?.complete?.options?.find((el) =>
            el?.value ? el?.value === selected : selected === el?.label
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
            {selectedOption?.[`label_${i18n.language}`] ||
              selectedOption?.label ||
              selected}
          </Box>
        );
      }}
    >
      <ListSubheader className={styles.selectGroup}>
        To do
      </ListSubheader>
      {field?.attributes?.todo?.options?.map((el) => {
        return (
          <MenuItem
            id={el?.value ?? "selectOptionTodo"}
            style={{
              background: `${el?.color}30`,
              color: el?.color ? el?.color : "#000",
            }}
            className={styles.optionField}
            key={el?.value}
            value={el?.value || el?.label}
          >
            {el?.[`label_${i18n.language}`] || el?.label}
          </MenuItem>
        );
      })}

      <ListSubheader className={styles.selectGroup}>
        In Progress
      </ListSubheader>
      {field?.attributes?.progress?.options?.map((el) => (
        <MenuItem
          id={el?.value ?? "selectOptionProgress"}
          style={{
            background: `${el?.color}30`,
            color: el?.color ? el?.color : "#000",
          }}
          className={styles.optionField}
          key={el?.value}
          value={el?.value || el?.label}
        >
          {el?.[`label_${i18n.language}`] || el?.label}
        </MenuItem>
      ))}

      <ListSubheader className={styles.selectGroup}>
        Complete
      </ListSubheader>
      {field?.attributes?.complete?.options?.map((el) => (
        <MenuItem
          id={el?.value ?? "selectOptionComplete"}
          style={{
            background: `${el?.color}30`,
            color: el?.color ? el?.color : "#000",
          }}
          className={styles.optionField}
          key={el?.value}
          value={el?.value || el?.label}
        >
          {el?.[`label_${i18n.language}`] || el?.label}
        </MenuItem>
      ))}
    </Select>
      {/* <Controller
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
                  field?.attributes?.todo?.options?.find((el) =>
                    el?.value ? el?.value === selected : selected === el?.label
                  ) ||
                  field?.attributes?.progress?.options?.find((el) =>
                    el?.value ? el?.value === selected : selected === el?.label
                  ) ||
                  field?.attributes?.complete?.options?.find((el) =>
                    el?.value ? el?.value === selected : selected === el?.label
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
                    {selectedOption?.[`label_${i18n.language}`] ||
                      selectedOption?.label ||
                      selected}
                  </Box>
                );
              }}
            >
              <ListSubheader className={styles.selectGroup}>
                To do
              </ListSubheader>
              {field?.attributes?.todo?.options?.map((el) => {
                return (
                  <MenuItem
                    id={el?.value ?? "selectOptionTodo"}
                    style={{
                      background: `${el?.color}30`,
                      color: el?.color ? el?.color : "#000",
                    }}
                    className={styles.optionField}
                    key={el?.value}
                    value={el?.value || el?.label}
                  >
                    {el?.[`label_${i18n.language}`] || el?.label}
                  </MenuItem>
                );
              })}

              <ListSubheader className={styles.selectGroup}>
                In Progress
              </ListSubheader>
              {field?.attributes?.progress?.options?.map((el) => (
                <MenuItem
                  id={el?.value ?? "selectOptionProgress"}
                  style={{
                    background: `${el?.color}30`,
                    color: el?.color ? el?.color : "#000",
                  }}
                  className={styles.optionField}
                  key={el?.value}
                  value={el?.value || el?.label}
                >
                  {el?.[`label_${i18n.language}`] || el?.label}
                </MenuItem>
              ))}

              <ListSubheader className={styles.selectGroup}>
                Complete
              </ListSubheader>
              {field?.attributes?.complete?.options?.map((el) => (
                <MenuItem
                  id={el?.value ?? "selectOptionComplete"}
                  style={{
                    background: `${el?.color}30`,
                    color: el?.color ? el?.color : "#000",
                  }}
                  className={styles.optionField}
                  key={el?.value}
                  value={el?.value || el?.label}
                >
                  {el?.[`label_${i18n.language}`] || el?.label}
                </MenuItem>
              ))}
            </Select>
          );
        }}
      /> */}
    </>
  );
}

export default HFStatusField;
