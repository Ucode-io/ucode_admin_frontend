import "./style.scss"
import React, { useEffect } from "react"
import axios from "../../../utils/axios"
import Header from "../../../components/Header"
import * as yup from "yup"
import Breadcrumb from "../../../components/Breadcrumb"
import MainContent from "./MainContent"
import { useFormik } from "formik"
import { useTranslation } from "react-i18next"
import { useState, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom"
import Button from "../../../components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import CustomSkeleton from "../../../components/Skeleton"

export default function CategoryCreate() {
  const { t } = useTranslation()
  const history = useHistory()
  const { id, menu_id, shipper_id } = useParams()

  const [loader, setLoader] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  const initialValues = useMemo(
    () => ({
      image: "fb725b0c-e781-4029-a724-0f0e801377b4",
      // price: '',
      order_no: "",
      name: { uz: "", ru: "", en: "" },
      description: { uz: "", ru: "", en: "" },
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      order_no: yup.number().min(1).required(t("required.field.error")),
      name: yup.object({
        uz: defaultSchema,
        ru: defaultSchema,
        en: defaultSchema,
      }),
    })
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    if (!id) return setLoader(false)
    axios
      .get("/category/" + id, { headers: { shipper: menu_id } })
      .then((res) => {
        console.log(res)
        formik.setValues({
          image: res.image.replace("https://cdn.rasta.app/rasta/", ""),
          order_no: res.order_no,
          name: res.name,
          description: res.description,
          discount_type: {
            label: res.discount_type,
            value: res.discount_value,
          },
        })
      })
      .finally(() => setLoader(false))
  }

  const saveChanges = (data) => {
    setSaveLoading(true)

    const createParams = {
      url: "/category",
      method: "POST",
      headers: {
        shipper: menu_id,
      },
    }

    if (id) {
      data.is_active = true
    }

    const editParams = {
      url: "/category/" + id,
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
    saveChanges({
      // ...values,
      name: values.name,
      title: values.name,
      description: values.description,
      image: `${process.env.REACT_APP_MINIO_URL}/` + values.image,
      order_no: Number(values?.order_no),
      discount_type: String(values?.discount_type?.value),
      discount_value: values?.discount_value,
      shipper_id,
      menu_id,
    })
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
      title: t("categories"),
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
          <MainContent formik={formik} saveLoading={saveLoading} />
        </div>
      </form>
    </div>
  )
}
