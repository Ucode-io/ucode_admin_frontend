import { Add } from "@mui/icons-material"
import { Card } from "@mui/material"
import { Draggable, Container } from "react-smooth-dnd"
import { useFieldArray, useWatch } from "react-hook-form"
import styles from "./style.module.scss"
import Section from "./Section"
import { applyDrag } from "../../../../../utils/applyDrag"
import { generateGUID } from "../../../../../utils/generateID"
import { useMemo } from "react"

const SectionsBlock = ({ control, layoutControl }) => {
  const {
    fields: sections,
    append,
    remove,
    replace,
    move
  } = useFieldArray({
    control,
    name: "sections",
    keyName: "key",
  })

  const addNewSection = () => {
    append({
      column: "string",
      fields: [],
      // id: "string",
      label: "",
      order: sections.length,
      id: generateGUID()
    })
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(sections, dropResult)

    if(result) {
      move(dropResult.removedIndex, dropResult.addedIndex)
      replace(result)
    }
  }

  const fieldsList = useWatch({
    control,
    name: `fields`
  })

  const fieldsMap = useMemo(() => {
    const map = {}

    fieldsList.forEach(field => {
      map[field.id] = field
    })

    return map
  }, [fieldsList])


  return (
    <div className={styles.sectionsBlock}>
      {!!sections.length && (
        <Container
          lockAxis="y"
          onDrop={onDrop}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {sections.map((section, index) => (
            <Draggable key={section.id}>
              <Section
                key={section.id}
                index={index}
                section={section}
                control={control}
                remove={remove}
                layoutControl={layoutControl}
                fieldsMap={fieldsMap}
              />
            </Draggable>
          ))}
        </Container>
      )}

      <Card className={styles.sectionCreateCard}>
        <div className={styles.sectionCreateButton} onClick={addNewSection}>
          <Add color="primary" />
          <p>Add section</p>
        </div>
      </Card>
    </div>
  )
}

export default SectionsBlock
