import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"
import Gallery from "../../../../components/Gallery"
import Select from "../../../../components/Select"
import Switch from "../../../../components/Switch"
import { Radio, RadioGroup } from "../../../../components/Radio"
import RangePicker from "../../../../components/DatePicker/RangePicker"

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
import TabsWithFlags from "../../../../components/StyledTabs/TabsWithFlags"

export default function BannerForm() {
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
      type: null,
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
      title: t("list.of.banners"),
      link: true,
      route: `/home/marketing/newsletter`,
    },
    {
      title: id ? formik.values?.name : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik

  const cardFooter = [
    <Button size="large" shape="outlined" onClick={() => history.goBack()}>
      {t("cancel")}
    </Button>,
    <Button size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ]

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          // title={null}
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={cardFooter}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("general.information")}>
            <TabsWithFlags />
            <div className="flex gap-8">
              <div>
                <Gallery multiple={false} width={120} aspectRatio="1" />
              </div>
              <div className="grid grid-cols-4 items-baseline flex-1">
                <div>{t("name")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="name">
                    <Input size="large" />
                  </Form.Item>
                </div>
                <div>{t("title")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="title">
                    <Input size="large" />
                  </Form.Item>
                </div>
                <div>{t("description")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="description">
                    <Input size="large" />
                  </Form.Item>
                </div>
                <div>{t("text")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="text">
                    <Input size="large" />
                  </Form.Item>
                </div>

                <div>{t("period (date)")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="text">
                    <RangePicker
                      hideTimePicker
                      style={{ height: 36 }}
                      placeholder={t("order.period")}
                    />
                  </Form.Item>
                </div>
                <div>{t("period (Time)")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="text">
                    <RangePicker
                      hideTimePicker
                      style={{ height: 36 }}
                      placeholder={t("order.period")}
                    />
                  </Form.Item>
                </div>

                <div>{t("type")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="type">
                    <RadioGroup
                      className="flex gap-4"
                      onChange={(val) => setFieldValue("type", val)}
                    >
                      <Radio checked={values.type === true} value={true}>
                        {t("scheduled")}
                      </Radio>
                      <Radio checked={values.type === false} value={false}>
                        {t("one-time")}
                      </Radio>
                    </RadioGroup>
                  </Form.Item>
                </div>
                <div>{t("restaurant")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="restaurant">
                    <Select height={36} />
                  </Form.Item>
                </div>
                <div>{t("status")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="name">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked={true} />
                      Активный
                    </div>
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
