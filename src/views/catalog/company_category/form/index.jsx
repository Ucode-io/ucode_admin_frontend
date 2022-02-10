import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"

//components and functions
import {
  getOneCompanyCategory,
  postCompanyCategory,
  updateCompanyCategory,
} from "../../../../services/company_category"
import { getShippers } from "../../../../services"

import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import Select from "../../../../components/Select"
import Gallery from "../../../../components/Gallery"
import CustomSkeleton from "../../../../components/Skeleton"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

export default function CreateCompanyCategory() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [shipper, setShipper] = useState([])
  const [loader, setLoader] = useState(true)
  const lang = useSelector((state) => state.lang.current)

  const getShippersFunction = () => {
    setLoader(true)
    getShippers({ limit: 1000 })
      .then((res) => {
        setShipper(res?.shippers)
      })
      .finally(() => setLoader(false))
  }

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOneCompanyCategory(id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          shipper_ids: res.shippers.map(({ id }, _) => id),
          image: res.image.replace("https://cdn.rasta.app/rasta/", ""),
        })
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getShippersFunction()
    getItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialValues = useMemo(
    () => ({
      image: "",
      name: { en: "", ru: "", uz: "" },
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
      shipper_ids: yup.array().min(1, t("required.field.error")),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shippers =
    shipper &&
    shipper.length &&
    shipper.map(({ id, name }, _) => ({ label: name, value: id }))

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id
      ? updateCompanyCategory(id, data)
      : postCompanyCategory(data)
    selectedAction
      .then((res) => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges({
      ...values,
      discount_type: "something",
      discount_value: 0,
      image: `${process.env.REACT_APP_MINIO_URL}/` + values.image,
    })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  const routes = [
    // {
    //   title: t("marketing"),
    //   link: true,
    //   route: `/home/marketing/company_category`,
    // },
    {
      title: t("company_category"),
      link: true,
      route: `/home/marketing/company_category`,
    },
    {
      title: id ? formik.values?.name[lang] : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue } = formik

  return (
    <div className="w-full">
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
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12 sm:col-span-2 text-center">
                <Gallery
                  width="100%"
                  aspectRatio="1"
                  gallery={values.image ? [values.image] : []}
                  setGallery={(elm) => {
                    setFieldValue("image", elm[0])
                  }}
                  multiple={false}
                />
                <div className="text-primary text-sm mt-2">
                  {t("Изображение товара")}
                </div>
              </div>
              <div className="col-span-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 items-end">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.uz"
                      label={t("name.in.uz")}
                    >
                      <Input
                        size="large"
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
                        size="large"
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
                        size="large"
                        id="name.en"
                        value={values.name?.en}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="shipper_ids"
                      label={t("branches")}
                    >
                      <Select
                        height={40}
                        isMulti
                        value={
                          shippers && shippers.length
                            ? shippers.filter((item) =>
                                values.shipper_ids.includes(item.value)
                              )
                            : []
                        }
                        onChange={(val) => {
                          setFieldValue(
                            "shipper_ids",
                            val && val.length
                              ? val.map((item) => item.value)
                              : []
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
