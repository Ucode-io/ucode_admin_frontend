import { useMemo, useState, useEffect } from "react";
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
import CustomSkeleton from "components/Skeleton";
import { StyledTabs } from "components/StyledTabs";
import { StyledTab } from "components/StyledTabs";
import  FlagEngIcon from "assets/icons/eng.svg"
import FlagRuIcon  from "assets/icons/rus.svg"
import  FlagUzIcon  from "assets/icons/uz.svg"
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import ServiceForm from "./ServiceForm";
import { getServiceById, postService, updateService } from "services/services";
import PhotoAndDoctorsForm from "./Photo_DoctorsForm";
import { getCategoriesList } from "services/category";
import { getBranchList } from "services/branch";

export default function ServiceCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedCardTab, setSelectedCardTab] = useState(0);
  const theme = useTheme()
  const [ categories, setCategories ] = useState()
  const [ branches, setBranches] = useState()
  

  const initialValues = {
    branch: "",
    category: "",
    company_id: "",
    description: {
      en: "",
      ru: "",
      uz: "",
    },
    doctor_ids: [""],
    expendature: null,
    name: {
      en: "",
      ru: "",
      uz: "",
    },
    percent_doctor: null,
    photos: [],
    price_arrival: null,
    price_sale: null,
  };

     
// ===== GET Categries List for input type select ==== //
  const getCategories = () => {
    getCategoriesList()
    .then((res) => {
      console.log("GET categgory list ", res)
      setCategories(res.data.categories)
    })
  }
const catagoryListMaker =(lang) => {
  const categoriesList = categories?.map((item, index) => {
    return {
      label: item.name[lang],
      value: item.id,
    };
  });
  return categoriesList;
  }

  // ===== GET Branches List for input type select ==== //
  const getBranches = () => {
    getBranchList()
    .then((res) => {
      setBranches(res.data.branches)
    })
  }

    const branchesList = branches?.map((item, index) => {
      return{
        label: item.name,
        value: item.id
      }
    })

  // ===== GET Service By ID ==== //
  const getService = () => {
    if (params.id) {
      getServiceById(params.id).then((res) => {
        console.log("GET Service By id ", res);
        formik.setValues(res.data);
      });
    }
  };


 
  const onSubmit = (values) => {
    if (!params.id) {
      postService(values)
      .then((res) => console.log("POST ", res))
      .finally(()=> history.goBack())
      
    }else{
      updateService(values)
      .then((res) => console.log("UPDATE ", res))
    }
    
  }

  const validationSchema =() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: yup.object().shape({
        ru: defaultSchema,
        uz: defaultSchema,
        en: defaultSchema
      }),
      price_sale: defaultSchema,
    });
  }


  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const routes = [
    {
      title: t(`services`),
      link: true,
      route: `/home/settings/services`,
    },
  ];

  useEffect(() => {
    getCategories()
    getBranches()
    getService()
  }, []);

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
                label={
                  <span className="flex">
                    <img src={FlagRuIcon} alt="ru" /> {tabLabel(t("russian"))}
                  </span>
                }
                {...a11yProps(0)}
              />

              <StyledTab
                label={
                  <span className="flex">
                    <img src={FlagEngIcon} alt="eng" /> {tabLabel(t("english"))}
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

            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={selectedCardTab}
            >
              <TabPanel value={selectedCardTab} index={0} dir={theme.direction}>
                <ServiceForm
                  formik={formik}
                  lang="ru"
                  value={initialValues}
                  branchesList={branchesList}
                  categoriesList={catagoryListMaker("ru")}
                />
              </TabPanel>

              <TabPanel value={selectedCardTab} index={1} dir={theme.direction}>
                <ServiceForm
                  formik={formik}
                  lang="en"
                  value={initialValues}
                  categoriesList={catagoryListMaker("en")}
                  branchesList={branchesList}
                />
              </TabPanel>

              <TabPanel value={selectedCardTab} index={2} dir={theme.direction}>
                <ServiceForm
                  formik={formik}
                  lang="uz"
                  value={initialValues}
                  branchesList={branchesList}
                  categoriesList={catagoryListMaker("uz")}
                />
              </TabPanel>

            </SwipeableViews>
          </Card>
        </div>

        <div className="w-1/2">
          <PhotoAndDoctorsForm formik={formik}/>
        </div>
      </div>
    </form>
  );
}
