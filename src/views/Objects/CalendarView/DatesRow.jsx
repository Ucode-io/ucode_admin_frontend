import { useMemo } from "react"
import styles from "./style.module.scss"
import { add, format } from "date-fns"

const DatesRow = ({ computedDates }) => {

    return (
    <div className={styles.datesRow}>
      <div className={styles.sss} />

      {computedDates?.map((el) => (
        <div key={el} className={styles.dateBlock} style={{ minWidth: 200 }} >{el}</div>
      ))}
    </div>
  )
}

export default DatesRow
