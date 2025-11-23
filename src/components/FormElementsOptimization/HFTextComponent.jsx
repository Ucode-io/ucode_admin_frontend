import {Box} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function HFTextComponent({ row = {} }) {
  const { i18n } = useTranslation();
  return (
    <Box sx={{ width: "100%", height: "100%", padding: "0 0 0 15px" }}>
      {row?.attributes?.[`label_${i18n?.language}`] ?? row?.label}
    </Box>
  );
}

export default HFTextComponent;
