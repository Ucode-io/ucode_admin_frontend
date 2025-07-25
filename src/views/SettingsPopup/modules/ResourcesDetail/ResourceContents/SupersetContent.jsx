import {Box} from "@mui/material";
import React from "react";
import {generateLangaugeText} from "../../../../../utils/generateLanguageText";
import HFResourceField from "../../../../../components/FormElements/HFResourceField";
import {FieldLabel} from "../Form";
import {useTranslation} from "react-i18next";

function SupersetContent({settingLan, control}) {
  const {i18n} = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
      }}>
      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Link") || "Link"
          }
        />
        <HFResourceField
          isLink={true}
          control={control}
          required
          disabled
          name="settings.superset.url"
          fullWidth
          inputProps={{
            placeholder: "URL",
          }}
        />
      </Box>
      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Username") ||
            "Username"
          }
        />
        <HFResourceField
          control={control}
          required
          disabled
          name="settings.superset.username"
          fullWidth
          inputProps={{
            placeholder: "Username",
          }}
        />
      </Box>
      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Password") ||
            "Password"
          }
        />
        <HFResourceField
          control={control}
          required
          disabled
          name="settings.superset.password"
          fullWidth
          inputProps={{
            placeholder: "Password",
          }}
        />
      </Box>
    </Box>
  );
}

export default SupersetContent;
