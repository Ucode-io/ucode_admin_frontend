import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"
import { useTranslation } from "react-i18next"

//components
import Header from "../../components/Header"
import Breadcrumb from "../../components/Breadcrumb"
import Button from "../../components/Button"
import Client from "./form"

import "./style.scss"
import { getOneCustomer, postCustomer, updateCustomer } from "../../services"
import CustomSkeleton from "../../components/Skeleton"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { StyledTab, StyledTabs } from "../../components/StyledTabs"
import Filters from "../../components/Filters"
import { getCustomerType } from "../../services/customerType"
import OrderClient from "./form/clientOrders"

export default function CreateClient() {
  const { t } = useTranslation()
  const { id } = useParams()
  const history = useHistory()

  console.log("customer_id", id)

  const [loader, setLoader] = useState(true)
  const [buttonLoader, setButtonLoader] = useState(false)
  const [customerTypeOption, setCustomerTypeOption] = useState([])
  const [selectedTab, setSelectedTab] = useState("about.client")

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>
  }

  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children
      return <></>
    },
    [selectedTab]
  )

  const fetchItems = async () => {
    try {
      const { customer_types } = await getCustomerType({ limit: 1000 })
      setCustomerTypeOption(
        customer_types
          ? customer_types.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchData()
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialValues = useMemo(
    () => ({
      name: "",
      phone: null,
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))

    return yup.object().shape({
      name: defaultSchema,

      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .required(t("required.field.error")),
    })
  }, [])

  const fetchData = () => {
    if (!id) return setLoader(false)
    getOneCustomer(id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          phone: res.phone?.substring(4),
          is_aggregate: res.is_aggregate,
        })
      })
      .finally(() => setLoader(false))
  }

  const saveChanges = (data) => {
    setButtonLoader(true)
    const selectedAction = id ? updateCustomer(id, data) : postCustomer(data)

    selectedAction
      .then((res) => history.push("/home/personal/clients"))
      .finally(() => setButtonLoader(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      phone: "+998" + values.phone,
      is_aggregate: formik?.values.is_aggregate ?? false,
    }
    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const routes = [
    {
      title: <div>{t("clients")}</div>,
      link: true,
      route: "/home/personal/clients",
    },
    {
      title: id ? formik?.values.name : t("create"),
    },
  ]

  if (loader) return <CustomSkeleton />

  const { handleSubmit } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={[
            <Button
              icon={CancelIcon}
              size="large"
              shape="outlined"
              color="red"
              iconClassName="red"
              borderColor="bordercolor"
              onClick={() => history.goBack()}
            >
              {t("cancel")}
            </Button>,
            <Button
              icon={SaveIcon}
              size="large"
              type="submit"
              loading={buttonLoader}
            >
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />
        <Filters>
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => setSelectedTab(value)}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab
              label={tabLabel(t("about.client"))}
              value="about.client"
            />
            {id && <StyledTab label={tabLabel(t("orders"))} value="orders" />}
          </StyledTabs>
        </Filters>

        <TabBody tab="about.client">
          <Client customerTypeOption={customerTypeOption} formik={formik} />
        </TabBody>
        <TabBody tab="orders">
          <OrderClient customer_id={id} />
        </TabBody>
      </form>
    </div>
  )
}
