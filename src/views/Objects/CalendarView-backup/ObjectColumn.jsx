import { Add } from "@mui/icons-material"
import { differenceInMinutes, format, parse, setHours, setMinutes } from "date-fns"
import { useMemo } from "react"
import { getFieldLabel } from "../../../utils/getFieldLabel"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const ObjectColumn = ({ column, view, columnIndex, disableDatesTable = {}, navigateToCreatePage, hasDisabledDates }) => {
  const computedData = useMemo(() => {
    const data = column.data

    if (!data?.length) return []
    
    const calendarStartedTime = setMinutes(setHours(data[0]?.calendarStartTime, 8), 0)

    const result = data.map((el) => {
      const startPosition =
        Math.floor(differenceInMinutes(el.calendarStartTime, calendarStartedTime) / 30) *
        40
      const height =
        Math.ceil(differenceInMinutes(el.calendarEndTime, el.calendarStartTime) / 30) * 40 - 10

      return {
        ...el,
        startPosition,
        height,
      }
    })
    return result
  }, [column])

  const disabledDates = useMemo(() => {
    if (!column.date) return []

    const columnDate = parse(column.date, 'dd.MM.yyyy', new Date())

    const weekIndex = format(columnDate, 'i')
    
    const calendarStartedTime = setMinutes(setHours(columnDate, 8), 0)

    const day = disableDatesTable[weekIndex - 1]

    const startTime = parse(day?.calendarFromTime, 'HH:mm', columnDate) 
    const endTime = parse(day?.calendarToTime, 'HH:mm', columnDate)
    
    const startIndex = Math.ceil(differenceInMinutes(startTime, calendarStartedTime) / 30)
    const endIndex = Math.floor(differenceInMinutes(endTime, calendarStartedTime) / 30) - 1

    if(isNaN(startIndex) || isNaN(endIndex)) return null

    return {
      startIndex,
      endIndex
    }

  }, [column, disableDatesTable])

  console.log('disableDatesTable ===>', disabledDates)

  return (
    <div className={styles.objectColumn}>
      {timesList.map((time, index) => (
        <div
          key={time}
          className={`${styles.calendarRow} ${index < disabledDates?.startIndex || index > disabledDates?.endIndex || (hasDisabledDates && !disabledDates) ? styles.disabled : ''}`}
          style={{ overflow: "auto" }}
        >
          <div
            className={`${styles.addButton}`}
            onClick={() => navigateToCreatePage(column?.date, time)}
          >
            <Add color="" />
            Создат
          </div>
        </div>
      ))}

      {computedData?.map((el) => (
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
              {/* {format(el.startTime, "HH:mm")} - {format(el.endTime, "HH:mm")} */}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ObjectColumn
