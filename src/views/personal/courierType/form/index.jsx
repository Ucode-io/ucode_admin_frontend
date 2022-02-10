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
import Button from "../../../../components/Button"
import {
  getCourierType,
  postCourierType,
  updateCourierType,
} from "../../../../services/courierType"
import LoaderComponent from "../../../../components/Loader"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

export default function CreateCourierType() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getCourierType(id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          distance_from: res.distance_from,
          distance_to: res.distance_to,
        })
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getItem()
  }, [])

  const initialValues = useMemo(
    () => ({
      name: "",
      distance_from: "",
      distance_to: "",
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      name: defaultSchema,
      distance_from: defaultSchema,
      distance_to: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id
      ? updateCourierType(id, data)
      : postCourierType(data)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges(values)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <LoaderComponent isLoader={loader} />

  const routes = [
    {
      title: t("personal"),
      link: true,
      route: `/home/courier/courier-type`,
    },
    {
      title: t("courier.type"),
      link: true,
      route: `/home/courier/courier-type`,
    },
    {
      title: id ? formik.values?.name : t("create"),
    },
  ]

  const { values, handleChange, handleSubmit } = formik

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
              onClick={() => console.log()}
            >
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("add.new.courier")}>
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 items-end">
                  <div>
                    <Form.Item formik={formik} name="name" label={t("name")}>
                      <Input
                        id="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="distance_from"
                      label={t("distance.from")}
                    >
                      <Input
                        id="distance_from"
                        type="number"
                        value={values.distance_from}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="distance_to"
                      label={t("distance.to")}
                    >
                      <Input
                        id="distance_to"
                        type="number"
                        value={values.distance_to}
                        onChange={handleChange}
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
