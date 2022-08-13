import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import {
  EditIcon,
  FilterIcon,
  PlusIcon,
} from "../../assets/icons/icon"
import FormCard from "../../components/FormCard"
import HFTextField from "../../components/FormElements/HFTextField"
import constructorObjectService from "../../services/constructorObjectService"
import CreateLoginModal from "./CreateLoginModal"
import styles from "./styles.module.scss"

const Logins = ({ tables, fields, clientType, getFields = () => {} }) => {
  const { typeId, platformId } = useParams()
  const [open, setOpen] = useState(false)
  const [logins, setLogins] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const loginOptions = [
    {
      value: "Login with password",
      label: "Login with Password",
    },
    {
      value: "Phone OTP",
      label: "Phone OTP",
    },
    {
      value: "Email OTP",
      label: "Email OTP",
    },
  ]

  const getLogins = () => {
    constructorObjectService
      .getList("login_table", {
        data: {
          client_type_id: typeId,
        },
      })
      .then((res) => {
        setLogins(res?.data?.response || [])
      })
      .catch((err) => {
        console.log("err", err)
      })
  }

  const handleSubmit = () => {
    const data = {
      client_platform_id: platformId,
      client_type_id: clientType?.guid,
      project_id: clientType?.project_id,
      login_strategy: loginForm.getValues().login_strategy,
      object_id: loginForm.getValues().login_table.object_id,
      table_slug: tables.find(
        (item) => item.id === loginForm.getValues().login_table.object_id
      )?.slug,
      view_fields: loginForm.getValues("login_table.view_fields") || [],
      login: loginForm.getValues().login,
      password: loginForm.getValues().password || "",
      guid: loginForm.getValues().guid,
    }
    if (isEditing) {
      constructorObjectService
        .update("login_table", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          console.log("res", res)
          getLogins()
        })
        .catch((err) => {
          console.log("err", err)
        })
        .finally(() => {
          setIsEditing(false)
        })
    } else {
      constructorObjectService
        .create("login_table", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          console.log("res", res)
          getLogins()
        })
        .catch((err) => {
          console.log("err", err)
        })
    }
  }

  const loginForm = useForm({
    defaultValues: {
      client_platform_id: "",
      client_type_id: "",
      login_strategy: "Login with password",
      guid: "",
      login_table: {
        object_id: "",
        table_slug: "",
        view_fields: [],
      },
      login: "",
      password: "",
      project_id: "",
    },
  })

  const editingClient = (client) => {
    setIsEditing(true)
    setOpen(true)
    loginForm.setValue("login_strategy", client?.login_strategy)
    loginForm.setValue("login_table.object_id", client?.object_id)
    loginForm.setValue("login_table.table_slug")
    loginForm.setValue("login_table.view_fields", client?.view_fields)
    loginForm.setValue("login", client?.login)
    loginForm.setValue("password", client.password)
    loginForm.setValue("guid", client?.guid)
    getFields({ table_id: client?.object_id })
  }

  useEffect(() => {
    getLogins()
  }, [])

  return (
    <FormCard title="Логин" icon="address-card.svg" maxWidth="100%">
      <div className={styles.login_card}>
        {logins.map((login) => (
          <div className={styles.card_holder} key={login?.guid}>
            <div className={styles.card_header}>
              <div className={styles.card_header_left}>
                <div className={styles.card_header_title}>
                  {login?.login_strategy}
                </div>
                <HFTextField
                  name=""
                  control={loginForm.control}
                  value={login?.login_strategy}
                  fullWidth
                  disabled
                />
                <HFTextField
                  name=""
                  control={loginForm.control}
                  value={
                    tables?.find((item) => item.value === login?.object_id)
                      ?.label
                  }
                  fullWidth
                  disabled
                />
              </div>
              <div
                className={styles.card_header_right}
                onClick={() => {
                  editingClient(login)
                }}
              >
                <EditIcon />
              </div>
            </div>
            <div className={styles.card_body}>
              <div className={styles.card_body_head}>
                <div>
                  Название
                  <FilterIcon />
                </div>
                <div>
                  View field
                  <FilterIcon />
                </div>
              </div>
              <div className={styles.card_body_items}>
                <div>
                  <HFTextField
                    name=""
                    onChange={(e) => {
                      loginForm.setValue("login", e.target.value)
                    }}
                    control={loginForm.control}
                    value={login?.login}
                    fullWidth
                    disabled
                  />
                  <HFTextField
                    name=""
                    onChange={(e) => {
                      loginForm.setValue("password", e.target.value)
                    }}
                    control={loginForm.control}
                    fullWidth
                    value={login?.password}
                    disabled
                  />
                </div>
                <div>
                  <HFTextField
                    name=""
                    control={loginForm.control}
                    value={login?.view_fields[0]}
                    fullWidth
                    disabled
                  />
                  <HFTextField
                    name=""
                    control={loginForm.control}
                    value={login?.view_fields[1]}
                    fullWidth
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div>
          <button
            className={styles.add_login_btn}
            onClick={() => {
              setOpen(true)
              setIsEditing(false)
            }}
          >
            <PlusIcon />
            Добавить
          </button>
        </div>
      </div>
      <CreateLoginModal
        open={open}
        setOpen={setOpen}
        tables={tables}
        fields={fields}
        loginOptions={loginOptions}
        loginForm={loginForm}
        getFields={getFields}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </FormCard>
  )
}

export default Logins
