import React from "react";
import styles from "./style.module.scss";
import { Box, Select, MenuItem, ListSubheader } from "@mui/material";
import RowClickButton from "../RowClickButton";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import { useTranslation } from "react-i18next";

function HFStatusFieldEditor({ value, setValue, colDef, data }) {
  const { i18n } = useTranslation();

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  // Извлекаем объект поля и его атрибуты (пути могут варьироваться в зависимости от настроек таблицы)
  const field = colDef?.fieldObj;
  const attributes =
    field?.attributes || colDef?.cellRendererParams?.field?.attributes;
  const disabled = field?.disabled;

  // Хелпер для поиска опции (копируем логику из рабочего компонента)
  const findOption = (selected) => {
    const allOptions = [
      ...(attributes?.todo?.options || []),
      ...(attributes?.progress?.options || []),
      ...(attributes?.complete?.options || []),
    ];
    return allOptions.find((el) =>
      el?.value ? el?.value === selected : selected === el?.label,
    );
  };

  return (
    <MaterialUIProvider>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: "#0000",
          position: "relative", // Для корректного позиционирования иконки замка
          "&:hover .rowClickButton": {
            display: "block",
          },
        }}
      >
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
                padding: "0px 8px", // Немного отступа для красоты
              },
            }}
            value={value || ""}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            fullWidth
            renderValue={(selected) => {
              const selectedOption = findOption(selected);
              return (
                <Box
                  sx={{
                    background: selectedOption
                      ? `${selectedOption.color}30`
                      : "transparent",
                    color: selectedOption?.color || "#000",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    lineHeight: "1",
                  }}
                >
                  {selectedOption?.[`label_${i18n.language}`] ||
                    selectedOption?.label ||
                    selected}
                </Box>
              );
            }}
          >
            {/* Группа TO DO */}
            <ListSubheader className={styles.selectGroup}>To do</ListSubheader>
            {attributes?.todo?.options?.map((el) => (
              <MenuItem
                key={el?.value || el?.label}
                id={el?.value ?? "selectOptionTodo"}
                style={{
                  background: `${el?.color}30`,
                  color: el?.color ? el?.color : "#000",
                }}
                className={styles.optionField}
                value={el?.value || el?.label}
              >
                {el?.[`label_${i18n.language}`] || el?.label}
              </MenuItem>
            ))}

            {/* Группа IN PROGRESS */}
            <ListSubheader className={styles.selectGroup}>
              In Progress
            </ListSubheader>
            {attributes?.progress?.options?.map((el) => (
              <MenuItem
                key={el?.value || el?.label}
                id={el?.value ?? "selectOptionProgress"}
                style={{
                  background: `${el?.color}30`,
                  color: el?.color ? el?.color : "#000",
                }}
                className={styles.optionField}
                value={el?.value || el?.label}
              >
                {el?.[`label_${i18n.language}`] || el?.label}
              </MenuItem>
            ))}

            {/* Группа COMPLETE */}
            <ListSubheader className={styles.selectGroup}>
              Complete
            </ListSubheader>
            {attributes?.complete?.options?.map((el) => (
              <MenuItem
                key={el?.value || el?.label}
                id={el?.value ?? "selectOptionComplete"}
                style={{
                  background: `${el?.color}30`,
                  color: el?.color ? el?.color : "#000",
                }}
                className={styles.optionField}
                value={el?.value || el?.label}
              >
                {el?.[`label_${i18n.language}`] || el?.label}
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
              background: "#fff",
              pointerEvents: "none", // Чтобы замок не мешал клику
            }}
          >
            <img
              src="/table-icons/lock.svg"
              style={{ width: "20px", height: "20px" }}
              alt="lock"
            />
          </Box>
        )}

        <RowClickButton onRowClick={onNavigateToDetail} right="25px" />
      </Box>
    </MaterialUIProvider>
  );
}

export default React.memo(HFStatusFieldEditor);