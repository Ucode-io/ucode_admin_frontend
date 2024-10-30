import React, {useState} from "react";
import HFTextFieldLogin from "../../../../components/FormElements/HFTextFieldLogin";
import {Box, Button, InputAdornment} from "@mui/material";
import {useTranslation} from "react-i18next";
import classes from "./style.module.scss";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import ExternalAuth from "./ExternalAuth";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function LoginTab({control, loading = false, setFormType = () => {}}) {
  const {t} = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? "text" : "password"}
          fullWidth
          placeholder={t("enter.password")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src="/img/passcode-lock.svg" height={"23px"} alt="" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <VisibilityOffIcon
                      style={{width: "19px", height: "19px"}}
                    />
                  ) : (
                    <img src="/img/eye.svg" height={"23px"} alt="" />
                  )}
                </div>
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
