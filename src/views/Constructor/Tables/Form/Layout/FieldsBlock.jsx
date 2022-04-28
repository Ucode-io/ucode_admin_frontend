import { Card, Typography } from "@mui/material"
import { useFieldArray, useForm } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import styles from "./style.module.scss"
import FormElementGenerator from "../../../../../components/FormElementGenerator"

const FieldsBlock = ({ control }) => {
  const { fields } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  })


  const { control: Control } = useForm()

  return (
    <div className={styles.fieldsBlock}>
      <Card className={styles.fieldCard}>
        <div className={styles.fieldCardHeader}>
          <Typography variant="h4">Fields</Typography>
        </div>

        <div className={styles.fieldsWrapperBlock}>
          <Container
            // behaviour="copy"
            groupName="1"
            onDrop={(values) => console.log("VALUES ==>", values)}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            getChildPayload={(i) => fields[i]}
          >
            {fields.map((field, index) => (
              <Draggable key={field.id} style={{ overflow: "visible" }}>
                <div className={styles.sectionFieldRow}>
                  <FormElementGenerator
                    label={field.label}
                    control={Control}
                    type={field.type}
                    name={field.id}
                    attributes={field.attributes}
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
