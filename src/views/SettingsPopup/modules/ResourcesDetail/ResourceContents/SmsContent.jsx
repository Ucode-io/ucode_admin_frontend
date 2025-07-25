import {Box} from "@mui/material";
import React from "react";
import {generateLangaugeText} from "../../../../../utils/generateLanguageText";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import HFNumberField from "../../../../../components/FormElements/HFNumberField";
import {FieldLabel} from "../Form";
import {useTranslation} from "react-i18next";

function SmsContent({settingLan, control}) {
  const {i18n} = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "space-between",
      }}>
      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Default otp") ||
            "Default otp"
          }
        />
        <HFTextField
          control={control}
          required
          name={`settings.sms.default_otp`}
          fullWidth
          inputProps={{
            placeholder: "Default otp",
          }}
        />
      </Box>

      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Login") || "Login"
          }
        />
        <HFTextField
          control={control}
          required
          name="settings.sms.login"
          fullWidth
          inputProps={{
            placeholder: "Login",
          }}
        />
      </Box>

      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Number of otp") ||
            "Number of otp"
          }
        />
        <HFNumberField
          control={control}
          required
          name="settings.sms.number_of_otp"
          fullWidth
          type="number"
          inputProps={{
            placeholder: "Number of otp",
          }}
        />
      </Box>

      <Box sx={{width: "48%"}}>
        <FieldLabel
          children={
            generateLangaugeText(settingLan, i18n?.language, "Originator") ||
            "Originator"
          }
        />
        <HFTextField
          control={control}
          required
          name="settings.sms.originator"
          fullWidth
          inputProps={{
            placeholder: "Originator",
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
        <HFTextField
          control={control}
          required
          name="settings.sms.password"
          fullWidth
          inputProps={{
            placeholder: "Password",
          }}
        />
      </Box>
    </Box>
  );
}

export default SmsContent;
