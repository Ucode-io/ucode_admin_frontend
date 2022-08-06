import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const TimesColumn = () => {
  const { tableSlug } = useParams()
  const groupColumns = useSelector(
    (state) => state.tableColumn.calendarGroupColumns[tableSlug] ?? []
  )

  return (
    <div className={styles.timesColumn}>
      <div className={styles.timeBlock}></div>
      {groupColumns?.map((el) => (
        <div className={styles.timeBlock} />
      ))}

      {timesList.map((time) => (
        <div key={time} className={styles.timeBlock}>
          {time}
        </div>
      ))}
    </div>
  )
}

export default TimesColumn
