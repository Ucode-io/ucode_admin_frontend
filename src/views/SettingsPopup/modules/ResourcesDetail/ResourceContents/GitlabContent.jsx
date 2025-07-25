import React from "react";
import {FieldLabel} from "../Form";
import {generateLangaugeText} from "../../../../../utils/generateLanguageText";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import {useTranslation} from "react-i18next";

function GitLabContent({settingLan, control}) {
  const {i18n} = useTranslation();
  return (
    <>
      <FieldLabel
        children={
          generateLangaugeText(settingLan, i18n?.language, "Gitlab username") ||
          "Gitlab username"
        }
      />
      <HFTextField
        control={control}
        name="integration_resource.username"
        fullWidth
        disabled
        inputProps={{
          placeholder: "Gitlab username",
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
        disabled
        name="token"
        fullWidth
        inputProps={{
          placeholder: "Token",
        }}
      />
    </>
  );
}

export default GitLabContent;
