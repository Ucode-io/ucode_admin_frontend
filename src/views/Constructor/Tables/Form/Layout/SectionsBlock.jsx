import { Delete } from '@mui/icons-material'
import { Card, TextField } from '@mui/material'
import RectangleIconButton from '../../../../../components/Buttons/RectangleIconButton'
import styles from './style.module.scss'

const SectionsBlock = () => {
  return <div className={styles.sectionsBlock}>
    <Card className={styles.sectionCard} >
      <div className={styles.sectionCardHeader}>
        <TextField size='small' style={{ width: 300 }} />

        <RectangleIconButton color='error' >
          <Delete color='error' />
        </RectangleIconButton>

      </div>

      <div className={styles.sectionCardBody} >
        
      </div>

    </Card>
  </div>
}

export default SectionsBlock
