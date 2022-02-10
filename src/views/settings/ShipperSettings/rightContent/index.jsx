import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

//components
import Form from "../../../../components/Form/Index"
import Card from "../../../../components/Card"
import { Input } from "alisa-ui"
import "./style.scss"

export default function RightContent({ formik }) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik
  const [weekArray, setWeekArray] = useState([
    {
      id: 1,
      title: "monday",
      isChecked: true,
    },
    {
      id: 2,
      title: "tuesday",
      isChecked: true,
    },
    {
      id: 3,
      title: "wednesday",
      isChecked: true,
    },
    {
      id: 4,
      title: "thursday",
      isChecked: true,
    },
    {
      id: 5,
      title: "friday",
      isChecked: true,
    },
    {
      id: 6,
      title: "saturday",
      isChecked: true,
    },
    {
      id: 7,
      title: "sunday",
      isChecked: true,
    },
  ])

  const changeWeekArray = useCallback(
    (e) => {
      setWeekArray((prev) =>
        prev.map((item) =>
          String(item.id) === e.target.value
            ? {
                ...item,
                isChecked: !item.isChecked,
              }
            : item
        )
      )
    },
    [setWeekArray]
  )

  return (
    <div className="col-span-6">
      <Card className="col-span-6" title={t("schedule")}>
        <div className="grid grid-cols-1 gap-x-6">
          <div>
            <Form.Item
              formik={formik}
              name="work_hour_start"
              label={t("start.of.working.hours")}
            >
              <Input
                size="large"
                id="work_hour_start"
                type="time"
                value={values.work_hour_start}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              formik={formik}
              name="work_hour_end"
              label={t("end.of.working.hours")}
            >
              <Input
                size="large"
                id="work_hour_end"
                type="time"
                value={values.work_hour_end}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          {/* <div>
            <Form.Item formik={formik} name="enable_courier_working_hours" label={t("courier.working.hours")}>
              <div className='flex gap-3 mt-1'>
                <Switch id="enable_courier_working_hours" checked={values.enable_courier_working_hours} onChange={val => setFieldValue('enable_courier_working_hours', val)} />
                <div className="font-medium	text-blue-900">{t(values.enable_courier_working_hours ? 'enabled' : 'disabled')}</div>
              </div>
            </Form.Item>
          </div> */}
        </div>

        {weekArray.map((elm) => (
          <div className="flex w-full items-baseline" key={elm.id}>
            <div className="w-1/5 input-label">{t(elm.title)}</div>
            <div className="w-4/5 flex gap-x-3 items-baseline">
              <div className="w-2/5">
                <Form.Item formik={formik}>
                  <Input disabled={!elm.isChecked} id="monday" type="time" />
                </Form.Item>
              </div>
              <div className="w-2/5">
                <Form.Item formik={formik}>
                  <Input disabled={!elm.isChecked} id="monday" type="time" />
                </Form.Item>
              </div>
              <input
                onChange={changeWeekArray}
                checked={elm.isChecked}
                className="w-5 h-5 rounded w-1/5"
                value={elm.id}
                type="checkbox"
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
