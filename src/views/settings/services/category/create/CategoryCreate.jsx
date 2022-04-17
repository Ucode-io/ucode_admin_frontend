import { useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getBranchesCount } from "../../../../../services";
import CustomSkeleton from "components/Skeleton";
import { TabPanel } from "components/Tab/TabBody";
import Filters from "components/Filters";
import { StyledTabs,StyledTab } from "components/StyledTabs";
import  FlagEngIcon from "assets/icons/eng.svg"
import FlagRuIcon  from "assets/icons/rus.svg"
import  FlagUzIcon  from "assets/icons/uz.svg"
import CategoryForm from "./Form/Category";
import { getCategoryById, updateCategory } from "services/category"
import { useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { postCategory } from "services/category";
import SubCategoryForm from "./Form/SubCategory";


export default function CategoryCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme()
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedCardTab, setSelectedCardTab] = useState(0);
  const [subCategory, setSubcategory] = useState()
  const [allCategory, setAllcategory] = useState([]);
  

  const initialValues = 
  {
    category: {
      company_id: "",
      description: {
        en: "",
        ru: "",
        uz: ""
      },
      name: {
        en: "",
        ru: "",
        uz: ""
      },
      name_url: "",
      photo: ""
    },
    subcategory: {
      category_id: "",
      subcategories: [
        {
          created_at: "",
          id: "",
          name: {
            en: "",
            ru: "",
            uz: ""
          }
        }
      ]
    }
  }

const getCategory = () => {
  if (params.id) {
    getCategoryById(params.id).then((res) => {
      console.log("GET Category ", res);
      setSubcategory(res.data.subcategories);
      formik.setValues(res.data);
    })
    .finally(() => setLoader(false))
  }
};


  useEffect(() => { 
    getCategory();
  }, []);


  const validationSchema = yup.object().shape({
    category: yup.object().shape({
      name: yup.object().shape({
        ru: yup.string().required(t("required.field.error")),
        en: yup.string().required(t("required.field.error")),
        uz: yup.string().required(t("required.field.error"))
      })
    }),
  })

  

  const onSubmit = (values) => {
    const body = {
      ...values,
      subcategory: {
        category_id: subCategory?.category_id,
        subcategories: allCategory,
      },
    };
    const body1 = {
      ...values,
      subcategories: allCategory,
    };
    if (!params.id) {
      postCategory(body).then((res) => console.log("POST Category => ", res));
      history.goBack();
    } else {
      updateCategory(body1).then((res) =>
        console.log("UPDATE category => ", res),
      );
      history.goBack();
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  
  const routes = [
    {
      title: t(`add.category`),
      link: true,
      route: `/home/settings/services/category/create`,
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
    <form onSubmit={formik.handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

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
                    label={
                      <span className="flex">
                        <img src={FlagRuIcon} alt="ru" />{" "}
                        {tabLabel(t("russian"))}
                      </span>
                    }
                    {...a11yProps(0)}
                  />

                  <StyledTab
                    label={
                      <span className="flex">
                        <img src={FlagEngIcon} alt="eng" />{" "}
                        {tabLabel(t("english"))}
                      </span>
                    }
                    {...a11yProps(1)}
                  />
                  <StyledTab
                    label={
                      <span className="flex">
                        <img src={FlagUzIcon} alt="uz" /> {tabLabel(t("uzbek"))}
                      </span>
                    }
                    {...a11yProps(2)}
                  />
                </StyledTabs>
              </Filters>

              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={selectedCardTab}
              >
                <TabPanel
                  value={selectedCardTab}
                  index={0}
                  dir={theme.direction}
                >
                  <CategoryForm
                    formik={formik}
                    titleInput={t("category")}
                    lang="ru"
                    value={initialValues}
                  />
                </TabPanel>

                <TabPanel
                  value={selectedCardTab}
                  index={1}
                  dir={theme.direction}
                >
                  <CategoryForm
                    formik={formik}
                    titleInput={t("category")}
                    lang="en"
                    value={initialValues}
                  />
                </TabPanel>

                <TabPanel
                  value={selectedCardTab}
                  index={2}
                  dir={theme.direction}
                >
                  <CategoryForm
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
            <SubCategoryForm
              formik={formik}
              subCategory={subCategory}
              id={params.id}
              allCategory={allCategory}
              setAllcategory={setAllcategory}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
