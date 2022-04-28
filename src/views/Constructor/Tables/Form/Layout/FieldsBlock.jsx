import { Card, Typography } from "@mui/material"
import { useFieldArray } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import styles from "./style.module.scss"

const FieldsBlock = ({ control }) => {
  const { fields } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  })

  return (
    <div className={styles.fieldsBlock}>
      <Card className={styles.fieldCard}>
        <div className={styles.fieldCardHeader}>
          <Typography variant="h4">Fields</Typography>
        </div>

        <div className={styles.fieldsWrapperBlock}>
          <Container
            behaviour="copy"
            onDrop={(values) => console.log("VALUES ==>", values)}
            ropPlaceholder={{ className: "drag-row-drop-preview" }}
            getChildPayload={i => fields[i]}
          >
            {fields.map((field, index) => (
              <Draggable key={field.id} style={{ overflow: 'visible' }}>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldRowLabel}>{field.label}</div>
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
