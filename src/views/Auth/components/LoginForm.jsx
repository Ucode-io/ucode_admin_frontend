import {
  AccountBalance,
  AccountCircle,
  Lock,
} from "@mui/icons-material"
import { InputAdornment } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { useDispatch } from "react-redux"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import HFSelect from "../../../components/FormElements/HFSelect"
import HFTextField from "../../../components/FormElements/HFTextField"
import constructorObjectService from "../../../services/constructorObjectService"
import { loginAction } from "../../../store/auth/auth.thunk"
import listToOptions from "../../../utils/listToOptions"
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

    dispatch(loginAction(data))
      .unwrap()
      .catch(() => setLoading(false))
  }

  const { data: branches } = useQuery(["GET_OBJECTS_LIST"], () => {
    return constructorObjectService.getList("branches", { data: {} })
  }, {
    select: ({ data }) => listToOptions(data.response, 'name', 'guid') ?? []
  })

  // console.log('branches ===>', branches)

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>Филиал</p>
          <HFSelect
            // required
            control={control}
            name="branch_id"
            size="large"
            fullWidth
            options={branches}
            placeholder="Выберите филиал"
            startAdornment={
              <InputAdornment position="start">
                <AccountBalance style={{ fontSize: "30px" }} />
              </InputAdornment>
            }
          />
        </div>
      </div>

      <div className={classes.buttonsArea}>
        <PrimaryButton size="large" loader={loading}>
          Войти
        </PrimaryButton>
        {/* <SecondaryButton type="button" size="large" onClick={navigateToRegistrationForm} >Зарегистрироваться</SecondaryButton> */}
      </div>
    </form>
  )
}

export default LoginForm
