import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const ObjectColumn = () => {
  return (
    <div className={styles.objectColumn}>
      {timesList.map((time) => (
        <div key={time} className={styles.calendarRow} />
      ))}
    </div>
  )
}

export default ObjectColumn
