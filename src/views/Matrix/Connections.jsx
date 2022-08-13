import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { EditIcon, PlusIcon } from "../../assets/icons/icon"
import FormCard from "../../components/FormCard"
import HFIconPicker from "../../components/FormElements/HFIconPicker"
import HFTextField from "../../components/FormElements/HFTextField"
import constructorObjectService from "../../services/constructorObjectService"
import ConnectionCreateModal from "./ConnectionCreateModal"
import styles from "./styles.module.scss"

const Connections = ({ clientType, tables, fields, getFields = () => {} }) => {
  const [connections, setConnections] = useState([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const connectionForm = useForm({
    defaultValues: {
      icon: "",
      name: "",
      table_slug: "",
      view_slug: "",
      view_label: "",
      client_type_id: clientType.guid,
      guid: "",
    },
  })

  const getConnections = () => {
    constructorObjectService
      .getList("connections", { data: { client_type_id: clientType.guid } })
      .then((res) => {
        console.log("connections", res)
        setConnections(res?.data?.response || [])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const editingConnections = (connection) => {
    console.log("connection", connection)
    setIsEdit(true)
    setOpen(true)
    connectionForm.setValue("icon", connection?.icon)
    connectionForm.setValue("name", connection?.name)
    connectionForm.setValue(
      "table_slug",
      tables?.find((item) => item?.slug === connection?.table_slug).id
    )
    connectionForm.setValue("view_label", connection?.view_label)
    connectionForm.setValue("view_slug", connection.view_slug)
    connectionForm.setValue("guid", connection?.guid)
    getFields({
      table_id: tables?.find((item) => item?.slug === connection?.table_slug)
        .id,
    })
  }

  const handleSubmit = () => {
    const data = {
      icon: connectionForm.getValues().icon,
      name: connectionForm.getValues().name,
      table_slug: tables?.find(
        (item) => item?.id === connectionForm.getValues().table_slug
      ).slug,
      view_slug: connectionForm.getValues().view_slug,
      view_label: connectionForm.getValues().view_label,
      client_type_id: clientType.guid,
      guid: connectionForm.getValues().guid,
    }
    console.log("data", data)
    if (isEdit) {
      constructorObjectService
        .update("connections", {
          data: {
            ...data,
          }
        })
        .then((res) => {
          console.log("res", res)
          getConnections()
        })
        .catch((err) => {
          console.log("err", err)
        })
    } else {
      constructorObjectService
        .create("connections", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          console.log("res", res)
          getConnections()
        })
        .catch((err) => {
          console.log("err", err)
        })
    }
  }

  useEffect(() => {
    getConnections()
  }, [])

  return (
    <FormCard title=" Связи" maxWidth="100%">
      <div className={styles.login_card}>
        <div>
          {connections.map((item) => (
            <div className={styles.card_holder} key={item?.guid}>
              <div className={styles.card_header}>
                <div className={styles.card_header_left}>
                  <HFIconPicker
                    name=""
                    control={connectionForm.control}
                    shape="rectangle"
                    value={item?.icon}
                    disabled
                  />
                  <HFTextField
                    name=""
                    value={item?.name}
                    disabled
                    control={connectionForm.control}
                    fullWidth
                  />
                  <HFTextField
                    name=""
                    value={
                      tables?.find((table) => table.slug === item?.table_slug)
                        ?.label
                    }
                    disabled
                    control={connectionForm.control}
                    fullWidth
                  />
                </div>
                <div
                  className={styles.card_header_right}
                  onClick={() => {
                    editingConnections(item)
                  }}
                >
                  <EditIcon />
                </div>
              </div>
              <div className={styles.card_body}>
                <div className={styles.card_body_items}>
                  <div>
                    <HFTextField
                      name=""
                      value={item?.view_label}
                      control={connectionForm.control}
                      fullWidth
                      disabled
                    />
                  </div>
                  <div>
                    <HFTextField
                      name=""
                      value={item?.view_slug}
                      control={connectionForm.control}
                      fullWidth
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            className={styles.add_login_btn}
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            Добавить
          </button>
        </div>
      </div>
      <ConnectionCreateModal
        open={open}
        setOpen={setOpen}
        tables={tables}
        fields={fields}
        getFields={getFields}
        connectionForm={connectionForm}
        handleSubmit={handleSubmit}
        isEdit={isEdit}
      />
    </FormCard>
  )
}

export default Connections
