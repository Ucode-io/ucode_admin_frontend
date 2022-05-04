import { Delete } from "@mui/icons-material"
import { Card } from "@mui/material"
import { useState } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import FormElementGenerator from "../../../../../components/FormElementGenerator"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import { applyDrag } from "../../../../../utils/applyDrag"
import SectionSettingsDropdown from "../../../components/SectionSettingsDropdown"
import styles from "./style.module.scss"

const Section = ({ section, control, index, remove, update, layoutControl, fieldsMap }) => {
  
  const columnType = useWatch({
    control,
    name: `sections.${index}.column`
  })

  const column1 = useFieldArray({
    control,
    name: `sections[${index}].column1`,
    keyName: "key",
  })

  const column2 = useFieldArray({
    control,
    name: `sections[${index}].column2`,
    keyName: "key",
  })

  const columns = { column1, column2 }

  const onDrop = (dropResult, colNumber) => {

    const { fields, insert, move, remove } = columns[`column${colNumber}`]

    const result = applyDrag(fields, dropResult)

    if (!result) return

    console.log("ONDROP ==>", dropResult, colNumber)

    if (result.length > fields.length) {
      insert(dropResult.addedIndex, { ...dropResult.payload })
    } else if (result.length < fields.length) {
      remove(dropResult.removedIndex)
    } else {
      move(dropResult.removedIndex, dropResult.addedIndex)
    }
  }

  const setColumnType = (type) => {
    update(index, { ...section, column: type })
  }

  const removeField = (index, colNumber) => {
    const { remove } = columns[`column${colNumber}`]

    remove(index)
  }
  


  return (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionCardHeader}>
        <HFTextField
          autoFocus
          disabledHelperText
          placeholder="Label"
          control={control}
          name={`sections[${index}].label`}
          size="small"
          style={{ width: 300 }}
        />

        <SectionSettingsDropdown
          columnType={columnType}
          setColumnType={setColumnType}
          control={control}
          onDelete={() => remove(index)}
        />
      </div>
      <div className={styles.sectionCardBody}>
        <div className={styles.sectionCardColumn}>
          <Container
            style={{ minHeight: 150 }}
            groupName="1"
            dragClass="drag-row"
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            onDrop={(dragResults) => onDrop(dragResults, 1)}
            getChildPayload={(index) => columns.column1.fields[index]}
          >
            {column1?.fields?.map((field, fieldIndex) => (
              <Draggable key={field.key}>
                <div className={styles.sectionCardRow}>
                  <FormElementGenerator
                    control={layoutControl}
                    field={fieldsMap[field.id]}
                  />
                  <RectangleIconButton color={"error"}  onClick={() => removeField(fieldIndex, 2)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </div>
              </Draggable>
            ))}
          </Container>
        </div>

        <div className={styles.sectionCardColumn}>
          {columnType === 'DOUBLE' &&  <Container
            style={{ minHeight: 150 }}
            groupName="1"
            drag-row="drag-row"
            dragClass="drag-row"
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            onDrop={(dragResults) => onDrop(dragResults, 2)}
            getChildPayload={(index) => columns.column2.fields[index]}
          >
            {column2.fields?.map((field, fieldIndex) => (
              <Draggable key={field.key}>
                <div className={styles.sectionCardRow}>
                  <FormElementGenerator
                    control={layoutControl}
                    field={fieldsMap[field.id]}
                  />
                  <RectangleIconButton color={"error"} onClick={() => removeField(fieldIndex, 2)}  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </div>
              </Draggable>
            ))}
          </Container>}
        </div>

      </div>
    </Card>
  )
}

export default Section
