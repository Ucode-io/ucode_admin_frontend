import { Card, Typography } from "@mui/material"
import { useFieldArray } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import styles from "./style.module.scss"
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator"
import { applyDrag } from "../../../../../utils/applyDrag"
import { useMemo } from "react"

const FieldsBlock = ({ mainForm, layoutForm, usedFields }) => {
  const { fields } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  })

  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "layoutRelations",
    keyName: "key",
  })

  const unusedFields = useMemo(() => {
    return fields?.filter((field) => !usedFields.includes(field.id))
  }, [usedFields, fields])

  const computedRelations = useMemo(() => {
    return relations.map((relation) => ({
      ...relation,
      fields: relation.fields?.filter(
        (field) => !usedFields.includes(field.id)
      ) ?? [],
    })) ?? []
  }, [usedFields, relations])

  const onDrop = (dropResult, colNumber) => {
    const result = applyDrag(fields, dropResult)

    if (!result) return
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
            getChildPayload={(i) => ({
              ...unusedFields[i],
              field_name: unusedFields[i]?.label,
            })}
          >
            {unusedFields?.map((field, index) => (
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

      {computedRelations?.map((relation) => (
        <Card className={styles.fieldCard}>
          <div className={styles.fieldCardHeader}>
            <Typography variant="h4">{relation[relation.relatedTableSlug]?.label}</Typography>
          </div>

          <div className={styles.fieldsWrapperBlock}>
            <Container
              groupName="1"
              onDrop={onDrop}
              dropPlaceholder={{ className: "drag-row-drop-preview" }}
              getChildPayload={(i) => ({
                ...relation.fields[i],
                field_name: relation.fields[i]?.label,
              })}
            >
              {relation.fields?.map((field, index) => (
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
      ))}
    </div>
  )
}

export default FieldsBlock
