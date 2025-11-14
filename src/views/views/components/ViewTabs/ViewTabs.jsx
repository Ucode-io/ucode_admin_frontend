import { Tabs, Tab, TabList, TabPanel } from "react-tabs"
import cls from "./styles.module.scss";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const ViewTabs = ({ tabs, view, element = () => {} }) => {

  const { i18n } = useTranslation();

  return <Tabs
    direction={"ltr"}
    defaultIndex={0}
    style={{
      height: "100%",
    }}
  >
    <div id="tabsHeight" className={cls.tableCardHeader}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="title" style={{ marginRight: "20px" }}>
          <h3>{view.table_label}</h3>
        </div>
        <TabList
          className={clsx(
            cls.reactTabsList,
            "react-tabs__tab-list",
          )}
          style={{ border: "none" }}
        >
          {tabs?.map((tab) => (
            <Tab
              key={tab.value}
              selectedClassName={cls.activeTab}
              className={clsx(cls.reactTabsTab, "react-tabs__tab")}
            >
              {tab?.[`label_${i18n.language}`] || tab.label}
            </Tab>
          ))}
        </TabList>
      </div>
    </div>
    {tabs?.map((tab) => (
      <TabPanel key={tab?.value}>{element({ tab })}</TabPanel>
    ))}
  </Tabs>
  
}
