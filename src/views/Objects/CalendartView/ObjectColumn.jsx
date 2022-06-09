import { get } from "@ngard/tiny-get"
import { differenceInMinutes, format, setHours } from "date-fns"
import { useMemo } from "react"
import { getFieldLabel } from "../../../utils/getFieldLabel"
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

  }, [data])

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
            {
              view?.view_fields?.map(field => (
                <p key={field} >{  getFieldLabel(el, field) }</p>
              ))
            }
           
            {/* <p>Zafar</p> */}
            <p className={styles.time}>{ format(el.startTime, 'HH:mm') } - { format(el.endTime, 'HH:mm') }</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ObjectColumn
