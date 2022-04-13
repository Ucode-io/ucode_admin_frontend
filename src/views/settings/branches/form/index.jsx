import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import Filters from "components/Filters";
import { StyledTabs } from "components/StyledTabs";
import { StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import { TabPanel } from "components/Tab/TabBody";
import AboutBranch from "./tabs/AboutBranch";
import UsersTable from "./tabs/Users/Table";
import AddIcon from "@material-ui/icons/Add";
import { useMemo } from 'react'
import * as yup from "yup";
import { useFormik } from 'formik'
import { postBranch, updateBranch } from "services/branch";


export default function BranchCreate() {

  const defaultMap = {
    lat:41.311151,
    long: 69.279737,
  }
  // ====== variables ====== //
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0)
  const theme = useTheme()
  const [coordinators ,setCoordinators ]= useState(defaultMap)
  const params = useParams()
  const [inns, setInns] = useState()
  
 // =======  Tab ====== //
  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>;
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChangeIndex = (index) => setValue(index);
  const handleChange = (event, newValue) => setValue(newValue);

  const routes = [
    {
      title: t(`branch`),
      link: true,
      route: `/home/settings/branch`,
    },
  ];

  const initialValues = useMemo(
    () => (
      {
        address: "",
        city: "",
        company_id: "",
        inns: [
          ""
        ],
        latitude: '41.311151',
        logo: "",
        longitude: '69.279737',
        name: "",
        phone_numbers: [
          ""
        ],
        service_ids: [
          ""
        ],
        working_days: [
          {
            day: "monday",
            end_time: "",
            is_open: false,
            start_time: ""
          },
          {
            day: "tuesday",
            end_time: "",
            is_open: false,
            start_time: ""
          },
          {
            day: "wednesday",
            end_time: "",
            is_open: false,
            start_time: ""
          },
          {
            day: "thursday",
            end_time: "",
            is_open: false,
            start_time: ""
          },
          {
            day: "friday",
            end_time: "",
            is_open: false,
            start_time: ""
          },
          {
            day: "saturday",
            end_time: "",
            is_open: false,
            start_time: ""
          },
          {
            day: "sunday",
            end_time: "",
            is_open: false,
            start_time: ""
          }
        ]
      }
    ),
    [],
  );

  const onSubmit = (values) => {
    // values.inns = inns.join().split(',')
    if (params.id === undefined) {
      postBranch(values)
        .then((res) => {
          console.log("succes", res);
        })
        .catch((err) => console.log("error", err));
    } else {
      updateBranch(values).then((res) => console.log("succes ", res));
    }
  };
     

  const validationSchema = () => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
    })
  }


  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
 
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
    <Button
      icon={SaveIcon}
      size="large"
      type="submit"
      loading={saveLoading}
      // onClick={() => {
      //   history.push("/home/settings/branch");
      // }}
    >
      {t("save")}
    </Button>,
  ];

  const addButton = [
    <Button
    icon={AddIcon}
    size="medium"
    onClick={() => {
      history.push("/home/settings/branch/create/user/create");
      // setCreateModal(true)
    }}
  >
    {t("add")}
  </Button>,
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <Header
        startAdornment={[
          <Breadcrumb routes={routes} />,
          <Filters>
            <StyledTabs
              value={value}
              onChange={handleChange}
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
            >
              <StyledTab
                label={tabLabel(t("about.branch"))}
                // value="about.branch"
                {...a11yProps(0)}
              />
              <StyledTab
                label={tabLabel(t("users"))}
                // value="users"
                {...a11yProps(1)}
              />
            </StyledTabs>
          </Filters>,
        ]}
        endAdornment={value === 0 ? headerButtons : addButton}
      />
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <AboutBranch
            formik={formik}
            initialValues={initialValues}
            coordinators={coordinators}
            setCoordinators={setCoordinators}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <UsersTable />
        </TabPanel>
      </SwipeableViews>
    </form>
  );
}
