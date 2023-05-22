import { Collapse } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { mainActions } from "../../../../../store/main/main.slice";
import RelationsBlock from "./RelationsBlock";
import SectionsBlock from "./SectionsBlock";
import SettingsBlock from "./SettingsBlock";
import SummarySection from "./SummarySection.jsx";
import styles from "./style.module.scss";
import NewlayoutList from "./NewlayoutList";
import NewLayoutSettings from "./NewLayoutSettings";
import { useNavigate } from "react-router-dom";

const Layout = ({ mainForm, getRelationFields }) => {
  const dispatch = useDispatch();
  const layoutForm = useForm({ mode: "onChange" });
  const [settingsBlockVisible, setSettingsBlockVisible] = useState(false);
  const navigate = useNavigate();

  const [selectedField, setSelectedField] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(0);

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

  return (
    <>
      {/* <NewLayoutSettings
        mainForm={mainForm}
        layoutForm={layoutForm}
        openFieldsBlock={openFieldsBlock}
        openFieldSettingsBlock={openFieldSettingsBlock}
        openRelationSettingsBlock={openRelationSettingsBlock}
      /> */}
      <div className={styles.page}>
        <SectionsBlock
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
        />
        
        {/* <NewlayoutList  /> */}

        <Collapse
          in={settingsBlockVisible}
          unmountOnExit
          orientation="horizontal"
        >
          <SettingsBlock
            mainForm={mainForm}
            layoutForm={layoutForm}
            closeSettingsBlock={closeSettingsBlock}
            selectedField={selectedField}
            selectedRelation={selectedRelation}
            selectedSettingsTab={selectedSettingsTab}
            setSelectedSettingsTab={setSelectedSettingsTab}
            getRelationFields={getRelationFields}
          />
        </Collapse>
      </div>
    </>
  );
};

export default Layout;
