import { TextField } from "@mui/material"
import { useDispatch } from "react-redux"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import { authActions } from "../../../store/auth/auth.slice"
import classes from "../style.module.scss"

const LoginForm = ({ navigateToRegistrationForm }) => {
  const dispatch = useDispatch()

  return (
    <form onSubmit={e => {
      e.stopPropagation()
      dispatch(authActions.login())
    }} className={classes.form}>
      <div className={classes.formArea}>
        <div className={classes.formRow}>
          <p className={classes.label}>Логин</p>
          <TextField fullWidth placeholder="Введите логин" />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>Пароль</p>
          <TextField fullWidth placeholder="Введите пароль" />
        </div>
      </div>

      <div className={classes.buttonsArea}>
        <PrimaryButton   >Войти</PrimaryButton>
        <SecondaryButton type="button" onClick={navigateToRegistrationForm} >Зарегистрироваться</SecondaryButton>
      </div>

    </form>
  )
}

export default LoginForm
