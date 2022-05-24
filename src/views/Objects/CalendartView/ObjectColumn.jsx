import { differenceInMinutes, setHours } from "date-fns"
import { useMemo } from "react"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const ObjectColumn = ({ data = [], view }) => {
  const computedData = useMemo(() => {
    if (!data.length) return []

    const calendarStartTime = setHours(data[0].startTime, 8)

    const result = data.map((el) => {
      const startPosition =
        Math.floor(differenceInMinutes(el.startTime, calendarStartTime) / 30) *
        40
      const height =
        Math.ceil(differenceInMinutes(el.endTime, el.startTime) / 30) * 40 - 10

      return {
        ...el,
        startPosition,
        height,
      }
    })

    return result

    // const startTime = data[view.]
  }, [data])

  console.log("COMPUTED POSITOINS ==>", computedData)

  return (
    <div className={styles.objectColumn}>
      {timesList.map((time) => (
        <div key={time} className={styles.calendarRow} />
      ))}

      {computedData.map((el) => (
        <div
          key={el.guid}
          className={styles.infoBlockWrapper}
          style={{ top: el.startPosition }}
        >
          <div className={styles.infoBlock} style={{ height: el.height }} >
            <p>Khamidullaev</p>
            <p>Zafar</p>
            <p className={styles.time}>8:00 - 9:00</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ObjectColumn
