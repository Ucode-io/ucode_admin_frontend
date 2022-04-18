import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"

//components and functions
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import CustomSkeleton from "../../../../components/Skeleton"
import Button from "../../../../components/Button"

import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

import "./style.scss"
// import { getUserRoles } from "../../../../services/userRoles"
import Select from "../../../../components/Select"
import { getBranches } from "../../../../services"
import {
  getOneBranchUser,
  postBranchUser,
  updateBranchUser,
} from "../../../../services/branchUsers"

export default function CreateGeofence() {
  const history = useHistory()
  const { shipper_id, user_id } = useParams()
  const { t } = useTranslation()
  const [loader, setLoader] = useState(true)
  const [userRoles, setUserRoles] = useState([])
  const [saveLoading, setSaveLoading] = useState(false)
  const [branches, setBranches] = useState([])

  const getItem = () => {
    if (!user_id) return setLoader(false)
    getOneBranchUser(user_id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          phone: res.phone?.substring(4),
          user_roles: {
            label: res.user_role_name,
            value: res.user_role_id,
          },
          branches: {
            label: res.branch_name,
            value: res.branch_id,
          },
        })
      })
      .finally(() => {
        setLoader(false)
      })
  }

  // const fetchData = async () => {
  //   setLoader(true)
  //   try {
  //     const { user_roles } = await getUserRoles({ limit: 1000 })
  //     setUserRoles(
  //       user_roles
  //         ? user_roles.map((elm) => ({ label: elm.name, value: elm.id }))
  //         : []
  //     )

  //     const { branches } = await getBranches({ limit: 1000 }, shipper_id)
  //     setBranches(
  //       branches
  //         ? branches.map((elm) => ({ label: elm.name, value: elm.id }))
  //         : []
  //     )
  //   } catch (e) {
  //     console.log(e)
  //   } finally {
  //     setLoader(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchData()
  //   getItem()
  // }, [])

  const initialValues = useMemo(
    () => ({
      name: "",
      phone: "",
      user_roles: null,
      branches: null,
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      name: defaultSchema,
      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .required(t("required.field.error")),
      user_roles: defaultSchema,
      branches: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)

    const selectedAction = user_id
      ? updateBranchUser(user_id, { ...data, shipper_id })
      : postBranchUser({ ...data, shipper_id })
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      user_role_id: values.user_roles.value,
      branch_id: values.branches.value,
      phone: "+998" + values.phone, // this is just to prevent validation of password
    }
    delete data.user_roles
    delete data.branches

    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  const routes = [
    // {
    //   title: t(`users`),
    //   link: true,
    //   route: `/home/company/shipper-company/${shipper_id}`,
    // },
    {
      title: t("list.of.branches"),
      link: true,
      route: `/home/company/shipper-company/${shipper_id}`,
    },
    {
      title: t("create"),
    },
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={[
            <Button
              icon={CancelIcon}
              size="large"
              shape="outlined"
              color="red"
              borderColor="bordercolor"
              onClick={(e) => history.go(-1)}
            >
              {t("cancel")}
            </Button>,
            <Button
              icon={SaveIcon}
              size="large"
              type="submit"
              loading={saveLoading}
            >
              {t("save")}
            </Button>,
          ]}
        />

        <div className="p-4 w-full">
          <Card title={t(`general.information`)} className="mb-4">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-6">
                <div className="flex">
                  <div className="w-1/4">
                    <span className="input-label">{t("name")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="name">
                      <Input
                        size="large"
                        id="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="flex">
                  <div className="w-1/4">
                    <span>{t("phone.number")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="phone">
                      <Input
                        size="large"
                        prefix="+998"
                        id="phone"
                        type="number"
                        value={values.phone}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="flex">
                  <div className="w-1/4">
                    <span>{t("user.roles")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="user_roles">
                      <Select
                        height={40}
                        id="user_roles"
                        options={userRoles}
                        value={values.user_roles}
                        onChange={(val) => setFieldValue("user_roles", val)}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="flex">
                  <div className="w-1/4">
                    <span>{t("branches")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="branches">
                      <Select
                        height={40}
                        id="branches"
                        options={branches}
                        value={values.branches}
                        onChange={(val) => setFieldValue("branches", val)}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
