import { Collapse } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mainActions } from "../../../../../store/main/main.slice";
import NewLayoutSettings from "./NewLayoutSettings";
import NewlayoutList from "./NewlayoutList";
import SettingsBlock from "./SettingsBlock";
import styles from "./style.module.scss";

const Layout = ({ mainForm, getRelationFields }) => {
  const dispatch = useDispatch();
  const layoutForm = useForm({ mode: "onChange" });
  const [settingsBlockVisible, setSettingsBlockVisible] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState({});
  const [selectedField, setSelectedField] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(0);
  const [selectedTab, setSelectedTab] = useState({});

  const openFieldsBlock = (type) => {
    setSelectedField(null);
    setSelectedRelation(null);
    setSelectedSettingsTab(type === "FIELD" ? 0 : 1);
    setSettingsBlockVisible(true);
  };

  const openFieldSettingsBlock = (field) => {
    setSelectedField(field);
    setSelectedRelation(null);
    setSettingsBlockVisible(true);
  };

  const openRelationSettingsBlock = (relation) => {
    setSelectedRelation(relation);
    setSelectedField(null);
    setSettingsBlockVisible(true);
  };

  const closeSettingsBlock = () => {
    setSettingsBlockVisible(false);
    setSelectedField(null);
    setSelectedRelation(null);
  };

  useEffect(() => {
    dispatch(mainActions.setSettingsSidebarIsOpen(false));
  }, [dispatch]);

  const selectedLayoutIndex = useMemo(() => {
    if (!mainForm.getValues("layouts")?.length > 0) return "notSelected";
    return mainForm.getValues("layouts").findIndex((layout) => layout?.id === selectedLayout?.id);
  }, [selectedLayout]);

  const {
    fields: sectionTabs,
    insert: insertSectionTab,
    update: updateSectionTab,
    remove: removeSectionTab,
    move: moveSectionTab,
    append: appendSectionTab,
  } = useFieldArray({
    control: mainForm.control,
    name: `layouts.${selectedLayoutIndex}.tabs`,
    keyName: "key"
  });

  useEffect(() => {
    updateSectionTab()
  }, [selectedLayoutIndex])

  return (
    <>
      {selectedLayout.id ? (
        <NewLayoutSettings
          mainForm={mainForm}
          selectedLayout={selectedLayout}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setSelectedLayout={setSelectedLayout}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
          sectionTabs={sectionTabs}
          insertSectionTab={insertSectionTab}
          removeSectionTab={removeSectionTab}
          moveSectionTab={moveSectionTab}
          appendSectionTab={appendSectionTab}
        />
      ) : (
        <NewlayoutList setSelectedLayout={setSelectedLayout} selectedLayout={selectedLayout} layoutForm={layoutForm} mainForm={mainForm} />
      )}

      <div className={styles.page}>
        {/* <SectionsBlock
          mainForm={mainForm}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
        />

        <RelationsBlock
          mainForm={mainForm}
          openFieldsBlock={openFieldsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
        /> */}

        <Collapse in={settingsBlockVisible} unmountOnExit orientation="horizontal">
          <SettingsBlock
            updateSectionTab={updateSectionTab}
            mainForm={mainForm}
            layoutForm={layoutForm}
            closeSettingsBlock={closeSettingsBlock}
            selectedField={selectedField}
            selectedRelation={selectedRelation}
            selectedSettingsTab={selectedSettingsTab}
            setSelectedSettingsTab={setSelectedSettingsTab}
            getRelationFields={getRelationFields}
            sectionTabs={sectionTabs}
            insertSectionTab={insertSectionTab}
            removeSectionTab={removeSectionTab}
            moveSectionTab={moveSectionTab}
            appendSectionTab={appendSectionTab}
          />
        </Collapse>
      </div>
    </>
  );
};

export default Layout;
