import { ArrowDropDown, ArrowRight } from "@mui/icons-material"
import styles from "./style.module.scss"

const MainFieldRow = () => {
  return (
    <div className={styles.mainFieldRow}>
      <div className={styles.mainFieldNamesBlock}>
        <div>Доктор <ArrowRight /> </div>

        <div>Время <ArrowDropDown /> </div>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>

      <div className={styles.mainFieldBlock}>
        <p className={styles.mainFieldTitle}>Алексей Иванов</p>
        <p className={styles.mainFieldSubtitle}>Кардиолог</p>
      </div>
  

    </div>
  )
}

export default MainFieldRow
