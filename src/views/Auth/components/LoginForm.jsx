import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import HFTextField from "../../../components/FormElements/HFTextField"
import { loginAction } from "../../../store/auth/auth.thunk"
import classes from "../style.module.scss"

const LoginForm = ({ navigateToRegistrationForm }) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = (data) => {
    setLoading(true)

    dispatch(loginAction(data)).unwrap().catch(() => setLoading(false))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <div onSubmit={handleSubmit} className={classes.formArea}>
        <div className={classes.formRow}>
          <p className={classes.label}>Логин</p>
          <HFTextField
            required
            control={control}
            name="username"
            size="large"
            fullWidth
            placeholder="Введите логин"
            autoFocus
          />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>Пароль</p>
          <HFTextField
            required
            control={control}
            name="password"
            type="password"
            size="large"
            fullWidth
            placeholder="Введите пароль"
          />
        </div>
      </div>

      <div className={classes.buttonsArea}>
        <PrimaryButton size="large" loader={loading} >Войти</PrimaryButton>
        {/* <SecondaryButton type="button" size="large" onClick={navigateToRegistrationForm} >Зарегистрироваться</SecondaryButton> */}
      </div>
    </form>
  )
}

export default LoginForm
