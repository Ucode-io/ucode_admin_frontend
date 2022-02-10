import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
//components
import { Input } from "alisa-ui"
import Form from "../../../../../../components/Form/Index"
import Card from "../../../../../../components/Card"
import Select from "../../../../../../components/Select"

export default function RightContent({
  formik,
  history,
  faresOptions,
  menuOptions,
  regionsOptions,
}) {
  const { t } = useTranslation()
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

  const params = useParams()
  const { values, handleChange, setFieldValue } = formik

  const changeWeekArray = (e) => {
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
  }
  // const [isBranchOrder, setIsBranchOrder] = useState(true)

  return (
    <div className="col-span-5">
      <Card className="mb-4" title={t("schedule")}>
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
                className="w-5 h-5 rounded w-1/5 "
                value={elm.id}
                type="checkbox"
              />
            </div>
          </div>
        ))}
      </Card>

      <Card title={t("settings.branch")}>
        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="order">{t("limit.order")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="orders_limit">
              <Input
                size="large"
                id="orders_limit"
                suffix="Шт"
                type="number"
                name="orders_limit"
                value={values.orders_limit}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="menu_id">{t("menu_list")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="menu_id">
              <Select
                height={40}
                id="menu_id"
                options={menuOptions}
                value={menuOptions.find((elm) => elm.value === values.menu_id)}
                onChange={(elm) => setFieldValue("menu_id", elm.value)}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="fare_id">{t("fares")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="fare">
              <Select
                height={40}
                id="fare"
                options={faresOptions}
                value={values.fare}
                onChange={(val) => setFieldValue("fare", val)}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="region">{t("cities")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="region">
              <Select
                height={40}
                id="region"
                options={regionsOptions}
                value={values.region}
                onChange={(val) => setFieldValue("region", val)}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  )
}
