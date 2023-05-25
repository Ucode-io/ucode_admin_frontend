import { Add } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../../../utils/applyDrag";
import NewSection from "./NewSection";
import styles from "./style.module.scss";
import { generateGUID } from "../../../../../utils/generateID";

const NewSectionsBlock = ({
  mainForm,
  layoutForm,
  openFieldSettingsBlock,
  openFieldsBlock,
  openRelationSettingsBlock,
  selectedLayout,
  setSelectedLayout,
  selectedTab,
  sectionTabs,
}) => {
  const selectedLayoutIndex = useWatch({
    control: mainForm.control,
    name: "layouts",
  })?.findIndex((layout) => layout.id === selectedLayout.id);

  const selectedTabIndex = useWatch({
    control: mainForm.control,
    name: `layouts.${selectedLayoutIndex}.tabs`,
  })?.findIndex((tab) => tab.id === selectedTab.id);

  const { fields: sections, append: appendSection, move: moveSection, replace: replaceSection, remove: removeSection } = useFieldArray({
    control: mainForm.control,
    name: `layouts.${selectedLayoutIndex}.tabs.${selectedTabIndex}.sections`,
    keyName: "key",
  });

  const computedSections = useWatch({
    control: mainForm.control,
    name: `layouts.${selectedLayoutIndex}.tabs.${selectedTabIndex}.sections`,
  });

  const fieldsList = useWatch({
    control: mainForm.control,
    name: `fields`,
  });

  const fieldsMap = useMemo(() => {
    const map = {};

    fieldsList.forEach((field) => {
      map[field.id] = field;
    });
    return map;
  }, [fieldsList]);

  const addNewSection = () => {
    appendSection({id: generateGUID()});
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(sections, dropResult);

    if (result) {
      moveSection(dropResult.removedIndex, dropResult.addedIndex);
      replaceSection(result);
    }
  };

  return (
    <div className={styles.newsectionsBlock}>
      {!!sections.length && (
        <Container lockAxis="y" onDrop={onDrop} dropPlaceholder={{ className: "drag-row-drop-preview" }}>
          {computedSections?.length > 0 &&
            computedSections.map((section, index) => (
              <Draggable key={section.id}>
                <NewSection
                  index={index}
                  selectedLayoutIndex={selectedLayoutIndex}
                  selectedTabIndex={selectedTabIndex}
                  selectedLayout={selectedLayout}
                  selectedTab={selectedTab}
                  mainForm={mainForm}
                  section={section}
                  layoutForm={layoutForm}
                  fieldsMap={fieldsMap}
                  openFieldSettingsBlock={openFieldSettingsBlock}
                  sectionsFieldArray={sections}
                  openFieldsBlock={openFieldsBlock}
                  openRelationSettingsBlock={openRelationSettingsBlock}
                  removeSection={removeSection}
                />
              </Draggable>
            ))}
        </Container>
      )}

      <Card className={styles.newsectionCreateCard}>
        <div className={styles.newsectionCreateButton} onClick={addNewSection}>
          <Add color="primary" />
          <p>Add section</p>
        </div>
      </Card>
    </div>
  );
};

export default NewSectionsBlock;
