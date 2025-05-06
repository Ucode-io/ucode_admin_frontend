import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {InputAdornment} from "@mui/material";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFTextFieldLogin from "../../../components/FormElements/HFTextFieldLogin";
import authService from "../../../services/auth/authService";
import {showAlert} from "../../../store/alert/alert.thunk";
import classes from "../style.module.scss";
import ExternalAuth from "./LoginFormDesign/ExternalAuth";
import inviteAuthUserService from "../../../services/auth/inviteAuthUserService";

const InviteForm = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [inputMatch, setInputMatch] = useState(false);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const {control, handleSubmit} = useForm();
  const urlParams = new URLSearchParams(location.search);
  const roleId = searchParams.get("role_id");
  const project_id = searchParams.get("pr_id");
  const envId = searchParams.get("env_id");
  const clientTypeId = searchParams.get("client_type_id");

  const userInviteLogin = (data) => {
    inviteAuthUserService
      .login({
        data,
        projectId: project_id,
        params: {
          Headers: {
            " environment-id": envId,
          },
        },
      })
      .then((res) => {
        dispatch(showAlert("Password successfuly updated", "success"));
        // navigate("/login");
      })
      .catch((err) => {
        dispatch(showAlert("Something went wrong on changing password"));
      });
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
          <PrimaryButton size="large">{t("enter")}</PrimaryButton>
        </div>
      </form>
    </>
  );
};

export default InviteForm;
