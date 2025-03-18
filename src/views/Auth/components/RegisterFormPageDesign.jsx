import {useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useMutation, useQuery} from "react-query";
import classes from "../style.module.scss";
import {useTranslation} from "react-i18next";
import {Box, Checkbox, InputAdornment, Tooltip} from "@mui/material";
import {showAlert} from "../../../store/alert/alert.thunk";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import {useRegisterCompanyMutation} from "../../../services/companyService";
import GoogleAuthLogin from "./LoginFormDesign/ExternalAuth/GoogleAuthLogin";
import HFTextFieldLogin from "../../../components/FormElements/HFTextFieldLogin";
import HFTextFieldPassword from "../../../components/FormElements/HFTextFieldPassword";
import {useNavigate} from "react-router-dom";
import HFFairSelect from "../../../components/FormElements/HFFairSelect";
import billingService from "../../../services/billingService";

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
  const [publicCheck, setPublicCheck] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm();

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

  const {data: fares} = useQuery(
    ["GET_OBJECT_LIST"],
    () => {
      return billingService.getFareList();
    },
    {
      select: (res) => {
        return (
          res?.fares?.map((item) => ({
            label: item?.name,
            value: item?.id,
          })) ?? []
        );
      },
    }
  );

  return (
    <div className={classes.outletRegister}>
      <div className={classes.form}>
        <Box sx={{width: "100%", textAlign: "center"}}>
          <h1 className={classes.titleDesign}>{t("register.form")}</h1>
        </Box>

        <form style={{marginTop: "5px"}} onSubmit={handleSubmit(onSubmit)}>
          <Box className="" h="calc(100vh - 200px)" overflow="auto">
            <div style={{marginBottom: "13px"}} className={classes.formRow}>
              <p className={classes.label}>{t("company.name")}</p>
              <HFTextFieldLogin
                name="name"
                control={control}
                fullWidth
                placeholder={t("enter.company.name")}
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
              <div style={{marginBottom: "13px"}} className={classes.formRow}>
                <p className={classes.label}>{t("email")}</p>
                <HFTextFieldLogin
                  name="user_info.email"
                  control={control}
                  required
                  fullWidth
                  placeholder={t("enter.email.address")}
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

            <div style={{marginBottom: "13px"}} className={classes.formRow}>
              <p className={classes.label}>{t("login")}</p>
              <HFTextFieldLogin
                required
                name="user_info.login"
                control={control}
                fullWidth
                placeholder={t("create.login")}
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
            <div style={{marginBottom: "13px"}} className={classes.formRow}>
              <p className={classes.label}>{t("password")}</p>
              <HFTextFieldPassword
                required
                name="user_info.password"
                control={control}
                fullWidth
                type={"password"}
                placeholder={t("create.password")}
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
              {errors["user_info"]?.password && (
                <span className={classes.errorMessage}>
                  {errors["user_info"]?.password?.message}
                </span>
              )}
            </div>
            <div style={{marginBottom: "13px"}} className={classes.formRow}>
              <p className={classes.label}>{t("Tariff")}</p>
              <HFFairSelect
                options={fares}
                required
                name="fair_id"
                control={control}
                fullWidth
              />
            </div>
          </Box>
        </form>

        <Box sx={{display: "flex", gap: "10px"}}>
          <Checkbox
            style={{width: "16px", height: "16px", marginTop: "2px"}}
            onChange={(e) => setPublicCheck(e.target.checked)}
            id="public_offer"
          />
          <label for="public_offer" style={{fontSize: "11px"}}>
            {t("public_offer")}{" "}
            <a href={import.meta.env.VITE_PUBLIC_OFFER} download>
              {t("public_link")}
            </a>
          </label>
        </Box>

        <Tooltip title="Google Auth!">
          <Box sx={{marginBottom: "13px"}}>
            <GoogleAuthLogin
              watch={watch}
              setValue={setValue}
              text={t("register.with.google")}
            />
          </Box>
        </Tooltip>

        <div className={classes.buttonsArea}>
          <PrimaryButton
            disabled={!publicCheck}
            onClick={handleSubmit(onSubmit)}
            size="large"
            loader={loading}
            style={{borderRadius: "8px", fontSize: "16px", margin: "0 0"}}>
            {t("register.form")}
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
          <p>{t("already.have.account")}</p>
          <Box
            onClick={() => navigate("/login")}
            sx={{color: "#175CD3", fontSize: "14px", cursor: "pointer"}}>
            {t("enter")}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default RegisterFormPageDesign;
