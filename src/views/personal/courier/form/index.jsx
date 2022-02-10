import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"

//components and functions
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Button from "../../../../components/Button"
import {
  getCourier,
  postCourier,
  updateCourier,
} from "../../../../services/courier"
import { getCourierTypes } from "../../../../services/courierType"
import { getRegions } from "../../../../services/region"
import CustomSkeleton from "../../../../components/Skeleton"
import CreateCourier from "./Create"
//icons
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs"
import Filters from "../../../../components/Filters"
import CreateTransport from "./transport"
import TransactionTable from "./transactions"
import OrderCourier from "./orders"
import AddIcon from "@material-ui/icons/Add"

export default function MainCourier() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const [courierTypes, setCourierTypes] = useState([])
  const [regions, setRegions] = useState([])
  const [selectedTab, setSelectedTab] = useState("courier")

  useEffect(() => {
    fetchData()
    getItem()
  }, [])

  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children
      return <></>
    },
    [selectedTab]
  )

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>
  }

  const headersByTab = useMemo(() => {
    switch (selectedTab) {
      case "courier":
      case "transport":
        return [
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
            onClick={() => console.log()}
          >
            {t(id ? "save" : "create")}
          </Button>,
        ]
      case "transactions":
        return [
          <Button icon={AddIcon} size="medium" onClick={() => console.log("c")}>
            {t("add")}
          </Button>,
        ]
      case "orders":
        return [
          <Button icon={AddIcon} size="medium" onClick={() => console.log("c")}>
            {t("add")}
          </Button>,
        ]
      default:
        return []
    }
  }, [selectedTab])

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getCourier(id)
      .then((res) => {
        formik.setValues({
          first_name: res.first_name,
          last_name: res.last_name,
          max_orders_count: res.max_orders_count,
          phone: res.phone?.substring(4),
          region: {
            label: res.region_name,
            value: res.region_id,
          },
          courier_type: {
            label: res.courier_type?.name,
            value: res.courier_type?.id,
          },
          is_active: res.is_active,
        })
      })
      .finally(() => setLoader(false))
  }

  const fetchData = async () => {
    setLoader(true)
    try {
      const { courier_type } = await getCourierTypes({ limit: 1000 })
      setCourierTypes(
        courier_type
          ? courier_type.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )

      const { regions } = await getRegions({ limit: 1000 })
      setRegions(
        regions
          ? regions.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const initialValues = useMemo(
    () => ({
      first_name: "",
      last_name: "",
      phone: "",
      max_orders_count: null,
      courier_type: null,
      region: null,
      is_active: false,
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      first_name: defaultSchema,
      last_name: defaultSchema,
      max_orders_count: defaultSchema,
      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .required(t("required.field.error")),
      courier_type: defaultSchema,
      region: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateCourier(id, data) : postCourier(data)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      region_id: values?.region?.value,
      courier_type_id: values.courier_type.value,
      phone: "+998" + values.phone,
    }
    delete data.courier_type
    delete data.region
    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  console.log("selected", selectedTab)

  const routes = [
    {
      title: t("personal"),
      link: true,
      route: `/home/courier/list`,
    },
    {
      title: t("couriers"),
      link: true,
      route: `/home/courier/list`,
    },
    {
      title: id ? formik.values?.courier_type?.label : t("create"),
    },
  ]

  const { handleSubmit } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={headersByTab}
        />
        <Filters className="mb-0">
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => {
              setSelectedTab(value)
            }}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("main.page"))} value="courier" />
            {id && (
              <StyledTab label={tabLabel(t("transport"))} value="transport" />
            )}
            {id && (
              <StyledTab
                label={tabLabel(t("transactions"))}
                value="transactions"
              />
            )}
            {id && <StyledTab label={tabLabel(t("orders"))} value="orders" />}
          </StyledTabs>
        </Filters>

        <TabBody tab="courier">
          <CreateCourier
            formik={formik}
            regions={regions}
            courierTypes={courierTypes}
          />
        </TabBody>
        <TabBody tab="transport">
          <CreateTransport formik={formik} />
        </TabBody>
        <TabBody tab="transactions">
          <TransactionTable />
        </TabBody>
        <TabBody tab="orders">
          <OrderCourier courier_id={id} />
        </TabBody>
      </form>
    </div>
  )
}
