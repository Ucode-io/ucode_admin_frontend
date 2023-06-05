import { Add, Close } from "@mui/icons-material";
import { Button, IconButton, Input, OutlinedInput } from "@mui/material";
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import { applyDrag } from "../../../../../utils/applyDrag";
import styles from "./style.module.scss";
import { generateGUID, generateID } from "../../../../../utils/generateID";
import HFAutoWidthInput from "../../../../../components/FormElements/HFAutoWidthInput";
import HFTextField from "../../../../../components/FormElements/HFTextField";

const FieldsBlock = ({
  mainForm,
  layoutForm,
  selectedSettingsTab,
  setSelectedSettingsTab,
  closeSettingsBlock,
  sectionTabs,
  insertSectionTab,
  removeSectionTab,
  moveSectionTab,
  updateSectionTab,
  appendSectionTab,
}) => {
  const { fields } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "layoutRelations",
    keyName: "key",
  });

  const sections = useWatch({
    control: mainForm.control,
    name: `sections`,
  });

  const summarySectionFields = useWatch({
    control: mainForm.control,
    name: "summary_section.fields",
  });

  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const viewRelations = useWatch({
    control: mainForm.control,
    name: "view_relations",
  });

  const usedFields = useMemo(() => {
    const list = [];
    sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        list.push(field.id);
      });
    });
    return list;
  }, [sections]);

  const usedSummarySectionFields = useMemo(() => {
    return summarySectionFields?.map((field) => field.id) ?? [];
  }, [summarySectionFields]);

  const unusedFields = useMemo(() => {
    return fields?.filter(
      (field) => field.type !== "LOOKUP" && field.type !== "LOOKUPS" && field.type !== "DYNAMIC" && (!usedFields.includes(field.id) || !usedSummarySectionFields.includes(field.id))
    );
  }, [usedFields, fields, usedSummarySectionFields]);

  const unusedTableRelations = useMemo(() => {
    const fileRelation = { id: "", view_relation_type: "FILE", title: "Файл" };
    const relations = tableRelations ? [...tableRelations] : [fileRelation];

    return [...relations]?.filter((relation) => {
      if (relation.view_relation_type === "FILE") {
        return !viewRelations?.some((viewRelation) => viewRelation.view_relation_type === "FILE");
      } else {
        return !viewRelations?.some((viewRelation) => viewRelation.relation_id === relation.id);
      }
    });
  }, [tableRelations, viewRelations]);

  const unusedRelations = useMemo(() => {
    return relations?.filter((relation) => !usedFields.includes(relation.id));
  }, [relations, usedFields]);

  const onDrop = (dropResult, colNumber) => {
    const result = applyDrag(fields, dropResult);
    if (!result) return;
  };

  const handleNameChange = (event, index, oldId) => {
    updateSectionTab(index, { label: event.target.value, type: "section", id: oldId });
  }
  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>Add fields</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody}>
        <Tabs selectedIndex={selectedSettingsTab} onSelect={setSelectedSettingsTab}>
          <TabList>
            <Tab>Form fields</Tab>
            <Tab>Relation tabs</Tab>
            <Tab>Section Tabs</Tab>
          </TabList>

          <TabPanel>
            <div className={styles.fieldsBlock}>
              <Container
                groupName="1"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => ({
                  ...unusedFields[i],
                  field_name: unusedFields[i]?.label ?? unusedFields[i]?.title,
                })}
              >
                {unusedFields?.map((field, index) => (
                  <Draggable key={field.id} style={{ overflow: "visible" }}>
                    <div className={styles.sectionFieldRow}>
                      <FormElementGenerator field={field} control={mainForm.control} disabledHelperText />
                    </div>
                  </Draggable>
                ))}
              </Container>

              {!!unusedRelations?.length && (
                <div className={styles.settingsBlockHeader}>
                  <h2>Relation input fields</h2>
                </div>
              )}

              <Container
                groupName="1"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => ({
                  ...unusedRelations[i],
                  field_name: unusedRelations[i]?.label ?? unusedFields[i]?.title,
                  relation_type: unusedRelations[i].type,
                })}
              >
                {unusedRelations?.map((relation) => (
                  <Draggable key={relation.id} style={{ overflow: "visible" }}>
                    <div className={styles.sectionFieldRow}>
                      <FormElementGenerator field={relation} control={mainForm.control} disabledHelperText />
                    </div>
                  </Draggable>
                ))}
              </Container>
            </div>
          </TabPanel>

          <TabPanel>
            <div className={styles.fieldsBlock}>
              <Container groupName="table_relation" onDrop={onDrop} dropPlaceholder={{ className: "drag-row-drop-preview" }} getChildPayload={(i) => unusedTableRelations[i]}>
                {unusedTableRelations?.map((relation) => (
                  <Draggable key={relation.id} style={{ overflow: "visible", width: "fit-content" }}>
                    <div className={`${styles.sectionFieldRow} ${styles.relation}`}>{relation.title ?? relation[relation.relatedTableSlug]?.label}</div>
                  </Draggable>
                ))}
              </Container>
            </div>
          </TabPanel>

          <TabPanel>
            <div className={styles.fieldsBlock}>
              <Container groupName="section_tabs" onDrop={onDrop} dropPlaceholder={{ className: "drag-row-drop-preview" }} getChildPayload={(i) => unusedTableRelations[i]}>
                {sectionTabs?.map((tab, index) => (
                  <Draggable key={index} style={{ overflow: "visible", width: "fit-content" }}>
                    <div className={`${styles.sectionFieldRow} ${styles.relation}`}>
                      <OutlinedInput
                      value={tab.label}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        onChange={(e) => handleNameChange(e, index, tab.id)}
                        style={{ border: "none", outline: "none", fontWeight: 500, minWidth: 100, background: "transparent" }}
                      />
                    </div>
                  </Draggable>
                ))}

                <Button onClick={() => appendSectionTab({ type: "section", id: generateGUID() })}>
                  <Add />
                  Add Section tab
                </Button>
              </Container>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default FieldsBlock;
