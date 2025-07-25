import {Box} from "@mui/material";
import React from "react";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import HFResourceField from "../../../../components/FormElements/HFResourceField";

function MetabaseContent({settingLan, control}) {
  const {i18n} = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "10px",
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
          name="settings.metabase.url"
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
          name="settings.metabase.username"
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
          name="settings.metabase.password"
          fullWidth
          inputProps={{
            placeholder: "Password",
          }}
        />
      </Box>
    </Box>
  );
}

const FieldLabel = ({children}) => {
  return (
    <>
      <Box sx={{fontSize: "14px", marginBottom: "15px"}}>{children}</Box>
    </>
  );
};

export default MetabaseContent;
