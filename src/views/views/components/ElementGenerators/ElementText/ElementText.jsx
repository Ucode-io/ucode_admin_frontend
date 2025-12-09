import {Box} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const ElementText = ({ row = {}, value }) => {
  const { i18n } = useTranslation();
  return (
    <Box>
      {value ?? row?.attributes?.[`label_${i18n?.language}`] ?? row?.label}
    </Box>
  );
};
