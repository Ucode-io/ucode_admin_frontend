import { useState, useEffect } from "react"
import axios from "../../utils/axios"
import Header from "./Header"
import Content from "./Content"
import Skeleton from "@material-ui/lab/Skeleton"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"

import { Formik } from "formik"
import * as Yup from "yup"

const levelsList = [
  {value: 1, label: "Respublika miqyosida"},
  {value: 2, label: "Viloyat miqyosida"},
  {value: 3, label: "Tuman/shahar miqyosida"}
]


export default function RolesCreate() {
  // **** USE-HOOKS ****
  const { t } = useTranslation()
  const history = useHistory()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState([])
  const [isGettingData, setIsGettingData] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [initialValues, setInitialValues] = useState({
    status: true,
    name: "",
    description: "",
  })
  const [organizationsList, setOrganizationsList] = useState([])

  useEffect(() => {
    getPermission()
    getOrganizationsList()
    getRole(params.id)
  }, [])

  // **** FUNCTIONS ****
  const getRole = (id) => {
    if(!params.id) return null
    setIsGettingData(true)
    axios
      .get(`/role/${id}`)
      .then((res) => {
        res = {
          ...res,
          organization: {value: res.organization, label: res.organization.name},
          code: levelsList.filter(level => level.value === res.code)[0]
        }
        setInitialValues(res)
        setSelectedPermissions(res.permissions.map(el => el.id))
      })
      .catch((err) => console.log(err))
      .finally(() => setIsGettingData(false))
  }

  const getPermission = () => {
    axios
      .get("/permission?limit=1000")
      .then((res) => setPermissions(res.permissions))
      .catch((err) => console.log(err))
      .finally(() => {})
  }

  const getOrganizationsList = () => {
    axios.get("/organization").then(res => setOrganizationsList(res.organizations.map(organization => ({value: organization.id, label: organization.name}))))
  }

  // **** EVENTS ****
  const onSubmit = (values) => {
    values = {
      ...values,
      permissions: selectedPermissions,
      code: values.code.value,
      organization_id: values.organization.value.id
    }

    setLoading(true)
    if (params.id) {
      axios
        .put(`/role/${params.id}`, values)
        .then((res) => {
          history.push("/home/settings/roles")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      axios
        .post("/role", values)
        .then((res) => {
          console.log(res)
          history.push("/home/settings/roles")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  // **** CONSTANTS ****
  const ValidationSchema = Yup.object().shape({
    status: Yup.bool().required(t("required.field.error")),
    name: Yup.string().required(t("required.field.error")),
    description: Yup.string().required(t("required.field.error")),
  })

  return (
    <div>
      {!params.id || !isGettingData ? (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={ValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Header params={params} loading={loading} initialValues={initialValues} />
              <Content
                formik={formik}
                levelsList={levelsList}
                organizationsList={organizationsList}
                permissions={permissions}
                selectedPermissions={selectedPermissions}
                onPermissionChange={(val) => {
                  setSelectedPermissions(val)
                }}
              />
            </form>
          )}
        </Formik>
      ) : (
        <Skeleton />
      )}
    </div>
  )
}
