import React from "react";
import {FieldLabel} from "../Form";
import {generateLangaugeText} from "../../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import HFTextField from "../../../../../components/FormElements/HFTextField";

function GithubContent({settingLan, control}) {
  const {i18n} = useTranslation();
  return (
    <>
      <FieldLabel
        children={
          generateLangaugeText(settingLan, i18n?.language, "Github username") ||
          "Github username"
        }
      />
      <HFTextField
        control={control}
        name="integration_resource.username"
        fullWidth
        inputProps={{
          placeholder: "Github username",
        }}
      />

      <FieldLabel
        children={
          generateLangaugeText(settingLan, i18n?.language, "Token") || "Token"
        }
      />
      <HFTextField
        control={control}
        required
        disabled={Boolean(token)}
        name="token"
        fullWidth
        inputProps={{
          placeholder: "Token",
        }}
      />
    </>
  );
}

export default GithubContent;
