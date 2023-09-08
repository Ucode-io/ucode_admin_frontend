import { AccountCircle, Lock } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFTextField from "../../../components/FormElements/HFTextField";
import classes from "../style.module.scss";

const Inv = ({ setIndex, index, setFormType, formType }) => {
  const { t } = useTranslation();

  const { control, handleSubmit, watch, setValue, reset, getValues } =
    useForm();

  return (
    <>
      <form onSubmit={handleSubmit()} className={classes.form}>
        <div className={classes.formRow}>
          <p className={classes.label}>Old password</p>
          <HFTextField
            required
            control={control}
            name="username"
            size="large"
            fullWidth
            placeholder={t("enter.login")}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>New password</p>
          <HFTextField
            required
            control={control}
            name="password"
            type="password"
            size="large"
            fullWidth
            placeholder={t("enter.password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>Confirm password</p>
          <HFTextField
            required
            control={control}
            name="password"
            type="password"
            size="large"
            fullWidth
            placeholder={t("enter.password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className={classes.buttonsArea}>
          <PrimaryButton size="large">{t("enter")}</PrimaryButton>
        </div>
      </form>
    </>
  );
};

export default Inv;
