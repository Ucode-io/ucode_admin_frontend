import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input, Select } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getBranchesCount } from "../../../../services";
import { getOnePayme, postPayme, updatePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import Gallery from "components/Gallery";
import { StyledTabs } from "components/StyledTabs";
import { StyledTab } from "components/StyledTabs";
import {ReactComponent as FlagEngIcon} from "assets/icons/eng.svg"
import { ReactComponent as FlagRuIcon } from "assets/icons/rus.svg"
import { ReactComponent as FlagUzIcon } from "assets/icons/uz.svg"
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import ServiceForm from "./Form";

export default function ServiceCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const [selectedCardTab, setSelectedCardTab] = useState(0);
  const theme = useTheme()

  useEffect(() => {
    getItems();
    fetchData();
  }, []);
  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          login: res.login,
          key: res.key,
          branch_id: res.branch_id,
          merchant_id: res.merchant_id,
        });
      });
    }
  }, []);

  const fetchData = () => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          formik.setValues({
            login: res.login,
            key: res.key,
            branch_id: res.branch_id,
            merchant_id: res.merchant_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const getItems = (page) => {
    getBranchesCount({ limit: 10, page }).then((res) => {
      setItems(res.branches);
    });
  };
  const branches = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));

  const initialValues = useMemo(
    () => ({
      login: "Paycom",
      key: null,
      branch_id: null,
      merchant_id: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      key: defaultSchema,
      login: defaultSchema,
      merchant_id: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updatePayme(data, params.id)
      : postPayme(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`services`),
      link: true,
      route: `/home/settings/services`,
    },
  ];

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ];

  if (loader) return <CustomSkeleton />;

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>;
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };



  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="flex gap-5 m-4">
        <div className="w-2/3 grid gap-5">
          <Card title={t("service")}>
            <StyledTabs
              value={selectedCardTab}
              onChange={(_, value) => setSelectedCardTab(value)}
              indicatorColor="primary"
              textColor="primary"
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
            >
              <StyledTab
                icon={<FlagRuIcon />}
                label={tabLabel(t("russian"))}
                {...a11yProps(0)}
              />

              <StyledTab
                icon={<FlagEngIcon />}
                label={tabLabel(t("english"))}
                {...a11yProps(1)}
              />

              <StyledTab
                icon={<FlagUzIcon />}
                label={tabLabel(t("uzbek"))}
                {...a11yProps(2)}
              />
            </StyledTabs>

            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={selectedCardTab}
            >
              <TabPanel value={selectedCardTab} index={0} dir={theme.direction}>
                <ServiceForm
                  formik={formik}
                  titleInput={t("category")}
                  lang="ru"
                  value={initialValues}
                />
              </TabPanel>

              <TabPanel value={selectedCardTab} index={1} dir={theme.direction}>
                <ServiceForm
                  formik={formik}
                  titleInput={t("category")}
                  lang="eng"
                  value={initialValues}
                />
              </TabPanel>

              <TabPanel value={selectedCardTab} index={2} dir={theme.direction}>
                <ServiceForm
                  formik={formik}
                  titleInput={t("category")}
                  lang="uz"
                  value={initialValues}
                />
              </TabPanel>
            </SwipeableViews>
          </Card>
        </div>

        <div className="w-1/2">
          <Card title={t("photo")}>
          <Form.Item formik={formik} name="image">
            <div className="w-full h-full flex mt-6 items-center flex-col">
              <Gallery
                rounded
                width={120}
                height={120}
                // gallery={values.image ? [values.image] : []}
                // setGallery={(elm) => setFieldValue("image", elm[0])}
                multiple={false}
              />
            </div>
          </Form.Item>
          </Card>

          <Card title={t("doctors")} className="mt-5">
          
          </Card>
        </div>
      </div>

     
    </form>
  );
}
