import {Box, InputAdornment} from "@mui/material";
import React from "react";
import styles from "./style.module.scss";
import HFTextFieldLogin from "../../../../../components/FormElements/HFTextFieldLogin";
import {useTranslation} from "react-i18next";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";

function NewPasswordComponent({
  loading = false,
  control,
  resetPassword = () => {},
}) {
  const {t} = useTranslation();
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: "64px",
          textAlign: "center",
        }}>
        <h3
          style={{
            fontSize: "24px",
            color: "#101828",
            marginBottom: "8px",
          }}>
          Новый пароль
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#475467",
          }}>
          Придумайте и подтвердите новый пароль
        </p>
      </Box>
      <Box sx={{marginTop: "24px"}}>
        <div className={styles.formRow}>
          <p className={styles.label}>{t("Пароль*")}</p>
          <HFTextFieldLogin
            required
            control={control}
            name="new_password"
            type="password"
            fullWidth
            placeholder={t("Придумайте пароль")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src="/img/passcode-lock.svg" height={"23px"} alt="" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={styles.formRow}>
          <p className={styles.label}>{t("Подтвердите пароль*")}</p>
          <HFTextFieldLogin
            required
            control={control}
            name="confirm_password"
            type="password"
            fullWidth
            placeholder={t("Введите пароль еще раз")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src="/img/passcode-lock.svg" height={"23px"} alt="" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Box>
      <Box sx={{textAlign: "center", marginTop: "24px"}}>
        <PrimaryButton
          size="large"
          onClick={(e) => {
            e.preventDefault();
            resetPassword();
          }}
          style={{
            width: "100%",
            marginTop: "24px",
            borderRadius: "8px",
          }}
          loader={loading}>
          Подтвердить
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default NewPasswordComponent;
