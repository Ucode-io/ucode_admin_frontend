import React from "react";
import HFTextFieldLogin from "../../../../components/FormElements/HFTextFieldLogin";
import {Box, Button, InputAdornment} from "@mui/material";
import {useTranslation} from "react-i18next";
import classes from "./style.module.scss";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import ExternalAuth from "./ExternalAuth";

function LoginTab({control, loading = false, setFormType = () => {}}) {
  const {t} = useTranslation();

  return (
    <>
      <div className={classes.formRow}>
        <p className={classes.label}>{t("Логин*")}</p>
        <HFTextFieldLogin
          required
          control={control}
          name="username"
          fullWidth
          placeholder={t("enter.login")}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src="/img/user-circle.svg" height={"23px"} alt="" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={classes.formRow}>
        <p className={classes.label}>{t("Пароль*")}</p>
        <HFTextFieldLogin
          required
          control={control}
          name="password"
          type="password"
          fullWidth
          placeholder={t("enter.password")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src="/img/passcode-lock.svg" height={"23px"} alt="" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}>
        <Button
          sx={{fontSize: "14px", fontWeight: 600}}
          variant="text"
          type="button"
          onClick={() => {
            setFormType("FORGOT_PASSWORD");
          }}>
          Забыли пароль?
        </Button>
      </Box>

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

export default LoginTab;
