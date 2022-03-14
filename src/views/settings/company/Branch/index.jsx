import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import AboutBranch from "./tabs/AboutBranch";
import Catalog from "./tabs/Catalog";
import Personal from "./tabs/Personnel";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import { FIlterIcon } from "constants/icons";
import AddIcon from "@material-ui/icons/Add";
import { useHistory, useParams } from "react-router-dom";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import Breadcrumb from "components/Breadcrumb";

export default function Company() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme();

  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0);

  const routes = [
    {
      title: t(`company.settings`),
      link: true,
      route: `/home/settings/company`,
    },
    {
      title: t(`company.branches`),
      link: true,
      route: `/home/settings/company/branches/${params.id}`,
    },
    {
      title: t("create"),
    },
  ];

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
        icon={FIlterIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked");
        }}
      >
        {t("filter")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button> */}
    </div>
  );

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <>
      <Header
        title={!params.id ? t("company.settings") : ""}
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={
          value == 0
            ? [
                <Button
                  icon={CancelIcon}
                  color="red"
                  shape="outlined"
                  onClick={() => history.goBack()}
                  size="large"
                  borderColor="bordercolor"
                >
                  {t("cancel")}
                </Button>,
                <Button
                  size="large"
                  icon={SaveIcon}
                  type="submit"
                  loading={saveLoading}
                >
                  {t("save")}
                </Button>,
              ]
            : [
                <Button
                  icon={AddIcon}
                  size="medium"
                  onClick={() => history.push("/home/personal/clients/create")}
                >
                  {t("add")}
                </Button>,
              ]
        }
      />
      <Filters extra={value != 0 && extraFilter}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            label={tabLabel(t("about.branch"))}
            {...a11yProps(0)}
            style={{ width: "110px" }}
          />
          <StyledTab
            label={tabLabel(t("catalog"))}
            {...a11yProps(1)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("personnel"))}
            {...a11yProps(2)}
            style={{ width: "100px" }}
          />
        </StyledTabs>
      </Filters>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <AboutBranch />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Catalog />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Personal />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
