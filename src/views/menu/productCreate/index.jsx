import "./style.scss"
import React, { useEffect } from "react"
import axios from "../../../utils/axios"
import Header from "../../../components/Header"
import * as yup from "yup"
import Breadcrumb from "../../../components/Breadcrumb"
import MainContent from "./MainContent"
import { useFormik } from "formik"
import OptionsContent from "./OptionsContent"
import { useTranslation } from "react-i18next"
import { useState, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom"
import CustomSkeleton from "../../../components/Skeleton"
import Button from "../../../components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"

// const menu_id = 'a3361f16-3076-4d50-83bd-38cc9dede994'
//const shipper_id = "a3361f16-3076-4d50-83bd-38cc9dede994" //static shipper id

export default function ProductCreate() {
  const { t, i18n } = useTranslation()
  const { id, menu_id, shipper_id } = useParams()
  const history = useHistory()

  const [loader, setLoader] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [options, setOptions] = useState([])
  const [ingredients, setIngredients] = useState([])

  const initialValues = useMemo(
    () => ({
      image: "fb725b0c-e781-4029-a724-0f0e801377b4",
      // price: '',
      category: { label: "", value: "" },
      order_no: "",
      name: { uz: "", ru: "", en: "" },
      description: { uz: "", ru: "", en: "" },
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      category: defaultSchema,
      order_no: yup.number().min(1).required(t("required.field.error")),
      name: yup.object({
        uz: defaultSchema,
        ru: defaultSchema,
        en: defaultSchema,
      }),
      price: defaultSchema,
    })
  }, [])

  useEffect(() => {
    fetchData()
    getCategories()
    getIngredients()
  }, [])

  const fetchData = () => {
    if (!id) return setLoader(false)
    axios
      .get("/product/" + id, { headers: { shipper: menu_id } })
      .then((res) => {
        formik.setValues({
          image: res?.image?.replace("https://cdn.rasta.app/rasta/", ""),
          category: { label: res.category_name.ru, value: res.category_id },
          order_no: res.order_no,
          name: res.name,
          description: res.description,
          price: res.price,
        })
        setOptions(res.options)
      })
      .finally(() => setLoader(false))
  }

  const saveChanges = (data) => {
    setSaveLoading(true)

    const createParams = {
      url: "/product",
      method: "POST",
      headers: {
        shipper: menu_id,
      },
    }

    const editParams = {
      url: "/product/" + id,
      method: "PUT",
      headers: {
        shipper: menu_id,
      },
    }

    const selectedParams = id ? editParams : createParams

    axios({ ...selectedParams, data })
      .then((res) => history.goBack())
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const newOptions = options.map((item) => {
      // delete item.default
      return { ...item, is_required: true }
    })
    saveChanges({
      name: values.name,
      title: values.name,
      description: values.description,
      category_id: values.category.value,
      image: `${process.env.REACT_APP_MINIO_URL}/` + values.image,
      order_no: values.order_no,
      menu_id: menu_id,
      shipper_id,
      is_active: true,
      price: values.price,
      options: newOptions,
    })
  }

  const getCategories = () => {
    axios
      .get("/category", { params: { all: true, menu_id: menu_id } })
      .then((res) => {
        if (res.categories)
          setCategories(
            res.categories.map((elm) => ({ label: elm.name.ru, value: elm.id }))
          )
      })
      .catch((err) => console.log(err))
  }

  const getIngredients = () => {
    axios
      .get(`/ingredients?limit=100&shipper_id=${shipper_id}`)
      .then((res) => {
        if (res.ingredients) setIngredients(res.ingredients)
        console.log("ingredients", res)
      })
      .catch((err) => console.log(err))
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const routes = [
    {
      title: t("catalog"),
      link: true,
      route: `/home/company/shipper-company/menu/${menu_id}`,
    },
    {
      title: t("products"),
      link: true,
      route: `/home/company/shipper-company/menu/${menu_id}`,
    },
    {
      title: id ? formik.values?.name?.ru : t("create"),
    },
  ]

  if (loader) return <CustomSkeleton />

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Header
          title={t("product")}
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

        <div
          className="p-4 w-full flex flex-col gap-4 box-border font-body"
          style={{ fontSize: "14px", lineHeight: "24px" }}
        >
          <MainContent formik={formik} categories={categories} />
          <OptionsContent
            formik={formik}
            options={options}
            onOptionsChange={setOptions}
            saveLoading={saveLoading}
            ingredients={ingredients}
          />
        </div>
      </form>
    </div>
  )
}
