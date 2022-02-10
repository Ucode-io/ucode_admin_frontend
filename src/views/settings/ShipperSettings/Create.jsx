import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useState, useMemo, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"
import axios from "../../../utils/axios"

//components and function
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"
import Header from "../../../components/Header"
import Breadcrumb from "../../../components/Breadcrumb"
import LeftContent from "./leftContent"
import RightContent from "./rightContent"
import Filters from "../../../components/Filters"
import Branches from "../branches"
import Catalog from "../../menu"
import Button from "../../../components/Button"
import BranchUsers from "../../shipperCompany/branchUsers"
import Settlements from "../../shipperCompany/settlements"
import CustomSkeleton from "../../../components/Skeleton"
import { getRegions } from "../../../services/region"
import { getMenus, getOneShipper } from "../../../services"
import BottomContent from "./bottomContent"

import "./style.scss"
import AddIcon from "@material-ui/icons/Add"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { getFares } from "../../../services/fares"
import { useSelector } from "react-redux"
import StockTable from "../../shipperCompany/stock"
import RangePicker from "../../../components/DatePicker/RangePicker"
import moment from "moment"

export default function CreateClient() {
  const { t } = useTranslation()
  const { id } = useParams()
  const history = useHistory()

  const [loader, setLoader] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [createModal, setCreateModal] = useState(null)
  const [selectedTab, setSelectedTab] = useState("company")
  const [regionsOptions, setRegionsOptions] = useState([])
  const [faresOptions, setFaresOptions] = useState([])
  const [menuOptions, setMenuOptions] = useState([])
  const lang = useSelector((state) => state.lang.current)
  const [filters, setFilters] = useState({
    start_date: null,
    end_date: null,
  })
  useEffect(() => {
    fetchData()
    fetchItems()
  }, [])

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>
  }

  const initialValues = useMemo(
    () => ({
      logo: "fb725b0c-e781-4029-a724-0f0e801377b4",
      menu_image: "fb725b0c-e781-4029-a724-0f0e801377b4",
      name: "",
      call_center_tg: null,
      phone: "",
      work_hour_start: "",
      work_hour_end: "",
      enable_courier_working_hours: true,
      max_delivery_time: "",
      courier_accept_radius: "",
      description: "",
      region_ids: [],
      settlement_rate: "",
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .required(t("required.field.error")),
      // enable_courier_working_hours: yup.bool().required(t('required.field.error')),
      name: defaultSchema,
      work_hour_start: defaultSchema,
      work_hour_end: defaultSchema,
      max_delivery_time: defaultSchema,
      courier_accept_radius: defaultSchema,
      region_ids: yup.array().min(1, t("required.field.error")),
      settlement_rate: yup
        .number()
        .required(t("required.field.error"))
        .min(0, "Число должно находиться в интервале (0 - 100)")
        .max(100, "Число должно находиться в интервале (0 - 100)"),
    })
  }, [])

  const fetchItems = async (params = { limit: 1000, page: 1 }) => {
    setLoader(true)
    try {
      const { regions } = await getRegions(params)
      setRegionsOptions(
        regions
          ? regions.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )

      const { fares } = await getFares(params)
      setFaresOptions(
        fares
          ? fares.map((elm) => ({
              label: elm.name,
              value: elm.id,
              elm,
            }))
          : []
      )

      const { menus } = await getMenus({ ...params, shipper_id: id })
      setMenuOptions(
        menus
          ? menus.map((elm) => ({ label: t(elm.name[lang]), value: elm.id }))
          : []
      )
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const fetchData = () => {
    if (!id) return setLoader(false)
    getOneShipper(id)
      .then((res) => {
        formik.setValues({
          logo: res.logo.replace("https://cdn.rasta.app/rasta/", ""),
          menu_image: res.menu_image.replace(
            "https://cdn.rasta.app/rasta/",
            ""
          ),
          name: res.name,
          call_center_tg: res.call_center_tg,
          phone: res.phone[0]?.substring(4),
          work_hour_start: res.work_hour_start,
          work_hour_end: res.work_hour_end,
          enable_courier_working_hours: res.enable_courier_working_hoursue,
          max_delivery_time: res.max_delivery_time,
          courier_accept_radius: res.courier_accept_radius,
          description: res.description,
          region_ids: res.region_ids.map((id, _) => id),
          settlement_rate: res.settlement_rate,
        })
      })
      .finally(() => setLoader(false))
  }

  const saveChanges = (data) => {
    setSaveLoading(true)

    const createParams = {
      url: "/shippers",
      method: "POST",
    }

    const editParams = {
      url: "/shippers/" + id,
      method: "PUT",
    }

    const selectedParams = id ? editParams : createParams

    axios({ ...selectedParams, data })
      .then((res) => history.push("/home/company/shipper-company"))
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges({
      ...values,
      phone: ["+998" + values.phone],
      order_road: "way",
      logo: `/${values.logo}`,
      menu_image: `/${values.menu_image}`,
    })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const routes = [
    {
      title: t("restaurants"),
      link: true,
      route: "/home/company/shipper-company",
    },
    {
      title: id ? formik.values.name : t("create"),
    },
  ]

  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children
      return <></>
    },
    [selectedTab]
  )

  const headersByTab = useMemo(() => {
    switch (selectedTab) {
      case "company":
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
          >
            {t("save")}
          </Button>,
        ]
      case "branches":
        return [
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push(
                `/home/company/shipper-company/${id}/branches/create`
              )
            }
          >
            {t("add")}
          </Button>,
        ]
      case "menu":
        return [
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => setCreateModal(true)}
          >
            {t("add")}
          </Button>,
        ]
      case "branch_users":
        return [
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push(`/home/company/users/create/${id}`)}
          >
            {t("add")}
          </Button>,
        ]
      case "settlements":
        return [
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push(`/home/company/settlements/create/${id}`)
            }
          >
            {t("add")}
          </Button>,
        ]
      default:
        return []
    }
  }, [selectedTab])

  if (loader) return <CustomSkeleton />

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={headersByTab}
        />
        <Filters
          className="mb-0"
          extra={
            selectedTab === "settlements" && (
              <RangePicker
                hideTimePicker
                placeholder={t("order.period")}
                onChange={(e) => {
                  e[0] === null
                    ? setFilters((old) => ({
                        ...old,
                        start_date: undefined,
                        end_date: undefined,
                      }))
                    : setFilters((old) => ({
                        ...old,
                        start_date: moment(e[0]).format("YYYY-MM-DD"),
                        end_date: moment(e[1]).format("YYYY-MM-DD"),
                      }))
                }}
              />
            )
          }
        >
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
            <StyledTab
              label={tabLabel(id ? formik.values.name : t("create"))}
              value="company"
            />
            {id && <StyledTab label={tabLabel(t("stock"))} value="stock" />}
            {id && (
              <StyledTab label={tabLabel(t("branches"))} value="branches" />
            )}
            {id && <StyledTab label={tabLabel(t("menu"))} value="menu" />}
            {id && (
              <StyledTab label={tabLabel(t("users"))} value="branch_users" />
            )}
            {id && (
              <StyledTab
                label={tabLabel(t("settlements"))}
                value="settlements"
              />
            )}
          </StyledTabs>
        </Filters>

        <TabBody tab="company">
          <div
            className="p-4 w-full grid grid-cols-12 gap-4 box-border font-body"
            style={{ fontSize: "14px", lineHeight: "24px" }}
          >
            <LeftContent formik={formik} />
            <RightContent formik={formik} saveLoading={saveLoading} />
            <BottomContent
              fares={faresOptions}
              regionsOptions={regionsOptions}
              menuOptions={menuOptions}
              faresOptions={faresOptions}
              formik={formik}
            />
          </div>
        </TabBody>
        <TabBody tab="branches">
          <Branches />
        </TabBody>
        <TabBody tab="stock">
          <StockTable />
        </TabBody>
        <TabBody tab="menu">
          <Catalog
            shipper_id={id}
            createModal={createModal}
            setCreateModal={setCreateModal}
          />
        </TabBody>
        <TabBody tab="branch_users">
          <BranchUsers shipper_id={id} />
        </TabBody>
        <TabBody tab="settlements">
          <Settlements
            filters={filters}
            name={id && formik.values.name}
            shipper_id={id}
          />
        </TabBody>
      </form>
    </div>
  )
}
