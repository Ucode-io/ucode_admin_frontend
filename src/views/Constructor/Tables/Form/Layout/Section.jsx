import { Delete } from "@mui/icons-material"
import { Card } from "@mui/material"
import { useMemo } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import FormElementGenerator from "../../../../../components/FormElementGenerator"
import FRow from "../../../../../components/FormElements-backup/FRow"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import { applyDrag } from "../../../../../utils/applyDrag"
import styles from "./style.module.scss"

const Section = ({ control, index, remove, layoutControl, fieldsMap }) => {
  const { fields, insert, move, remove: removeField } = useFieldArray({
    control,
    name: `sections[${index}].fields`,
    keyName: "key",
  })

  const onDrop = (dropResult) => {
    const result = applyDrag(fields, dropResult)

    if (!result) return

    if (result.length > fields.length) {
      insert(dropResult.addedIndex, dropResult.payload)
    } else {
      move(dropResult.removedIndex, dropResult.addedIndex)
    }
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

        <RectangleIconButton color="error" onClick={() => remove(index)}>
          <Delete color="error" />
        </RectangleIconButton>
      </div>
      <div className={styles.sectionCardBody}>
        <div className={styles.sectionCardColumn}>
          <Container
            lockAxis="y"
            style={{ minHeight: 150 }}
            groupName="1"
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            onDrop={onDrop}
          >
            {fields.map((field, fieldIndex) => (
              <Draggable key={field.key} >
                <div className={styles.sectionCardRow}>
                  <FormElementGenerator control={layoutControl} field={fieldsMap[field.id]} />
                  <RectangleIconButton color={'error'} onClick={() => removeField(fieldIndex)} >
                    <Delete color="error" />
                  </RectangleIconButton>
                </div>
              </Draggable>
            ))}
          </Container>
        </div>

        <div className={styles.sectionCardColumn}></div>
      </div>
    </Card>
  )
}

export default Section
