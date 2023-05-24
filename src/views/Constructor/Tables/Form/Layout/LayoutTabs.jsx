import React, { useEffect, useMemo, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styles from "./style.module.scss";
import NewSectionsBlock from "./NewSectionsBlock";
import { useFieldArray, useWatch } from "react-hook-form";
import { Card, TextField } from "@mui/material";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import { Add } from "@mui/icons-material";
import ButtonsPopover from "../../../../../components/ButtonsPopover";
import { applyDrag } from "../../../../../utils/applyDrag";
import { Container, Draggable } from "react-smooth-dnd";
import RelationTable from "../../../components/RelationTable";

function LayoutTabs({
  mainForm,
  layoutForm,
  openFieldsBlock,
  openFieldSettingsBlock,
  openRelationSettingsBlock,
  selectedLayout,
  setSelectedLayout,
  selectedTab,
  sectionTabs,
  insertSectionTab,
  setSelectedTab,
  removeSectionTab,
  moveSectionTab,
  appendSectionTab,
}) {
  // const {
  //   fields: tabs,
  //   insert,
  //   remove,
  //   move,
  // } = useFieldArray({
  //   control: mainForm.control,
  //   name: "tabs",
  //   keyName: "key",
  // });

  const relationsMap = useWatch({
    control: mainForm.control,
    name: "relationsMap",
  });

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { fields: viewRelations, ...viewRelationsFieldArray } = useFieldArray({
    control: mainForm.control,
    name: "view_relations",
    keyName: "key",
  });

  const computedViewRelations = useMemo(() => {
    return viewRelations
      ?.map((relation) => {
        if (relation.view_relation_type === "FILE") {
          return {
            relation,
            title: "Файл",
          };
        } else {
          return relationsMap[relation.relation_id];
        }
      })
      ?.filter((el) => el);
  }, [viewRelations, relationsMap]);

  const onDrop = (dropResult) => {
    const result = applyDrag(computedViewRelations, dropResult);
    if (result)
      if (result.length > computedViewRelations?.length) {
        viewRelationsFieldArray.insert(
          dropResult?.addedIndex,
          dropResult.payload.view_relation_type === "FILE" ? { ...dropResult.payload, relation_id: dropResult.payload?.id } : { relation_id: dropResult.payload?.id }
        );
      } else {
        // viewRelationsFieldArray.replace(result)
        viewRelationsFieldArray.move(dropResult.removedIndex, dropResult.addedIndex);
      }
  };

  // const removeViewRelation = (index, relation) => {
  //   viewRelationsFieldArray.remove(index);
  // };

  // const addNewSummary = () => {
  //   insert({
  //     tab_name: "",
  //     tab_order: "",
  //   });
  // };

  // const deleteSummary = (index) => {
  //   remove(index);
  // };

  // const handleTabDrag = ({ removedIndex, addedIndex }) => {
  //   move(removedIndex, addedIndex);
  //   if (selectedTab === removedIndex) {
  //     handleTabSelection(addedIndex);
  //   }
  // };

  // const handleTabsDrag = (index) => {
  //   setSelectedTabIndex(index);
  // };

  const allTabs = useMemo(() => {
    return [...sectionTabs, ...computedViewRelations];
  }, [sectionTabs, computedViewRelations]);

  useEffect(() => {
    setSelectedTab(allTabs[0] ?? {});
  }, [allTabs]);

  // const selectedLayout = mainForm.watch("selectedLayout");

  const selectedLayoutIndex = useMemo(() => {
    if (!mainForm.getValues("layouts")?.length > 0) return "notSelected";
    return mainForm.getValues("layouts").findIndex((layout) => layout?.id === selectedLayout?.id);
  }, [mainForm, selectedLayout]);

  return (
    <div className={styles.relationsBlock}>
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.tabList}>
            <Container groupName="table_relation" dropPlaceholder={{ className: "drag-row-drop-preview" }} orientation="horizontal" onDrop={onDrop}>
              {/* {tabs.map((tab, index) => (
                <Draggable key={tab.id} onDrag={() => handleTabsDrag(index)}>
                  <div className={`${styles.tab} ${selectedTab === index ? styles.active : ""}`} onClick={() => setSelectedTabIndex(index)}>
                    {tab.tab_name}
                    <ButtonsPopover onEditClick={() => openFieldSettingsBlock(tab)} onDeleteClick={() => deleteSummary(index)} />
                  </div>
                </Draggable>
              ))} */}

              {allTabs?.map((tab, index) => (
                <Draggable 
                  key={tab.id} 
                  // onDrag={() => handleTabsDrag(index)}
                >
                  <div
                    className={`${styles.tab} ${selectedTabIndex === index ? styles.active : ""}`}
                    onClick={() => {
                      setSelectedTabIndex(index);
                      setSelectedTab(tab);
                    }}
                  >
                    {/* {tab?.type === "sectionTab" ? tab?.title : tab?.table_from?.label} */}
                    {mainForm.watch(`layouts.${selectedLayoutIndex}.tabs.${index}.label`)}
                    {/* <ButtonsPopover onEditClick={() => openRelationSettingsBlock(tab)} onDeleteClick={() => removeViewRelation(index, tab)} /> */}
                  </div>
                </Draggable>
              ))}

              {/* {computedViewRelations?.map((relation, index) => (
                <Draggable key={relation.id} onDrag={() => handleTabsDrag(index)}>
                  <div className={`${styles.tab} ${selectedTabIndex === index ? styles.active : ""}`} onClick={() => setSelectedTabIndex(index)}>
                    {relation.table_from?.label}
                    <ButtonsPopover onEditClick={() => openRelationSettingsBlock(relation)} onDeleteClick={() => removeViewRelation(index, relation)} />
                  </div>
                </Draggable>
              ))}

              {sectionTabs?.map((sectionTab, index) => (
                <Draggable key={sectionTab.id} onDrag={() => handleTabsDrag(index)}>
                  <div className={`${styles.tab} ${isSectionTab?.id === sectionTab?.id ? styles.active : ""}`} onClick={() => {
                    setSelectedTabIndex(index)
                    setIsSectionTab(sectionTab)
                  }}>
                    {sectionTab?.title}
                    <ButtonsPopover onEditClick={() => openRelationSettingsBlock(sectionTab)} onDeleteClick={() => removeSectionTab(index, sectionTab)} />
                  </div>
                </Draggable>
              ))} */}
            </Container>

            <RectangleIconButton onClick={() => openFieldsBlock("RELATION")}>
              <Add />
            </RectangleIconButton>
          </div>
        </div>

        {selectedTab?.type === "section" ? (
          <NewSectionsBlock
            mainForm={mainForm}
            layoutForm={layoutForm}
            openFieldsBlock={openFieldsBlock}
            openFieldSettingsBlock={openFieldSettingsBlock}
            openRelationSettingsBlock={openRelationSettingsBlock}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            selectedTab={selectedTab}
            sectionTabs={sectionTabs}
          />
        ) : (
          // <RelationTable relation={computedViewRelations[selectedTabIndex]} />
          ""
        )}
      </Card>
    </div>
  );
}

export default LayoutTabs;
