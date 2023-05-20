import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styles from "./style.module.scss";
import NewSectionsBlock from "./NewSectionsBlock";

function LayoutTabs({
  mainForm,
  layoutForm,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
  selectedTab,
  handleTabSelection,
}) {
  return (
    <Tabs className={"custom-tabs"}>
      <TabList>
        <Tab
          className={`${styles.tabs_item} ${
            selectedTab === 0 ? "custom-selected-tab" : "custom_tab"
          }`}
          onClick={() => handleTabSelection(0)}
        >
          Title 1
        </Tab>
      </TabList>

      <TabPanel>
        <NewSectionsBlock
          mainForm={mainForm}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
        />
      </TabPanel>
    </Tabs>
  );
}

export default LayoutTabs;
