import {useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useMutation} from "react-query";
import classes from "../style.module.scss";
import {useTranslation} from "react-i18next";
import {Box, InputAdornment, Tooltip} from "@mui/material";
import {showAlert} from "../../../store/alert/alert.thunk";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import {useRegisterCompanyMutation} from "../../../services/companyService";
import GoogleAuthLogin from "./LoginFormDesign/ExternalAuth/GoogleAuthLogin";
import HFTextFieldLogin from "../../../components/FormElements/HFTextFieldLogin";
import HFTextFieldPassword from "../../../components/FormElements/HFTextFieldPassword";
import {useNavigate} from "react-router-dom";

const loginRules = {
  minLength: {
    value: 6,
    message: "Login must be at least 6 characters long",
  },
};

const RegisterFormPageDesign = ({setFormType = () => {}}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {control, handleSubmit, setValue, watch} = useForm();

  const {mutate: updateObject} = useMutation(() => console.log(""));

  const {mutateAsync: registerCompany, isLoading} = useRegisterCompanyMutation({
    onSuccess: () => {
      dispatch(showAlert("Registration was successful", "success"));
      setLoading(false);
      navigate("/login");
    },
    onError: (err) => {
      setLoading(false);
      if (err.response?.data?.description) {
        dispatch(showAlert(err.response.data.description));
      } else
        dispatch(showAlert("Connection issues. Please try again", "error"));
    },
  });

  const onSubmit = (values) => {
    setLoading(true);
    registerCompany({
      ...values,
      user_info: {
        ...values.user_info,
      },
    });
  };

  return (
    <div className={classes.outlet}>
      <div className={classes.form}>
        <Box sx={{width: "100%", textAlign: "center"}}>
          <h1 className={classes.titleDesign}>Registration</h1>
          <p className={classes.subtitleDesign}>
            Fill out all the information to proceed
          </p>
        </Box>

        <form style={{marginTop: "25px"}} onSubmit={handleSubmit(onSubmit)}>
          <Box className="" h="calc(100vh - 300px)" overflow="auto">
            <div className={classes.formRow}>
              <p className={classes.label}>{"Company name*"}</p>
              <HFTextFieldLogin
                name="name"
                control={control}
                fullWidth
                placeholder="Enter company name"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src="/img/company.svg" height={"23px"} alt="" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            {!watch("googleToken") && (
              <div className={classes.formRow}>
                <p className={classes.label}>{"Email*"}</p>
                <HFTextFieldLogin
                  name="user_info.email"
                  control={control}
                  required
                  fullWidth
                  placeholder="Enter email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src="/img/mail.svg" height={"23px"} alt="" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}

            <div className={classes.formRow}>
              <p className={classes.label}>{"Login*"}</p>
              <HFTextFieldLogin
                required
                name="user_info.login"
                control={control}
                fullWidth
                placeholder="Create login"
                rules={loginRules}
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
              <p className={classes.label}>{"Password*"}</p>
              <HFTextFieldPassword
                required
                name="user_info.password"
                control={control}
                fullWidth
                type={"password"}
                placeholder="Create password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/img/passcode-lock.svg"
                        height={"23px"}
                        alt=""
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Box>
        </form>

        <Tooltip title="Google Auth!">
          <Box sx={{marginBottom: "25px"}}>
            <GoogleAuthLogin
              watch={watch}
              setValue={setValue}
              text="Register with Google"
            />
          </Box>
        </Tooltip>

        <div className={classes.buttonsArea}>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            size="large"
            loader={loading}
            style={{borderRadius: "8px", fontSize: "16px", margin: "0 0"}}>
            {t("Registration")}
          </PrimaryButton>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "16px",
            justifyContent: "center",
          }}>
          <p>Already have an account?</p>
          <Box
            onClick={() => navigate("/login")}
            sx={{color: "#175CD3", fontSize: "14px", cursor: "pointer"}}>
            Sign In
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default RegisterFormPageDesign;
