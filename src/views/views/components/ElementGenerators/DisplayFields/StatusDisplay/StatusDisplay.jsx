import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

import cls from "./styles.module.scss";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const StatusDisplay = ({ row, onClick = () => {} }) => {

  const { i18n } = useTranslation();

  const selected = row?.value;

  const selectedOption =
    row?.attributes?.todo?.options?.find((el) =>
      el?.value ? el?.value === selected : selected === el?.label,
    ) ||
    row?.attributes?.progress?.options?.find((el) =>
      el?.value ? el?.value === selected : selected === el?.label,
    ) ||
    row?.attributes?.complete?.options?.find((el) =>
      el?.value ? el?.value === selected : selected === el?.label,
    );

  return (
    <Box
      className={cls.statusDisplay}
      onClick={onClick}
    >
      <span 
        className={cls.statusBadge}
        style={{
          background: selectedOption
            ? `${selectedOption.color}30`
            : "transparent",
          color: selectedOption?.color || "#000",
        }}
      >
        {selectedOption?.[`label_${i18n.language}`] ||
          selectedOption?.label ||
          selected}
      </span>
      <ChevronDownIcon fontSize="19px" color="rgb(99, 115, 129)" />
    </Box>
  );
}