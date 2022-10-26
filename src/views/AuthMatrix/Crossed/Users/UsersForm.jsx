import { useFormik } from "formik"
import { useMemo } from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../../../components/CBreadcrumbs"
import FormCard from "../../../../components/FormCard"
import FDatePicker from "../../../../components/FormElements/FDatePicker"
import FImageUpload from "../../../../components/FormElements/FImageUpload"
import FRow from "../../../../components/FormElements/FRow"
import FSelect from "../../../../components/FormElements/FSelect"
import FSwitch from "../../../../components/FormElements/FSwitch"
import FTextField from "../../../../components/FormElements/FTextField"
import Header from "../../../../components/Header"
import clientTypeService from "../../../../services/clientTypeService"
import userService from "../../../../services/auth/userService"
import { useTranslation } from "react-i18next"

const UsersForm = () => {
  const { platformId, typeId, userId, projectId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)
  const [rolesList, setRolesList] = useState([])

  const breadCrumbItems = [
    {
      label: t("users"),
    },
    {
      label: t("create"),
    },
  ]

  const computedRolesList = useMemo(() => {
    return rolesList.map((role) => ({
      label: role.name,
      value: role.id,
    }))
  }, [rolesList])

  const fetchData = () => {
    if (!userId) return setLoader(false)

    userService
      .getById(userId)
      .then((res) => {
        formik.setValues(res)
      })
      .finally(() => setLoader(false))
  }

  const fetchRolesList = () => {
    clientTypeService
      .getById(typeId)
      .then((res) => setRolesList(res.roles ?? []))
  }

  const create = (data) => {
    setBtnLoader(true)
    userService
      .create(data)
      .then((res) => {
        navigate(
          `/settings/auth/matrix/${projectId}/${platformId}/${typeId}/user`
        )
      })
      .finally(() => setBtnLoader(false))
  }

  const update = (data) => {
    setBtnLoader(true)
    userService
      .update({
        ...data,
        id: userId,
      })
      .then((res) => {
        navigate(
          `/settings/auth/matrix/${projectId}/${platformId}/${typeId}/user`
        )
      })
      .finally(() => setBtnLoader(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      active: values.active ? 1 : 0,
    }

    if (userId) return update(data)
    create(data)
  }

  useEffect(() => {
    fetchRolesList()
    fetchData()
  }, [])

  const formik = useFormik({
    initialValues: {
      project_id: projectId,
      client_platform_id: platformId,
      client_type_id: typeId,
      active: 0,
      name: "",
      email: "",
      login: "",
      password: "",
      phone: "",
      expires_at: "",
      photo_url: "",
      role_id: "",
    },
    onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Header
        loader={loader}
        // backButtonLink={-1}
        extra={
          <>
            <SaveButton type="submit" loading={btnLoader} />
          </>
        }
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
      </Header>
      <FormCard visible={!loader} title={t("main.info")}>
        <FRow label={t("active")}>
          <FSwitch fullWidth formik={formik} name="active" />
        </FRow>
        <FRow label={t("photo")}>
          <FImageUpload fullWidth formik={formik} name="photo_url" />
        </FRow>
        <FRow label={t("name")}>
          <FTextField fullWidth formik={formik} name="name" />
        </FRow>
        <FRow label={t("email")}>
          <FTextField fullWidth formik={formik} name="email" />
        </FRow>
        <FRow label={t("phone")}>
          <FTextField fullWidth formik={formik} name="phone" />
        </FRow>
        <FRow label={t("login")}>
          <FTextField fullWidth formik={formik} name="login" />
        </FRow>
        {!userId && (
          <FRow label={t("password")}>
            <FTextField
              type="password"
              fullWidth
              formik={formik}
              name="password"
            />
          </FRow>
        )}
        <FRow label={t("expires.date")}>
          <FDatePicker width="100%" formik={formik} name="expires_at" />
        </FRow>
        <FRow label={t("role")}>
          <FSelect
            options={computedRolesList}
            fullWidth
            formik={formik}
            name="role_id"
          />
        </FRow>
      </FormCard>
    </form>
  )
}

export default UsersForm
