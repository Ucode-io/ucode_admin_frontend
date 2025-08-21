import React, {useMemo, useState} from "react";
import styles from "./style.module.scss";
import LayoutTabs from "./LayoutTabs";
import SecondaryButton from "../../../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import {Save} from "@mui/icons-material";
import Footer from "../../../../../components/Footer";
import {useNavigate, useParams} from "react-router-dom";
import layoutService from "../../../../../services/layoutService";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../../store/alert/alert.thunk";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../../../../utils/generateLanguageText";

function NewLayoutSettings({
  mainForm,
  tableLan,
  layoutForm,
  selectedLayout,
  setSelectedTab,
  setSelectedLayout,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
  sectionTabs,
  replaceSectionTab,
  insertSectionTab,
  selectedTab,
  removeSectionTab,
  moveSectionTab,
  appendSectionTab,
}) {
  const navigate = useNavigate();
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const watchLayout = mainForm
    .watch(`layouts`)
    .find((layout) => layout?.id === selectedLayout?.id);

  const computedData = useMemo(() => {
    return;
  }, [watchLayout]);

  const updateSelectedLayout = () => {
    setLoader(true);
    const data = watchLayout?.tabs
      ?.filter((item) => item?.type)
      ?.map((el) => ({
        ...el,
        type: Boolean(el?.type !== "section" && el?.type === "Many2One")
          ? "relation"
          : el?.type,
        relation_id:
          el?.type === "Many2One"
            ? el?.id
            : el?.type === "relation"
              ? el?.relation?.id
              : undefined,
        id:
          el?.type === "section"
            ? el?.id
            : el?.type === "Many2One"
              ? ""
              : el?.id,
      }));

    layoutService
      .update({...watchLayout, tabs: data}, tableSlug)
      .then(() => {
        dispatch(showAlert("Layout updated successfully!", "success"));
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <div className={styles.headerSection}>
        <div className={styles.headerLabel}>Layout Settings</div>
        <div className={styles.headerBtns}>
          <SecondaryButton
            onClick={() => {
              navigate(-1);
            }}
            color="error">
            {generateLangaugeText(tableLan, i18n?.language, "Close") || "Close"}
          </SecondaryButton>
          <PrimaryButton loader={loader} onClick={updateSelectedLayout}>
            <Save />{" "}
            {generateLangaugeText(tableLan, i18n?.language, "Save") || "Save"}
          </PrimaryButton>
        </div>
      </div>
      <div className={styles.tabs_section}>
        <LayoutTabs
          tableLan={tableLan}
          mainForm={mainForm}
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
          layoutForm={layoutForm}
          openFieldsBlock={openFieldsBlock}
          openFieldSettingsBlock={openFieldSettingsBlock}
          openRelationSettingsBlock={openRelationSettingsBlock}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          replaceSectionTab={replaceSectionTab}
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
