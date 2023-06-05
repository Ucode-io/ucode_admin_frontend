import React, { useState } from "react";
import styles from "./style.module.scss";
import SummarySection from "./SummarySection";
import LayoutTabs from "./LayoutTabs";

function NewLayoutSettings({
  mainForm,
  layoutForm,
  selectedLayout,
  setSelectedTab,
  setSelectedLayout,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
  sectionTabs,
  insertSectionTab,
  selectedTab,
  removeSectionTab,
  moveSectionTab,
  appendSectionTab,
}) {
  // const [selectedTab, setSelectedTab] = useState(0);
  // const handleTabSelection = (tabIndex) => {
  //   setSelectedTab(tabIndex);
  // };

  return (
    <>
      <div className={styles.summary_section_layer}>
        <SummarySection
          mainForm={mainForm}
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
        />
      </div>
      <div className={styles.tabs_section}>
        <LayoutTabs
          mainForm={mainForm}
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          // handleTabSelection={handleTabSelection}
          sectionTabs={sectionTabs}
          insertSectionTab={insertSectionTab}
          removeSectionTab={removeSectionTab}
          moveSectionTab={moveSectionTab}
          appendSectionTab={appendSectionTab}
        />
      </div>
    </>
  );
}

export default NewLayoutSettings;
