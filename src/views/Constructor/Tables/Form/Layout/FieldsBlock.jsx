import { Card, Typography } from "@mui/material"
import { useFieldArray } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import styles from "./style.module.scss"
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator"
import { applyDrag } from "../../../../../utils/applyDrag"
import { useMemo } from "react"

const FieldsBlock = ({ mainForm, layoutForm, usedFields }) => {
  const { fields, insert, remove, move } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  })

  const unusedFields = useMemo(() => {

    return fields?.filter(field => !usedFields.includes(field.id))
  }, [usedFields, fields])


  const onDrop = (dropResult, colNumber) => {
    const result = applyDrag(fields, dropResult)

    if (!result) return

    // if (result.length > fields.length) {
    //   insert(dropResult.addedIndex, { ...dropResult.payload })
    // } else if (result.length < fields.length) {
    //   remove(dropResult.removedIndex)
    // } else {
    //   move(dropResult.removedIndex, dropResult.addedIndex)
    // }
  }


  return (
    <div className={styles.fieldsBlock}>
      <Card className={styles.fieldCard}>
        <div className={styles.fieldCardHeader}>
          <Typography variant="h4">Fields</Typography>
        </div>

        <div className={styles.fieldsWrapperBlock}>
          <Container
            groupName="1"
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            getChildPayload={(i) => unusedFields[i]}
          >
            {unusedFields.map((field, index) => (
              <Draggable key={field.id} style={{ overflow: "visible" }}>
                <div className={styles.sectionFieldRow}>
                  <FormElementGenerator
                    field={field}
                    control={layoutForm.control}
                    disabledHelperText
                  />
                </div>
              </Draggable>
            ))}
          </Container>
        </div>
      </Card>
    </div>
  )
}

export default FieldsBlock
