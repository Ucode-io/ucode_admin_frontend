import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const TimesColumn = () => {
  const { tableSlug } = useParams()
  const groupColumns = useSelector(
    (state) => state.tableColumn.calendarGroupColumns[tableSlug] ?? []
  )

  useEffect(() => {
    console.log('ssssss')
  } , [])

  return (
    <div className={styles.timesColumn}>
      <div className={styles.timeRow}></div>
      {groupColumns?.map((el) => (
        <div className={styles.timeRow} />
      ))}

      {timesList.map((time) => (
        <div key={time} className={styles.timeRow}>
          {time}
        </div>
      ))}
    </div>
  )
}

export default TimesColumn
