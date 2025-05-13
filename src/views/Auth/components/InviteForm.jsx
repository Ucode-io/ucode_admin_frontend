import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {InputAdornment} from "@mui/material";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSearchParams} from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFTextFieldLogin from "../../../components/FormElements/HFTextFieldLogin";
import inviteAuthUserService from "../../../services/auth/inviteAuthUserService";
import {showAlert} from "../../../store/alert/alert.thunk";
import {loginAction} from "../../../store/auth/auth.thunk";
import classes from "../style.module.scss";
import ExternalAuth from "./LoginFormDesign/ExternalAuth";

const InviteForm = () => {
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const {control, handleSubmit} = useForm();
  const roleId = searchParams.get("role_id");
  const project_id = searchParams.get("project-id");
  const envId = searchParams.get("env_id");
  const clientTypeId = searchParams.get("client_type_id");

  const userInviteLogin = (data) => {
    setIsloading(true);
    inviteAuthUserService
      .login({
        data,
        params: {
          projectId: project_id,
        },
        Headers: {
          "environment-id": envId,
        },
      })
      .then((res) => {
        dispatch(
          loginAction({
            username: data?.login,
            password: data?.password,
            project_id: project_id,
            client_type: res?.client_type?.id,
            environment_id: envId,
          })
        );
        dispatch(showAlert("User successfully created", "success"));
      })
      .catch((err) => {
        dispatch(showAlert("Something went wrong on changing password"));
      })
      .finally(() => setIsloading(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      type: "login",
      role_id: roleId,
      client_type_id: clientTypeId,
    };

    userInviteLogin(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.formRow}>
          <p className={classes.label}>Create Login</p>
          <HFTextFieldLogin
            required
            control={control}
            name="login"
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
          <p className={classes.label}>Create password</p>
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
          <ExternalAuth />
        </div>

        <div className={classes.buttonsArea}>
          {isLoading ? (
            <PrimaryButton type={"button"} loader={isLoading} size="large">
              {t("enter")}
            </PrimaryButton>
          ) : (
            <PrimaryButton size="large">{t("enter")}</PrimaryButton>
          )}
        </div>
      </form>
    </>
  );
};

export default InviteForm;
