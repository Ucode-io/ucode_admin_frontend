import React, { useEffect, useState, useMemo, useCallback } from "react"
import "./style.css"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"

//components and functions
// import Modal from '../../../../components/Modal'
import Header from "../../../../components/Header"
import Breadcrumb from "../../../../components/Breadcrumb"
import LeftContent from "./components/leftContent"
import RightContent from "./components/rightContent"
import CustomSkeleton from "../../../../components/Skeleton"
import Button from "../../../../components/Button"
import Filters from "../../../../components/Filters"
import Users from "./users"
import {
  getMenus,
  getBranchById,
  updateBranch,
  postBranch,
} from "../../../../services"
import { getRegions } from "../../../../services/region"

//icons
import FareService from "../../../../services/fare"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs"
import AddIcon from "@material-ui/icons/Add"

export default function CreateClient() {
  const { t } = useTranslation()
  const { id, branch_id } = useParams()
  const history = useHistory()

  const [loader, setLoader] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [faresOptions, setFaresOptions] = useState([])
  const [menuOptions, setMenuOptions] = useState([])
  const [regionsOptions, setRegionsOptions] = useState([])
  const [selectedTab, setSelectedTab] = useState("about.branch")

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

  const headersByTab = useMemo(() => {
    switch (selectedTab) {
      case "about.branch":
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
      default:
        return [
          [
            <Button
              size="medium"
              icon={AddIcon}
              onClick={() => history.push(`/home/company/users/create/${id}`)}
            >
              {t("add")}
            </Button>,
          ],
        ]
    }
  }, [selectedTab])

  // const [deleteLoading, setDeleteLoading] = useState(false)
  const { getFares } = FareService

  const initialValues = useMemo(
    () => ({
      address: "",
      destination: "",
      fare: null,
      menu_id: "",
      image: "",
      location: null,
      region: null,
      name: "",
      orders_limit: 0,
      phone: "",
      work_hour_end: "00:00",
      work_hour_start: "05:00",
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
      name: defaultSchema,
      address: defaultSchema,
      work_hour_start: defaultSchema,
      work_hour_end: defaultSchema,
      // fair_id: defaultSchema,
      destination: defaultSchema,
      menu_id: defaultSchema,
      region: defaultSchema,
      fare: defaultSchema,
    })
  }, [])

  useEffect(() => {
    fetchFares()
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoader(true)
    if (!branch_id) return setLoader(false)
    try {
      const app = await getBranchById("", branch_id)
      formik.setValues({
        ...app,
        region: {
          label: app.region_name,
          value: app.region_id,
        },
        fare: {
          label: app.fare_name,
          value: app.fare_id,
        },
        phone: app.phone.replace("+998", ""),
        image: app.image.replace(process.env.REACT_APP_MINIO_URL, ""),
      })
      console.log(app)
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }

  const onSubmit = (values) => {
    setSaveLoading(true)

    const form = {
      ...values,
      phone: "+998" + values.phone,
      image: branch_id ? values.image : `/${values.image}`,
      fare_id: values.fare?.value,
      region_id: values.region?.value,
      // menu_id: values.menu.value
    }
    delete form.region
    delete form.fare

    if (branch_id) {
      updateBranch(form, branch_id, { shipper_id: id })
        .then((res) => {
          console.log(res)
          history.go(-1)
        })
        .catch((err) => console.log(err))
        .finally(() => setSaveLoading(false))
    } else {
      postBranch(form, { shipper_id: id })
        .then((res) => {
          console.log(res)
          history.go(-1)
        })
        .catch((e) => console.log(e))
        .finally(() => setSaveLoading(false))
    }
  }

  const fetchFares = (params = { limit: 1000, page: 1 }) => {
    getFares(params).then((res) => {
      if (res.fares) {
        setFaresOptions(
          res.fares.map((elm) => ({ label: elm.name, value: elm.id }))
        )
      }
    })
    getMenus({ ...params, shipper_id: id }).then((res) => {
      if (res.menus) {
        setMenuOptions(
          res.menus.map((el) => ({ label: t(el.name.en), value: el.id }))
        )
      }
    })
    getRegions(params).then((res) => {
      if (res.regions) {
        setRegionsOptions(
          res.regions.map((el) => ({ label: el.name, value: el.id }))
        )
      }
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
      title: t("list.of.branches"),
      link: true,
      route: `/home/company/shipper-company/${id}`,
    },
    {
      title: branch_id ? formik.values.name : t("create"),
    },
  ]

  if (loader) return <CustomSkeleton />

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={headersByTab}
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
              label={tabLabel(t("about.branch"))}
              value="about.branch"
            />
            <StyledTab label={tabLabel(t("users"))} value="users" />
          </StyledTabs>
        </Filters>

        <TabBody tab="about.branch">
          <div
            className="p-4 w-full grid grid-cols-11 gap-4 box-border font-body"
            style={{ fontSize: "14px", lineHeight: "24px" }}
          >
            <LeftContent formik={formik} />
            <RightContent
              formik={formik}
              history={history}
              regionsOptions={regionsOptions}
              menuOptions={menuOptions}
              faresOptions={faresOptions}
              saveLoading={saveLoading}
              onDelete={() => setVisible(true)}
              setLoader={setLoader}
            />
          </div>
        </TabBody>
        <TabBody tab="users">
          <Users shipper_id={id} branch_id={branch_id} />
        </TabBody>
      </form>
    </div>
  )
}
