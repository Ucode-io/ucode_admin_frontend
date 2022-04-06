import { useState, useEffect } from "react";
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
import General from "./tabs/General";
import Doctors from "./tabs/Doctors";

export default function AggregateCreate() {

  // ======== variables ======= //
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0)



   // ======== Tab ======= //
  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>;
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleChangeIndex = (index) => setValue(index);


  const routes = [
    {
      title: t(`templates`),
      link: true,
      route: `/home/settings/template`,
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
            label={tabLabel(t("main.page"))}
            // value="main.page"
            {...a11yProps(0)}
          />
          <StyledTab
            label={tabLabel(t("doctors"))}
            // value="about.branch"
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
            <General />
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
            <Doctors />
        </TabPanel>
      </SwipeableViews>

      </>
    // </form>
  );
}
