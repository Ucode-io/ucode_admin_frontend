import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import { useParams } from "react-router-dom"
import Header from "components/Header"
import Breadcrumb from "components/Breadcrumb"
import Button from "components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { showAlert } from "redux/actions/alertActions"
import * as yup from "yup"
import SwipeableViews from "react-swipeable-views"
import { TabPanel } from "components/Tab/TabBody"
import { useTheme } from "@material-ui/core/styles"
import GeneralInformation from "./GeneralInformation"
import CustomSkeleton from "components/Skeleton"
// import {getPromo, postPromo, updatePromo} from "../../../../services/promotion";

export default function CategoryCreate() {
  const { id } = useParams()
  const [value, setValue] = useState(0)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const theme = useTheme()

  const [buttonLoader, setButtonLoader] = useState(false)
  const [loader, setLoader] = useState(true)

  const fetchData = () => {
    // setLoader(true)
    // if (!id) return setLoader(false)
    // getPromo(id)
    //     .then((res) => {
    //       console.log(res)
    //       formik.setValues({
    //         description_ru: res?.description.ru,
    //         description_uz: res?.description.uz,
    //         description_en: res?.description.en,
    //         image: res?.image.replace("https://test.cdn.delever.uz/delever/", ""),
    //         title_ru: res?.title.ru,
    //         title_uz: res?.title.uz,
    //         title_en: res?.title.en,
    //         start_date: "",
    //         end_date: "",
    //       })
    //     })
    //     .finally(() => setLoader(false))
  }

  const saveChanges = (data) => {
    // console.log("data", data)
    // setButtonLoader(true)
    // if (id) {
    //   updatePromo(id, data)
    //       .then(() => history.go(-1))
    //       .catch((err) =>
    //           dispatch(showAlert(t(err?.data?.Error?.Message ?? err?.data?.Error))),
    //       )
    //       .finally(() => setButtonLoader(false))
    // } else {
    //   postPromo(data)
    //       .then(() => history.go(-1))
    //       .catch((err) =>
    //           dispatch(showAlert(t(err.data?.Error?.Message ?? err?.data?.Error))),
    //       )
    //       .finally(() => setButtonLoader(false))
    // }
  }

  const onSubmit = (data) => {
    // const start_time= data.start_date ? Math.round(`${data.start_date.split("-")[2]}-${
    //     data.start_date.split("-")[1]
    // }-${data.start_date.split("-")[0]}` / 1000) : ''
    // const end_time = data.end_date ? Math.round(`${data.end_date.split("-")[2]}-${
    //     data.end_date.split("-")[1]
    // }-${data.end_date.split("-")[0]}` / 1000) : ''

    const value = {
      description: {
        ru: values.description_ru,
        uz: values.description_uz,
        en: values.description_en,
      },
      image: values.image,
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      start_time: data.start_date,
      end_time: data.end_time,
    }
    saveChanges(value)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const initialValues = useMemo(
      () => ({
        description_ru: '',
        description_uz: '',
        description_en: '',
        image: '',
        title_ru: '',
        title_uz: '',
        title_en: '',
      }),
      [],
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))

    return yup.object().shape({
      title_ru: defaultSchema,
      title_uz: defaultSchema,
      title_en: defaultSchema,
    })
  }, [])

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const { values, handleChange, handleSubmit, setFieldValue } = formik

  const routes = [
    {
      title: <div>{t("list.stocks")}</div>,
      link: true,
      route: `/home/marketing/stocks`,
    },
    {
      title: id ? formik?.values.title_ru : t("create"),
    },
  ]

  // Tabs

  const handleChangeIndex = (index) => setValue(index)

  return (
      <>
        {loader ? (
            <CustomSkeleton />
        ) : (
            <>
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
                <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <GeneralInformation
                        formik={formik}
                        handleChange={handleChange}
                        values={values}
                        setFieldValue={setFieldValue}
                    />
                  </TabPanel>
                </SwipeableViews>
              </form>
            </>
        )}
      </>
  )
}
