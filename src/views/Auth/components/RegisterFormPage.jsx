import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, InputAdornment } from "@mui/material";
import HFTextField from "../../../components/FormElements/HFTextField";
import { useRegisterCompanyMutation } from "../../../services/companyService";
import classes from "../style.module.scss";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LoginIcon from "@mui/icons-material/Login";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import HFTextFieldWithMask from "../../../components/FormElements/HFTextFieldWithMask";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../store/alert/alert.thunk";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { useTranslation } from "react-i18next";
import { formatPhoneNumberForRequest } from "../../../utils/formatPhoneNumber";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterFormPage = ({ setFormType, formType }) => {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const { mutateAsync: registerCompany, isLoading } =
    useRegisterCompanyMutation({
      onSuccess: () => {
        dispatch(showAlert("Регистрация прошла успешно", "success"));
        navigate(-1);
      },
      onError: (err) => {
        if (err.response?.data?.description) {
          dispatch(showAlert(err.response.data.description));
        } else
          dispatch(
            showAlert(
              "Проблемы с соединением.  Пожалуйста попробуйте снова",
              "error"
            )
          );
      },
    });

  const onSubmit = (values) => {
    console.log("values", values);
    registerCompany({
      ...values,
      user_info: {
        ...values.user_info,
        phone: formatPhoneNumberForRequest(values.user_info.phone),
      },
    });
  };

  return (
    <div className={classes.form}>
      <h1 className={classes.title}>Регистрация</h1>
      <p className={classes.subtitle}>Заполните данные для регистрации</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="" mt={5} h="calc(100vh - 300px)" overflow="auto">
          <div className={classes.formRow}>
            <p className={classes.label}>{"Название компании"}</p>
            <HFTextField
              name="name"
              control={control}
              fullWidth
              placeholder="Введите название компании"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ApartmentIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Адрес электронной почты"}</p>
            <HFTextField
              name="user_info.email"
              control={control}
              required
              fullWidth
              placeholder="Введите адрес электронной почты"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={classes.formRow}>
            <p className={classes.label}>{"Номер телефона"}</p>
            <HFTextFieldWithMask
              name="user_info.phone"
              control={control}
              fullWidth
              mask={"(99) 999-99-99"}
              required
              placeholder="Введите номер телефона"
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Логин"}</p>
            <HFTextField
              required
              name="user_info.login"
              control={control}
              fullWidth
              placeholder="Придумайте логин"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LoginIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Пароль"}</p>
            <HFTextField
              required
              name="user_info.password"
              control={control}
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Придумайте пароль"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
          className={`${
            formType === "register"
              ? classes.registerBtnPage
              : classes.registerBtn
          }`}
        >
          {t("Зарегистрироваться")}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default RegisterFormPage;
