import React, { useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"

import { Input } from "alisa-ui"

//components
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import TextArea from "../../../../components/Textarea"
import Select from "../../../../components/Select"
import {  postNew, updateNew } from "../../../../services/news"
import { useSelector } from "react-redux"
import { getShippers } from "../../../../services"
import CustomSkeleton from "../../../../components/Skeleton"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

export default function CreateNew() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [shipper, setShipper] = useState([])
  const [loader, setLoader] = useState(true)
  const lang = useSelector((state) => state.lang.current)

  // const getShippersFunction = () => {
  //   setLoader(true)
  //   getShippers()
  //     .then((res) => {
  //       setShipper(res?.shippers)
  //     })
  //     .finally(() => setLoader(false))
  // }

  // const getNew = () => {
  //   if (!id) return setLoader(false)
  //   setLoader(true)
  //   getOneNew(id)
  //     .then((res) => {
  //       formik.setValues({
  //         name: res.name,
  //         description: res.description,
  //         shipper_ids: res.shippers.map(({ id }, _) => id),
  //       })
  //     })
  //     .finally(() => setLoader(false))
  // }

  // useEffect(() => {
  //   getShippersFunction()
  //   getNew()
  // }, [])

  const initialValues = useMemo(
    () => ({
      name: { en: "", ru: "", uz: "" },
      description: { en: "", ru: "", uz: "" },
      shipper_ids: [],
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      name: yup.object({
        en: defaultSchema,
        ru: defaultSchema,
        uz: defaultSchema,
      }),
      description: yup.object({
        en: defaultSchema,
        ru: defaultSchema,
        uz: defaultSchema,
      }),
      shipper_ids: yup.array().min(1, t("required.field.error")),
    })
  }, [])

  const shippers =
    shipper &&
    shipper.length &&
    shipper.map(({ id, name }, _) => ({ label: name, value: id }))

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateNew(id, data) : postNew(data)

    selectedAction
      .then((res) => {
        history.goBack()
      })
      .catch((err) => console.log("err", err))
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges({
      name: values.name,
      description: values.description,
      shipper_ids: values.shipper_ids,
    })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("marketing"),
      link: true,
      route: `/home/marketing/news`,
    },
    // {
    //   title: t("company.collection"),
    //   link: true,
    //   route: `/home/catalog/news`,
    // },
    {
      title: id ? formik.values?.name[lang] : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue } = formik

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
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
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("add.new.category")}>
            <div className="w-full grid grid-cols-12">
              <div className="col-span-12">
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.uz"
                      label={t("name.in.uz")}
                    >
                      <Input
                        id="name.uz"
                        value={values.name?.uz}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.ru"
                      label={t("name.in.ru")}
                    >
                      <Input
                        id="name.ru"
                        value={values.name?.ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.en"
                      label={t("name.in.en")}
                    >
                      <Input
                        id="name.en"
                        value={values.name?.en}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="description.uz"
                      label={t("description.in.uz")}
                    >
                      <TextArea
                        id="description.uz"
                        value={values.description.uz}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="description.ru"
                      label={t("description.in.ru")}
                    >
                      <TextArea
                        id="description.ru"
                        value={values.description.ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="description.en"
                      label={t("description.in.en")}
                    >
                      <TextArea
                        id="description.en"
                        value={values.description.en}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="shipper_ids"
                      label={t("branches")}
                    >
                      <Select
                        id="shipper_ids"
                        isMulti
                        value={
                          shippers && shippers.length
                            ? shippers.filter((item) =>
                                values.shipper_ids.includes(item.value)
                              )
                            : ""
                        }
                        onChange={(val) => {
                          setFieldValue(
                            "shipper_ids",
                            val && val.length
                              ? val.map((item) => item.value)
                              : ""
                          )
                        }}
                        options={shippers}
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
