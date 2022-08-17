

import { format } from "date-fns"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import useTimeList from "../../../hooks/useTimeList"
import styles from "./style.module.scss"

const TimesColumn = ({ view }) => {
  const { tableSlug } = useParams()
  const { timeList } = useTimeList(view.time_interval)

  const groupColumns = useSelector(
    (state) => state.tableColumn.calendarGroupColumns[tableSlug] ?? []
  )

  return (
    <div className={styles.timesColumn}>
      <div className={styles.timeRow}></div>
      {groupColumns?.map((el) => (
        <div className={styles.timeRow} />
      ))}

      {timeList.map((time) => (
        <div key={time} className={styles.timeRow}>
          { format(time, 'HH:mm') }
        </div>
      ))}
    </div>
  )
}

export default TimesColumn
