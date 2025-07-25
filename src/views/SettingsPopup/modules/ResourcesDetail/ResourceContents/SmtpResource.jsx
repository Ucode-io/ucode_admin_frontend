import React from "react";
import {generateLangaugeText} from "../../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import HFNumberField from "../../../../../components/FormElements/HFNumberField";
import {Box} from "@mui/material";
import HFTextField from "../../../../../components/FormElements/HFTextField";

function SmtpResource({settingLan, control}) {
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
      <Box width={"48%"}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Email") || "Email"
          }
        />
        <HFTextField
          control={control}
          required
          name={`settings.smtp.email`}
          fullWidth
          inputProps={{
            placeholder: "Email",
          }}
        />
      </Box>

      <Box width={"48%"}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Password") ||
            "Password"
          }
        />

        <HFTextField
          control={control}
          required
          name="settings.smtp.password"
          fullWidth
          inputProps={{
            placeholder: "Password",
          }}
        />
      </Box>

      <Box width={"48%"}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Default otp") ||
            "Default otp"
          }
        />
        <HFTextField
          control={control}
          required
          name={`settings.smtp.default_otp`}
          fullWidth
          inputProps={{
            placeholder: "Default otp",
          }}
        />
      </Box>

      <Box width={"48%"}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Number of otp") ||
            "Number of otp"
          }
        />
        <HFNumberField
          control={control}
          required
          name="settings.smtp.number_of_otp"
          fullWidth
          type="number"
          inputProps={{
            placeholder: "Number of otp",
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

export default SmtpResource;
