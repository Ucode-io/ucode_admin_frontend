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
import { getBranchesCount } from "../../../../../services";
import { getOneClick, postClick, updateClick } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import { TabPanel } from "components/Tab/TabBody";
import Filters from "components/Filters";
import { StyledTabs } from "components/StyledTabs";
import { StyledTab } from "components/StyledTabs";
import {ReactComponent as FlagEngIcon} from "assets/icons/eng.svg"
import { ReactComponent as FlagRuIcon } from "assets/icons/rus.svg"
// import { ReactComponent as FlagUzIcon } from "assets/icons/uz.svg"
import { ReactComponent as FlagUzIcon } from "assets/icons/uz.svg"
import CategoryForm from "./Form";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { Add, ExpandMore, KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import add_icon from "assets/icons/add.svg"
import edit_icon from "assets/icons/edit.svg"
import delete_icon from "assets/icons/delete.svg"
import { useTheme, withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";


export default function CategoryCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme()
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCardTab, setSelectedCardTab] = useState(0);
  const [expand, setExpand] = useState(false)
  const [value, setValue] =useState(0)
  
  const [initialValues, setInitialValues] = useState({
    developer_logo: "",
    gallery: [],
    contact_number: "",
    residential_type: "4",
    developer_id: params.devID,
    status: "",
    date: null,
    language_data: {
      ru: {
        name: "",
        description: "",
        address: "",
      },
      eng: {
        name: "",
        description: "",
        address: "",
      },
      uz: {
        name: "",
        description: "",
        address: "",
      },
    },
    location_text: "",
    location_map: {
      longtitude: null,
      latitude: null,
    },
  });


  const fakeData = [
    {
      id: 1,
      title: "Cердечно - сосудистая хирургия",
    },
    {
      id: 2,
      title: "Абдоминальная хирургия",
    },
    {
      id: 3,
      title: "пластическая хирургия",
    },
  ];

  const IconLeftExpansionPanelSummary = withStyles({
    expandIcon: {
        order: -1
    }
})(AccordionSummary);

  useEffect(() => {
    // getItems();
    fetchData();
  }, []);

  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          key: res.key,
          branch_id: res.branch_id,
          merchant_id: res.merchant_id,
          service_id: res.service_id,
          merchant_user_id: res.merchant_user_id,
        });
      });
    }
  }, []);

  const fetchData = () => {
    if (params.id) {
      getOneClick(params.id)
        .then((res) => {
          formik.setValues({
            key: res.key,
            branch_id: res.branch_id,
            merchant_id: res.merchant_id,
            service_id: res.service_id,
            merchant_user_id: res.merchant_user_id,
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

  // const initialValues = useMemo(
  //   () => ({
  //     key: null,
  //     branch_id: null,
  //     merchant_id: null,
  //     service_id: null,
  //     merchant_user_id: null,
  //   }),
  //   [],
  // );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      key: defaultSchema,
      service_id: defaultSchema,
      merchant_user_id: defaultSchema,
      merchant_id: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateClick(data, params.id)
      : postClick(data);
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
      title: t(`add.category`),
      link: true,
      route: `/home/settings/services/category/create`,
    },
    // {
    //   title: t("create"),
    // },
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

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      {/* <TabPanel value={selectedTab} index={0}> */}
        <div className="m-4">
          <div className="flex gap-5">
            <div className="w-2/3">
              <Card title={t("category")}>
                <Filters>
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
                </Filters>

                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={selectedCardTab}
                  // onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={selectedCardTab} index={0} dir={theme.direction}>
                    <CategoryForm
                      formik={formik}
                      titleInput={t("category")}
                      lang="ru"
                      value={initialValues}
                      // setFile={setFile}
                    />
                  </TabPanel>

                  <TabPanel value={selectedCardTab} index={1} dir={theme.direction}>
                    <CategoryForm
                      formik={formik}
                      titleInput={t("category")}
                      lang="eng"
                      value={initialValues}
                      // setFile={setFile}
                    />
                  </TabPanel>

                  <TabPanel value={selectedCardTab} index={2} dir={theme.direction}>
                    <CategoryForm
                      formik={formik}
                      titleInput={t("category")}
                      lang="uz"
                      value={initialValues}
                      // setFile={setFile}
                    />
                  </TabPanel>
                </SwipeableViews>
              </Card>
            </div>

            <div className="w-1/2">
              <Card title={t("subcategories")}>
                {fakeData.map((item) => (
                  <Accordion
                    key={item.id}
                    onChange={(e, expanded) => {
                      if (expanded) {
                        setExpand(true);
                      } else {
                        setExpand(false);
                      }
                    }}
                  >
                    <AccordionSummary
                      // expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      style={{ padding: "0px" }}
                    >
                      <div className="flex items-center w-full justify-between">
                        <span>
                          <KeyboardArrowRight />
                          {item.title}
                        </span>

                        <div className="flex">
                          <img
                            className="border rounded p-1.5 "
                            src={add_icon}
                            alt="add"
                          />
                          <img
                            className="border rounded p-1.5 ml-2"
                            src={edit_icon}
                            alt="edit"
                          />
                          <img
                            className="border rounded p-1.5 ml-2"
                            src={delete_icon}
                            alt="delete"
                          />
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
                <div className="w-full items-baseline">
                  <div
                    className="mt-4 cursor-pointer border border-dashed border-blue-800 text-primary text-sm  p-2 rounded-md flex justify-center items-center gap-2.5"
                    // onClick={() => setModal(true)}
                    // ref={productRef}
                  >
                    <Add />
                    <div className="text-black-1 text-primary">
                      Добавить продукт
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      {/* </TabPanel> */}
    </form>
  );
}
