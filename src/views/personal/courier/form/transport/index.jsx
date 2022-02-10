import Card from "../../../../../components/Card"
import Form from "../../../../../components/Form/Index"
import { Input } from "alisa-ui"
import Select from "../../../../../components/Select"
import React from "react"
import { useTranslation } from "react-i18next"

export default function CreateTransport({ formik }) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik

  return (
    <div className="p-4 w-full">
      <Card title={t("transport")} className="w-7/12">
        <div className="flex items-baseline">
          <span className="w-1/4 input-label">{t("brand.cars")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik}>
              <Select height={40} id="" onChange={(val) => console.log(val)} />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="w-1/4 input-label">{t("model")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik}>
              <Select height={40} id="" onChange={(val) => console.log(val)} />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="w-1/4 input-label">{t("car.number")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik}>
              <Input size="large" id="" />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  )
}
