import React, { useMemo, useState } from "react"
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

import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

import "./style.scss"
import TextArea from "../../../../components/Textarea"
import Select from "../../../../components/Select"
import { postSettlement } from "../../../../services/settlements"
import Button from "../../../../components/Button"

export default function CreateSettlement() {
  const history = useHistory()
  const { shipper_id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)

  const findType = [
    {
      label: "Credit to Shipper",
      value: "1233887b-7c6c-4c4d-8fc7-8a3bbd74d534",
    },
    {
      label: "Credit to Rasta",
      value: "71557782-95c2-4047-9d23-5ba38eb938b4",
    },
  ]

  const initialValues = useMemo(
    () => ({
      expense_type: null,
      invoice_id: "",
      value: null,
      description: "",
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      expense_type: defaultSchema,
      invoice_id: defaultSchema,
      value: defaultSchema,
      description: defaultSchema,
    })
  }, [])

  const onSubmit = (values) => {
    setSaveLoading(true)
    const data = {
      ...values,
      expense_type_id: values?.expense_type?.value,
    }
    delete data.expense_type
    postSettlement(data, { shipper_id })
      .then((res) => {
        history.go(-1)
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const routes = [
    {
      title: t(`settlements`),
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
          <Card title={t(`information`)} className="w-4/6 mb-4">
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <div className="flex justify-between items-baseline">
                  <div className="w-1/4">
                    <span className="input-label">{t("type.consumption")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="expense_type">
                      <Select
                        height={40}
                        id="expense_type"
                        options={findType}
                        value={values.expense_type}
                        onChange={(val) => {
                          setFieldValue("expense_type", val)
                          console.log("val", val)
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="flex justify-between items-baseline">
                  <div className="w-1/4">
                    <span className="input-label">{t("date")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="date">
                      <Input
                        size="large"
                        disabled
                        id="date"
                        type="date"
                        value={values.date}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="flex justify-between items-baseline">
                  <div className="w-1/4">
                    <span className="input-label">{t("invoice.number")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="invoice_id">
                      <Input
                        size="large"
                        id="invoice_id"
                        value={values.invoice_id}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="flex justify-between items-baseline">
                  <div className="w-1/4">
                    <span className="input-label">{t("sum")}</span>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="value">
                      <Input
                        size="large"
                        id="value"
                        type="number"
                        value={values.value}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="flex justify-between items-baseline">
                  <div className="w-1/4">
                    <span className="input-label">{t("description")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="description">
                        <TextArea
                          className="px-4 py-3"
                          placeholder={t("enter.description")}
                          value={values.description}
                          id="description"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
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
