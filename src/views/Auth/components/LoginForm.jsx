import { TextField } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import { showAlert } from "../../../store/alert/alert.thunk"
import { authActions } from "../../../store/auth/auth.slice"
import classes from "../style.module.scss"

const LoginForm = ({ navigateToRegistrationForm }) => {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()

  
  return (
    <form onSubmit={e => {
      e.preventDefault()
      if(login === 'medionAdmin' && password === '123456')  dispatch(authActions.login())
      else dispatch(showAlert("Логин или пароль не верный"))
    }} className={classes.form}>
      <div className={classes.formArea}>
        <div className={classes.formRow}>
          <p className={classes.label}>Логин</p>
          <TextField value={login} onChange={e => setLogin(e.target.value)} fullWidth placeholder="Введите логин" />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>Пароль</p>
          <TextField value={password} onChange={e => setPassword(e.target.value)} fullWidth placeholder="Введите пароль" />
        </div>
      </div>

      <div className={classes.buttonsArea}>
        <PrimaryButton size="large"  >Войти</PrimaryButton>
        <SecondaryButton type="button" size="large" onClick={navigateToRegistrationForm} >Зарегистрироваться</SecondaryButton>
      </div>

    </form>
  )
}

export default LoginForm
