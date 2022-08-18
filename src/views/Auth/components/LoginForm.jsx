import { AccountCircle, Lock, SupervisedUserCircle } from "@mui/icons-material"
import { InputAdornment } from "@mui/material"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import HFSelect from "../../../components/FormElements/HFSelect"
import HFTextField from "../../../components/FormElements/HFTextField"
import clientTypeServiceV2 from "../../../services/auth/clientTypeServiceV2"
import { loginAction } from "../../../store/auth/auth.thunk"
import listToOptions from "../../../utils/listToOptions"
import classes from "../style.module.scss"
import DynamicFields from "./DynamicFields"

const LoginForm = ({ navigateToRegistrationForm }) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [connections, setConnections] = useState([])

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      client_type: "",
      username: "",
      password: "",
      tables: [
        {
          object_id: "",
          table_slug: "",
        },
      ],
    },
  })

  const { data: { data } = {} } = useQuery(["GET_CLIENT_TYPES"], () => {
    return clientTypeServiceV2.getList()
  })


  const computedClientTypes = useMemo(() => {
    return listToOptions(data?.response, "name", "guid")
  }, [data?.response])

  const clientTypeId = watch("client_type")

  const getConnections = () => {
    axios
      .post(
        `https://test.api.client.medion.uz/v1/object/get-list/connections`,
        { data: { client_type_id: clientTypeId } }
      )
      .then((res) => {
        setConnections(res?.data?.data?.data?.response || [])
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const selectedClientType = useMemo(() => {
    return data?.response?.find(
      (clientType) => clientType.guid === clientTypeId
    )
  }, [clientTypeId, data?.response])

  const onSubmit = (data) => {
    const computedData = {
      ...data,
      // tables: Object.keys(data.tables ?? {}).map((key) => ({
      //   table_slug: key,
      //   object_id: data.tables[key],
      // })),
    }

    const cashboxData = getCashboxData(data)

    setLoading(true)

    dispatch(loginAction({ data: computedData, cashboxData }))
      .unwrap()
      .then(() => {
        if (selectedClientType?.name === "CASHIER") {
          navigate("/cashbox/opening")
        }
      })
      .catch(() => setLoading(false))
  }

  const getCashboxData = (data) => {
    if (selectedClientType?.name !== "CASHIER") return null
    const cashboxId = data.tables.cashbox
    const cashboxTable = selectedClientType?.tables?.find(
      (table) => table.slug === "cashbox"
    )
    const selectedCashbox = cashboxTable?.data?.response?.find(
      (object) => object.guid === cashboxId
    )
    return selectedCashbox
  }

  useEffect(() => {
    if (!clientTypeId) return
    getConnections()
  }, [clientTypeId])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <div onSubmit={handleSubmit} className={classes.formArea}>
        <div className={classes.formRow}>
          <p className={classes.label}>Тип пользователя</p>
          <HFSelect
            // required
            control={control}
            name="client_type"
            size="large"
            fullWidth
            options={computedClientTypes}
            placeholder="Выберите тип пользователя"
            startAdornment={
              <InputAdornment position="start">
                <SupervisedUserCircle style={{ fontSize: "30px" }} />
              </InputAdornment>
            }
          />
        </div>

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

        {connections?.length ? <DynamicFields
          // key={table.slug}
          table={connections}
          control={control}
          setValue={setValue}
          // index={index}
        /> : null}
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
