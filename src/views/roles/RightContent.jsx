// import { useState, useEffect } from "react"
import Card from "../../components/Card/index"
import Form from "../../components/Form/Index"
import Switch from "../../components/Switch"
import { useTranslation } from "react-i18next"

export function RightContent({ value, formik, onChange = function () {} }) {
  // **** USE-HOOKS ****
  const { t } = useTranslation()
  // const [optionsList, setOptionsList] = useState(value)

  // **** FUNCTIONS ****

  // **** EVENTS ****

  return (
    <Card title={t("permissions")}>
      {/* permission */}
      <div className="w-full flex items-baseline">
        <div className="w-1/3">{t("application.status.control")}</div>
        <div className="w-2/3">
          <Form.Item name="applicationStatus" formik={formik}>
            <Switch
              id="applicationStatus"
              color="primary"
              checked={formik.values.applicationStatus}
              onChange={(val) => formik.setFieldValue("applicationStatus", val)}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  )
}
