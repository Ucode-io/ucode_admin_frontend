import {Box, InputAdornment} from "@mui/material";
import React, {useState} from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import styles from "./style.module.scss";
import HFTextFieldLogin from "../../../../../components/FormElements/HFTextFieldLogin";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {store} from "../../../../../store";
import authService from "../../../../../services/auth/authService";
import {showAlert} from "../../../../../store/alert/alert.thunk";
import OtpComponent from "./OtpComponent";
import NewPasswordComponent from "./NewPasswordComponent";

function ForgotPassword({setFormType = () => {}}) {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("login");
  const [otp, setOtp] = useState("");
  const dispatch = store.dispatch;

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
    reset,
  } = useForm();

  const backToLogin = (e) => {
    e.preventDefault();
    setFormType("LOGIN");
  };

  const onSubmit = (values) => {
    setLoading(true);

    if (values?.login) {
      authService
        .forgotPassword(values)
        .then((res) => {
          if (res?.email_found === true) {
            setViewType("otp");
            setValue("login", res);
            setFormType("EMAIL_OTP");
          } else if (!res.user_id) {
            store.dispatch(showAlert("Email is not valid!"));
          } else if (res.email_found === false) {
            setViewType("new_email");

            if (res.user_id) setValue("user_id", res.user_id);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      store.dispatch(showAlert("Email is not valid!", "error"));
    }
  };

  const sendNewEmail = () => {
    setLoading(true);

    const data = {
      email: getValues("new_email"),
      user_id: getValues("user_id"),
    };
    authService
      .setEmail(data)
      .then((res) => {
        if (res.email_found) {
          setViewType("otp");
          setValue("login", res);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const verifyOtp = () => {
    setLoading(true);
    const computedValues = {
      sms_id: getValues("login").sms_id,
      otp: otp,
      register_type: "default",
    };
    authService
      .verifyOnlyEmail(computedValues)
      .then((res) => {
        if (res.verified) {
          setViewType("new_password");
        } else {
          store.dispatch(showAlert("Wrong OTP!"));
        }
      })
      .catch((err) => {
        store.dispatch(showAlert("Wrong OTP!"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetPassword = () => {
    const computedValues = {
      password: getValues("new_password"),
      user_id: getValues("login.user_id"),
    };

    if (
      getValues("new_password") &&
      getValues("new_password") === getValues("confirm_password")
    ) {
      authService
        .resetPasswordProfile(computedValues)
        .then((res) => {
          dispatch(showAlert("Successfully updated password!", "success"));
          setFormType("LOGIN");
          reset();
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (
      getValues("new_password") &&
      getValues("new_password") !== getValues("confirm_password")
    ) {
      dispatch(showAlert("Failed to confirm password!", "error"));
    } else {
      dispatch(showAlert("New password is required", "error"));
    }
  };

  const getOtpVal = (val) => {
    setOtp(val);
  };

  return (
    <>
      <Box className={styles.otpBackBtn} onClick={backToLogin}>
        Login
      </Box>
      <form>
        {viewType === "login" ? (
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
                Forgot password?
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#101828",
                  marginBottom: "8px",
                }}>
                We sent confirmation code to your email
              </p>
            </Box>
            <Box sx={{marginTop: "24px"}}>
              <p className={styles.label}>{t("Email*")}</p>
              <HFTextFieldLogin
                required
                control={control}
                name="login"
                fullWidth
                type="text"
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
            </Box>
            <Box sx={{textAlign: "center"}}>
              <PrimaryButton
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  viewType === "login"
                    ? onSubmit(getValues())
                    : viewType === "otp"
                      ? verifyOtp()
                      : viewType === "new_email"
                        ? sendNewEmail()
                        : resetPassword();
                }}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  borderRadius: "8px",
                }}
                loader={loading}>
                Send code
              </PrimaryButton>
            </Box>
          </Box>
        ) : viewType === "otp" ? (
          <OtpComponent
            loading={loading}
            otp={otp}
            getOtpVal={getOtpVal}
            verifyOtp={verifyOtp}
          />
        ) : viewType === "new_password" ? (
          <NewPasswordComponent
            loading={loading}
            control={control}
            resetPassword={resetPassword}
          />
        ) : (
          "No Information has been found!"
        )}
      </form>
    </>
  );
}

export default ForgotPassword;
