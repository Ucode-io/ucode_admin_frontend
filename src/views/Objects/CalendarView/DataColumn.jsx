import { differenceInMinutes, format, setHours, setMinutes } from "date-fns"
import { useMemo } from "react"
import { getFieldLabel } from "../../../utils/getFieldLabel"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const DataColumn = ({ computedData, date, view }) => {

  const computedDataWithPosition = useMemo(() => {
    if (!computedData?.length) return []
    
    const calendarStartedTime = setMinutes(setHours(date, 8), 0)

    const result = computedData.filter(el => format(el.calendarStartTime, 'dd.MM.yyyy') === format(date, 'dd.MM.yyyy') ).map((el) => {
      const startPosition =
        Math.floor(
          differenceInMinutes(el.calendarStartTime, calendarStartedTime) / 30
        ) * 40
      const height =
        Math.ceil(
          differenceInMinutes(el.calendarEndTime, el.calendarStartTime) / 30
        ) *
          40 -
        10

      return {
        ...el,
        startPosition,
        height,
      }
    })

    return result
  }, [computedData, date])

  console.log('computedDataWithPosition --->', computedDataWithPosition)

  return (
    <div className={styles.objectColumn} >
      {timesList.map((time, index) => (
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
      ))}

      {computedDataWithPosition?.map((el) => (
        <div
          key={el.guid}
          className={styles.infoBlockWrapper}
          style={{ top: el.startPosition }}
        >
          <div className={styles.infoBlock} style={{ height: el.height }}>
            {view?.view_fields?.map((field) => (
              <p key={field}>{getFieldLabel(el, field)}</p>
            ))}

            <p className={styles.time}>
              {format(el.calendarStartTime, "HH:mm")} - {format(el.calendarEndTime, "HH:mm")}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DataColumn
