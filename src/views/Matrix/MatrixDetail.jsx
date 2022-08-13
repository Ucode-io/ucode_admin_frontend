import Header from "../../components/Header"
import CustomTabs from "../../components/CustomTabs"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import FormCard from "../../components/FormCard"
import styles from "./styles.module.scss"
import HFTextField from "../../components/FormElements/HFTextField"
import { useForm } from "react-hook-form"
import FRow from "../../components/FormElements/FRow"
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2"
import constructorTableService from "../../services/constructorTableService"
import constructorFieldService from "../../services/constructorFieldService"
import Logins from "./Logins"
import Connections from "./Connections"
import MatrixRoles from "./MatrixRoles"

const MatrixDetail = () => {
  const [tabIndex, setTabIndex] = useState(1)
  const tabs = [
    {
      id: 1,
      name: "Инфо",
    },
    {
      id: 2,
      name: "Роли",
    },
  ]
  const params = useParams()
  const [clientType, setClientType] = useState({})
  const [tables, setTables] = useState([])
  const [fields, setFields] = useState([])

  const getTables = () => {
    constructorTableService
      .getList()
      .then((res) => {
        setTables(res?.tables || [])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        console.log("finally")
      })
  }

  const getFields = (params) => {
    constructorFieldService
      .getList(params)
      .then((res) => {
        console.log("fields", res)
        setFields(res?.fields || [])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        console.log("finally")
      })
  }

  const getClientType = () => {
    clientTypeServiceV2
      .getById(params.typeId)
      .then((res) => {
        console.log("res", res?.data?.response)
        setClientType(res?.data?.response)
        const platform = res?.data?.response?.$client_platform?.find(
          (item) => item?.guid === params.platformId
        )
        infoForm.setValue("name", platform?.name)
        infoForm.setValue("subdomain", platform?.subdomain)
        infoForm.setValue("userType", res?.data?.response?.name)
        infoForm.setValue("clientTypeId", res?.data?.response?.guid)
      })
      .catch((err) => {
        console.log("err", err)
      })
      .finally(() => {
        console.log("finally")
      })
  }

  const computedTableOptions = tables.map((item) => ({
    ...item,
    value: item.id,
  }))

  const computedFieldOptions = fields.map((item) => ({
    ...item,
    value: item.slug,
  }))

  const infoForm = useForm({
    defaultValues: {
      name: "",
      subdomain: "",
      userType: "",
      clientTypeId: "",
    },
  })

  useEffect(() => {
    getClientType()
    getTables()
  }, [])

  return (
    <div>
      <Header title="Matrix">
        <CustomTabs tabIndex={tabIndex} setTabIndex={setTabIndex} tabs={tabs} />
      </Header>

      {tabIndex === 1 ? (
        <div className={styles?.detail_holder}>
          <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
            <div className={styles.info_card}>
              <FRow label="Domain">
                <HFTextField
                  label="Domain"
                  name="subdomain"
                  control={infoForm.control}
                  fullWidth
                />
              </FRow>
              <FRow label="Название">
                <HFTextField
                  label="Название"
                  name="name"
                  control={infoForm.control}
                  fullWidth
                />
              </FRow>
              <FRow label="User type">
                <HFTextField
                  label="User type"
                  name="userType"
                  control={infoForm.control}
                  fullWidth
                />
              </FRow>
            </div>
          </FormCard>

          <Logins
            clientType={clientType}
            tables={computedTableOptions}
            fields={computedFieldOptions}
            getFields={getFields}
          />

          <Connections
            clientType={clientType}
            tables={computedTableOptions}
            fields={computedFieldOptions}
            getFields={getFields}
          />
        </div>
      ) : (
        <div style={{ margin: "8px" }}>
          <MatrixRoles infoForm={infoForm} />
        </div>
      )}
    </div>
  )
}

export default MatrixDetail
