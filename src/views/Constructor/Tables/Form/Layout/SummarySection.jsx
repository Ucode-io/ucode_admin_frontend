import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import ButtonsPopover from "../../../../../components/ButtonsPopover";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import { applyDrag } from "../../../../../utils/applyDrag";
import styles from "./style.module.scss";

const SummarySection = ({
  mainForm,
  layoutForm,
  openFieldSettingsBlock,
  openFieldsBlock,
  openRelationSettingsBlock,
}) => {

  const navigate = useNavigate();
  const { fields: sections, ...sectionsFieldArray } = useFieldArray({
    control: mainForm.control,
    name: "summary_section.fields",
    keyName: "key",
  });

  const fieldsList = useWatch({
    control: mainForm.control,
    name: `fields`,
  });

  const name = useWatch({
    control: mainForm.control,
    name: `label`,
  });

  const fieldsMap = useMemo(() => {
    const map = {};

    fieldsList.forEach((field) => {
      map[field.id] = field;
    });
    return map;
  }, [fieldsList]);

  const onDrop = (dropResult) => {
    const result = applyDrag(sections, dropResult);

    if (result) {
      sectionsFieldArray.move(dropResult.removedIndex, dropResult.addedIndex);
      sectionsFieldArray.replace(result);
    }
  };
  const removeField = (index, colNumber) => {
    sectionsFieldArray.remove(index);
  };

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

  console.log('sssssssssss', mainForm.watch())

  return (
    <div className={styles.summarySection}>
      <div className={styles.summaySectionTitle}>
          <span onClick={() => navigate(-1)}><ArrowBackIcon/></span>
          <h2>{name}</h2>
      </div>
      <Container
        style={{ minHeight: 20, minWidth: "100%" }}
        groupName="1"
        dragClass="drag-row"
        orientation="horizontal"
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
        onDrop={(dragResults) => onDrop(dragResults, 1)}
      >
        {sections?.map((field, fieldIndex) => (
          <Draggable key={field.key}>
            <div className={styles.field_summary}>
              <div className={styles.field_summary_item}>
                <FormElementGenerator
                  control={layoutForm.control}
                  field={fieldsMap[field.id] ?? field}
                  isLayout={true}
                  sectionIndex={fieldIndex}
                  column={1}
                  fieldIndex={fieldIndex}
                  mainForm={mainForm}
                  maxWidth={true}
                />
              </div>
              <ButtonsPopover
                className={styles.deleteButton}
                onEditClick={() => openSettingsBlock(field)}
                onDeleteClick={() => removeField(fieldIndex, 1)}
              />
            </div>
          </Draggable>
        ))}
      </Container>
    </div>
  );
};

export default SummarySection;
