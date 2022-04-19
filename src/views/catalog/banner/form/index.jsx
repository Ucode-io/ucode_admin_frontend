import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { CircularProgress } from "@material-ui/core"
import { Input } from "alisa-ui"

//components and functions
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import Gallery from "../../../../components/Gallery"
import { getOneBanner, postBanner, updateBanner } from "../../../../services/banner"
import Select from "../../../../components/Select"
// import { getRegions } from "../../../../services/region"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

const shipper_id = "a3361f16-3076-4d50-83bd-38cc9dede994"
export default function CreateBanner() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const [regions, setRegions] = useState([])
  const lang = useSelector(state => state.lang.current)

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOneBanner(id)
      .then((res) => {
        formik.setValues({
          title: res.title,
          image: res.image.replace("https://cdn.rasta.app/rasta/", ""),
          region: {
            label: res.name,
            value: res.region_id
          }
        })
      })
      .finally(() => setLoader(false))
  }

  const fetchData = async () => {
    // setLoader(true)
    // try {
    //   const { regions } = await getRegions({ limit: 1000 })
    //   setRegions(regions ? regions.map(elm => ({ label: elm.name, value: elm.id })) : [])
    // } catch (e) {
    //   console.log(e)
    // } finally {
    //   setLoader(false)
    // }
  }

  useEffect(() => {
    fetchData()
    getItem()
  }, [])

  const initialValues = useMemo(() => ({
    image: "",
    title: { en: "", ru: "", uz: "" },
  }), [])

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      title: yup.object({
        en: defaultSchema, ru: defaultSchema, uz: defaultSchema
      })

    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateBanner(id, data) : postBanner(data)
    selectedAction
      .then((res) => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }


  const onSubmit = (values) => {
    const data ={
      ...values,
      position: "something",
      image: `/${values.image}`,
      region_id: values.region.value
    }
    delete data.region
    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema
  })

  if (loader)
    return (
      <div className="w-full flex align-center justify-center">
        <CircularProgress />
      </div>
    )

  const routes = [
    {
      title: t("catalog"),
      link: true,
      route: `/home/catalog`
    },
    {
      title: t("banner"),
      link: true,
      route: `/home/catalog/banner`
    },
    {
      title: id ? formik.values?.title[lang] : t("create")
    }
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik


  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={[<Button
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
            </Button>
          ]}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("add.new.banner")}>
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12 sm:col-span-2 text-center">
                <Gallery
                  width="100%"
                  aspectRatio="1"
                  gallery={values.image ? [values.image] : []}
                  setGallery={elm => {
                    setFieldValue("image", elm[0])
                  }}
                  multiple={false}
                />
                <span className="text-primary">{t("Изображение товара")}</span>
              </div>
              <div className="col-span-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 items-end">
                  <div>
                    <Form.Item formik={formik} name="title.uz" label={t("name.in.uz")}>
                      <Input size="large" id="title.uz" value={values.title?.uz} onChange={handleChange} />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="title.ru" label={t("name.in.ru")}>
                      <Input size="large" id="title.ru" value={values.title?.ru} onChange={handleChange} />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="title.en" label={t("name.in.en")}>
                      <Input size="large" id="title.en" value={values.title?.en} onChange={handleChange} />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="region" label={t("regions")}>
                      <Select
                        height={40}
                        id="region"
                        options={regions}
                        value={values.region}
                        onChange={val => {
                          setFieldValue("region", val)
                        }}
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