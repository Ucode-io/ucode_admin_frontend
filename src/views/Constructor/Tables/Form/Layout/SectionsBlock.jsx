import { Delete } from "@mui/icons-material"
import { Card, TextField } from "@mui/material"
import {Draggable, Container} from 'react-smooth-dnd'
import { useForm } from "react-hook-form"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import FRow from "../../../../../components/FormElements-backup/FRow"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import styles from "./style.module.scss"

const SectionsBlock = () => {
  const { control } = useForm()

  return (
    <div className={styles.sectionsBlock}>
      <Card className={styles.sectionCard}>
        <div className={styles.sectionCardHeader}>
          <TextField size="small" style={{ width: 300 }} />

          <RectangleIconButton color="error">
            <Delete color="error" />
          </RectangleIconButton>
        </div>

        <div className={styles.sectionCardBody}>
          <div className={styles.sectionCardColumn}>
            <Container
              lockAxis="y"
              groupName="1"
              onDrop={(values) => console.log("VALUES ==>", values)}
            >
              <Draggable>
              <div className={styles.sectionCardRow}>
                <FRow label="Name">
                  <HFTextField control={control} fullWidth />
                </FRow>
              </div>
              </Draggable>
            </Container>
          </div>



          <div className={styles.sectionCardColumn}>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SectionsBlock
