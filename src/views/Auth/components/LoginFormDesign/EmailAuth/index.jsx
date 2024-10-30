import React from "react";
import {InputAdornment} from "@mui/material";
import classes from "../style.module.scss";
import {useTranslation} from "react-i18next";
import HFTextFieldLogin from "../../../../../components/FormElements/HFTextFieldLogin";
import ExternalAuth from "../ExternalAuth";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";

function EmailAuth({control, setFormType = () => {}, loading = false}) {
  const {t} = useTranslation();
  return (
    <>
      <div className={classes.formRow}>
        <p className={classes.label}>{t("Почтовый адрес*")}</p>
        <HFTextFieldLogin
          required
          control={control}
          name="email"
          fullWidth
          type="email"
          placeholder={t("enter.email")}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src="/img/mail.svg" height={"23px"} alt="" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <PrimaryButton
        size="large"
        style={{width: "100%", marginTop: "16px", borderRadius: "8px"}}
        loader={loading}>
        {t("enter")}
      </PrimaryButton>
      <ExternalAuth setFormType={setFormType} />
    </>
  );
}

export default EmailAuth;
