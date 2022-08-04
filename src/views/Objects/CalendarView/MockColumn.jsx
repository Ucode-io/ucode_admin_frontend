
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const MockColumn = () => {

  // return 'mmmmm'

  return timesList.map((time, index) => (
    <div
      key={time}
      className={styles.timeBlock}
      // className={`${styles.calendarRow} ${index < disabledDates?.startIndex || index > disabledDates?.endIndex || (hasDisabledDates && !disabledDates) ? styles.disabled : ''}`}
      style={{ overflow: "auto" }}
    >
      {/* <div
        className={`${styles.addButton}`}
        onClick={() => navigateToCreatePage(column?.date, time)}
      >
        <Add color="" />
        Создат
      </div> */}
    </div>
  ))
}

export default MockColumn
