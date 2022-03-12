import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import {
  getV2Category,
  getV2Categories,
  postV2Category,
  updateV2Category,
} from "services";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "redux/actions/alertActions";
import * as yup from "yup";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import GeneralInformation from "./tabs/GeneralInformation";
import CustomSkeleton from "components/Skeleton";
// import SEO from "./tabs/SEO";

export default function CategoryCreate() {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [loader, setLoader] = useState(true);

  const fetchData = () => {
    setLoader(true);
    getV2Categories({ page: 1, limit: 10 }).then((res) => {
      console.log(res);
    });
    if (!id) return setLoader(false);
    getV2Category(id, {})
      .then((res) => {
        console.log(res);
        formik.setValues({
          description_ru: res?.description.ru,
          description_uz: res?.description.uz,
          description_en: res?.description.en,
          image: res?.image,
          order_no: res?.order_no,
          title_ru: res?.title.ru,
          title_uz: res?.title.uz,
          title_en: res?.title.en,
          parent_id: res?.parent_id,
        });
      })
      .finally(() => setLoader(false));
  };

  const saveChanges = (data) => {
    setButtonLoader(true);
    if (id) {
      updateV2Category(id, data)
        .catch((err) =>
          dispatch(showAlert(t(err?.Error?.Message ?? err?.Error))),
        )
        .then(() => history.push("/home/catalog/category"))
        .finally(() => setButtonLoader(false));
    } else {
      postV2Category(data)
        .catch((err) =>
          dispatch(showAlert(t(err?.Error?.Message ?? err?.Error))),
        )
        .then(() => history.push("/home/catalog/category"))
        .finally(() => setButtonLoader(false));
    }
  };

  const onSubmit = (values) => {
    const data = {
      description: {
        ru: values.description_ru,
        uz: values.description_uz,
        en: values.description_en,
      },
      image: values.image,
      order_no: values.order_no,
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      parent_id: values?.parent_id?.value || null,
    };
    saveChanges(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = useMemo(
    () => ({
      description_ru: null,
      description_uz: null,
      description_en: null,
      image: null,
      order_no: null,
      title_ru: null,
      title_uz: null,
      title_en: null,
      parent_id: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));

    return yup.object().shape({
      title_ru: defaultSchema,
      title_uz: defaultSchema,
      title_en: defaultSchema,
    });
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  const routes = [
    {
      title: <div>{t("Sales")}</div>,
      link: true,
      route: `/home/catalog/category`,
    },
    {
      title: id ? formik?.values.first_name : t("create"),
    },
  ];

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

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
            <Filters>
              <StyledTabs
                value={value}
                onChange={handleTabChange}
                centered={false}
                aria-label="full width tabs example"
                TabIndicatorProps={{ children: <span className="w-2" /> }}
              >
                <StyledTab
                  label={tabLabel(t("general.information"))}
                  {...a11yProps(0)}
                  style={{ width: "150px" }}
                />
                {/* <StyledTab
                  label={tabLabel(t("SEO"))}
                  {...a11yProps(1)}
                  style={{ width: "100px" }}
                /> */}
              </StyledTabs>
            </Filters>
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
              {/* <TabPanel value={value} index={1} dir={theme.direction}>
                <SEO />
              </TabPanel> */}
            </SwipeableViews>
          </form>
        </>
      )}
    </>
  );
}
