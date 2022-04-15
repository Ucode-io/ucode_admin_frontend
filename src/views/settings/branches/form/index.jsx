import { useEffect, useState } from "react";
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
import { useMemo } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { postBranch, updateBranch } from "services/branch";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function BranchCreate() {
  const defaultMap = {
    lat: 41.311151,
    long: 69.279737,
  };
  // ====== variables ====== //
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [coordinators, setCoordinators] = useState(defaultMap);
  const params = useParams();

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
    () => ({
      address: "",
      city: "",
      company_id: "",
      inns: [""],
      latitude: "41.311151",
      logo: "",
      longitude: "69.279737",
      name: "",
      phone_numbers: [""],
      service_ids: [""],
      working_days: [
        {
          day: "monday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
        {
          day: "tuesday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
        {
          day: "wednesday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
        {
          day: "thursday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
        {
          day: "friday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
        {
          day: "saturday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
        {
          day: "sunday",
          end_time: "18:00",
          is_open: false,
          start_time: "09:00",
        },
      ],
    }),
    [],
  );

  const tost = () => {
    history.push("/home/settings/branch")
  }

  const onSubmit = (values) => {
    let stringedInns = values.inns.join().split(",");
    const body = {
      ...values,
      inns: stringedInns,
      // city: values.city.label,
      // catalogue_id: values.catalogue_id.label
    };
    if (params.id === undefined) {
      setSaveLoading(true)
      postBranch(body)
        .then((res) => {
          history.goBack()
        })
        .catch((err) => {
          if (err.status === 500) {
            toast.error("Филиал с таким именем уже существует")
          }
        })
        .finally(() => setSaveLoading(false))
    } else {
      setSaveLoading(true)
      updateBranch({ ...body })
        .then((res) => {
          history.goBack()
        })
        .catch((err) => console.log("error", err))
        .finally(() => setSaveLoading(false))
    }
  };

  const validationSchema = yup.object({
    name: yup.string().required(t("required.field.error")),
    inns: yup.array().of(yup.string().length(10, "Должно быть 10 цифр")),
    phone_numbers: yup.array().of(yup.string().length(17, "Должно быть 9 цифр").required(t("required.field.error"))),
    // working_days: yup.array().of(yup.object().shape({
    //   start_time: yup.string().required(t("fill.this.form")),
    //   end_time: yup.string().required(t("fill.this.form"))
    // })),
  })

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
      onClick={tost}
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
  ];

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
      <ToastContainer />
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
