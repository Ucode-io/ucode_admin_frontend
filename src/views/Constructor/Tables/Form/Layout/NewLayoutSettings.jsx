import React, { useState } from "react";
import styles from "./style.module.scss";
import SummarySection from "./SummarySection";
import LayoutTabs from "./LayoutTabs";

function NewLayoutSettings({
  mainForm,
  layoutForm,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabSelection = (tabIndex) => {
    setSelectedTab(tabIndex);
  };
  return (
    <>
      <div className={styles.summary_section_layer}>
        <SummarySection
          mainForm={mainForm}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
        />
      </div>
      <div className={styles.tabs_section}>
        <LayoutTabs
          mainForm={mainForm}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
          selectedTab={selectedTab}
          handleTabSelection={handleTabSelection}
        />
      </div>
    </>
  );
}

export default NewLayoutSettings;
