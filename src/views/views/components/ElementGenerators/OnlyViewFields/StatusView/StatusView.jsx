import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export const StatusView = ({ row }) => {

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
}