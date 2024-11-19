import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Box, InputAdornment} from "@mui/material";
import {useRegisterCompanyMutation} from "../../../services/companyService";
import classes from "../style.module.scss";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import {useTranslation} from "react-i18next";

import {useMutation} from "react-query";
import HFTextFieldLogin from "../../../components/FormElements/HFTextFieldLogin";
import HFTextFieldWithMaskDesign from "../../../components/FormElements/HFTextFieldWithMaskDesign";
import {useState} from "react";

const RegisterFormPageDesign = ({setFormType = () => {}}) => {
  const {control, handleSubmit} = useForm();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {mutate: updateObject} = useMutation(() => console.log(""));

  const {mutateAsync: registerCompany, isLoading} = useRegisterCompanyMutation({
    onSuccess: () => {
      dispatch(showAlert("Registration was successful", "success"));
      navigate(-1);
      setLoading(false);
      setFormType("LOGIN");
    },
    onError: (err) => {
      setLoading(false);
      if (err.response?.data?.description) {
        dispatch(showAlert(err.response.data.description));
      } else
        dispatch(showAlert("Connection issues. Please try again", "error"));
    },
  });

  const trimPhone = (element) => {
    return element.replace(/[()\-\s]/g, "");
  };

  const onSubmit = (values) => {
    setLoading(true);
    registerCompany({
      ...values,
      user_info: {
        ...values.user_info,
        phone: trimPhone(values.user_info.phone),
      },
    });
  };

  return (
    <div className={classes.form}>
      <Box sx={{width: "100%", textAlign: "center"}}>
        <h1 className={classes.titleDesign}>Регистрация</h1>
        <p className={classes.subtitleDesign}>
          Заполните все данные, чтобы продолжить
        </p>
      </Box>

      <form style={{marginTop: "25px"}} onSubmit={handleSubmit(onSubmit)}>
        <Box className="" h="calc(100vh - 300px)" overflow="auto">
          <div className={classes.formRow}>
            <p className={classes.label}>{"Название компании*"}</p>
            <HFTextFieldLogin
              name="name"
              control={control}
              fullWidth
              placeholder="Введите название компании"
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
          <div className={classes.formRow}>
            <p className={classes.label}>{"Почтовый адрес*"}</p>
            <HFTextFieldLogin
              name="user_info.email"
              control={control}
              required
              fullWidth
              placeholder="Введите почтовый адрес"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src="/img/mail.svg" height={"23px"} alt="" />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={classes.formRow}>
            <p className={classes.label}>{"Номер телефона*"}</p>
            <HFTextFieldWithMaskDesign
              name="user_info.phone"
              control={control}
              mask={"+\\9\\9\\8 (99) 999-99-99"}
              maskChar={null}
              required
              placeholder="Введите номер телефона"
              updateObject={updateObject}
              className={classes.mask}
              fullWidth
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Логин*"}</p>
            <HFTextFieldLogin
              required
              name="user_info.login"
              control={control}
              fullWidth
              placeholder="Придумайте логин"
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
            <p className={classes.label}>{"Пароль*"}</p>
            <HFTextFieldLogin
              required
              name="user_info.password"
              control={control}
              fullWidth
              type={"password"}
              placeholder="Придумайте пароль"
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
      </form>

      <div className={classes.buttonsArea}>
        <PrimaryButton
          onClick={handleSubmit(onSubmit)}
          size="large"
          loader={loading}
          style={{borderRadius: "8px", fontSize: "16px", margin: "0 0"}}>
          {t("Зарегистрироваться")}
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
        <p>Уже есть аккаунт?</p>
        <Box
          onClick={() => setFormType("LOGIN")}
          sx={{color: "#175CD3", fontSize: "14px", cursor: "pointer"}}>
          Войдите в него
        </Box>
      </Box>
    </div>
  );
};

export default RegisterFormPageDesign;
