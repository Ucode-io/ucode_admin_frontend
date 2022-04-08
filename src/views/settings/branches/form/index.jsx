import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
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
import Users from "./tabs/Users";


export default function BranchCreate() {
  

  // ====== variables ====== //
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0)
  const theme = useTheme()



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
    {
      title: t("create"),
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

  return (
    // <form onSubmit={handleSubmit}>
    <>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

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
          <Users />
        </TabPanel>
      </SwipeableViews>
      </>
    // </form>
  );
}
