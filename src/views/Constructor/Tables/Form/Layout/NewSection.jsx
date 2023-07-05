import { Add, Delete } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import ButtonsPopover from "../../../../../components/ButtonsPopover";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import { applyDrag } from "../../../../../utils/applyDrag";
import styles from "./style.module.scss";

const NewSection = ({
  mainForm,
  index,
  layoutForm,
  fieldsMap,
  openFieldSettingsBlock,
  openFieldsBlock,
  openRelationSettingsBlock,
  selectedLayoutIndex,
  selectedTabIndex,
  removeSection,
}) => {
  const sectionFields = useFieldArray({
    control: mainForm.control,
    name: `layouts.${selectedLayoutIndex}.tabs.${selectedTabIndex}.sections.${index}.fields`,
    keyName: "key",
  });

  const openSettingsBlock = (field) => {
    if (!field.id?.includes("#")) {
      openFieldSettingsBlock(fieldsMap[field.id] ?? field);
      return;
    }

    const relationsMap = mainForm.getValues("relationsMap");
    const relationId = field.id.split("#")[1];

    const relation = relationsMap[relationId];

    openRelationSettingsBlock(relation);
  };

  const onDrop = (dropResult) => {
    const { fields, insert, move, remove } = sectionFields;

    const result = applyDrag(fields, dropResult);

    if (!result) return;
    if (result.length > fields.length) {
      insert(dropResult.addedIndex, { ...dropResult.payload });
    } else if (result.length < fields.length) {
      remove(dropResult.removedIndex);
    } else {
      move(dropResult.removedIndex, dropResult.addedIndex);
    }
  };

  const removeField = (indexField, colNumber) => {
    const { remove } = sectionFields;
    remove(indexField);
  };

  const deleteSection = () => {
    removeSection(index);
  };

  console.log('sectionFields?.fields', sectionFields?.fields)

  return (
    <Card className={`${styles.newsectionCard}`}>
      <div className={styles.newsectionCardHeader}>
        <div className={styles.newsectionCardHeaderLeftSide}>
          {/* <HFIconPicker
            control={mainForm.control}
            name={`sections[${index}].icon`}
            disabledHelperText
          /> */}

          <HFTextField
            disabledHelperText
            placeholder="Label"
            control={mainForm.control}
            name={`layouts.${selectedLayoutIndex}.tabs.${selectedTabIndex}.sections.${index}.label`}
            size="small"
            style={{ width: 170 }}
          />
        </div>

        <div className="flex gap-1" style={{ marginLeft: "5px" }}>
          <RectangleIconButton onClick={() => openFieldsBlock("FIELD")}>
            <Add />
          </RectangleIconButton>
        </div>

        {/* <SectionSettingsDropdown
          columnType={columnType}
          setColumnType={setColumnType}
          control={mainForm.control}
          onDelete={() => sectionsFieldArray.remove(index)}
        /> */}
      </div>

      <div className={styles.newsectionCardBody}>
        <Container
          style={{ minHeight: 50, width: "100%", display: "flex", flexDirection: "row", alignItems: "center", overflowX: "scroll" }}
          groupName="1"
          dragClass="drag-row"
          orientation="horizontal"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
          onDrop={(dragResults) => onDrop(dragResults, 1)}
          getChildPayload={(index) => sectionFields.fields[index]}
        >
          {sectionFields?.fields?.map((field, fieldIndex) => (
            <Draggable key={field.key} style={{ minWidth: "300px" }}>
              <div className={styles.newsectionCardRow}>
                <FormElementGenerator
                  control={layoutForm.control}
                  field={fieldsMap[field.id] ?? field}
                  isLayout={true}
                  sectionIndex={index}
                  column={1}
                  fieldIndex={fieldIndex}
                  mainForm={mainForm}
                />
                <ButtonsPopover className={styles.deleteButton} onEditClick={() => openSettingsBlock(field)} onDeleteClick={() => removeField(fieldIndex, 1)} />
                {/* <RectangleIconButton
                  className={styles.deleteButton}
                  color={"error"}
                  onClick={() => removeField(fieldIndex, 1)}
                >
                  <Delete color="error" />
                </RectangleIconButton>
                <RectangleIconButton
                  className={styles.deleteButton}
                  color={"primary"}
                  onClick={() => openFieldSettingsBlock(fieldsMap[field.id] ?? field)}
                >
                  <Settings color="primary" />
                </RectangleIconButton> */}
              </div>
            </Draggable>
          ))}
        </Container>
      </div>
      <div className={styles.newSectionDelete}>
        <RectangleIconButton color="error" onClick={deleteSection}>
          <Delete color="error" />
        </RectangleIconButton>
      </div>
    </Card>
  );
};

export default NewSection;
