import { useState } from "react";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import Cashiers from "./tabs/Cashiers";
import Couriers from "./tabs/Couriers";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";

export default function Personnel() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [value, setValue] = useState(0);

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
      <Card className="m-4">
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
          className="border-b"
        >
          <StyledTab
            label={tabLabel(t("couriers"))}
            {...a11yProps(0)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("cashiers"))}
            {...a11yProps(1)}
            style={{ width: "100px" }}
          />
        </StyledTabs>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Couriers />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Cashiers />
          </TabPanel>
        </SwipeableViews>
      </Card>
    </>
  );
}
