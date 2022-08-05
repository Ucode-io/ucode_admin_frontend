import { Add } from "@mui/icons-material"
import {
  differenceInMinutes,
  format,
  parse,
  setHours,
  setMinutes,
} from "date-fns"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import useTabRouter from "../../../hooks/useTabRouter"
import { getFieldLabel } from "../../../utils/getFieldLabel"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const DataColumn = ({ computedData, date, view, workingDays }) => {
  const { navigateToForm } = useTabRouter()
  const { tableSlug } = useParams()

  const parentSlug = computedData?.[0]?.parent_slug
  const parentValue = computedData?.[0]?.[parentSlug]

  const computedDataWithPosition = useMemo(() => {
    if (!computedData?.length) return []

    const calendarStartedTime = setMinutes(setHours(date, 8), 0)

    const result = computedData
      .filter(
        (el) =>
          format(el.calendarStartTime, "dd.MM.yyyy") ===
          format(date, "dd.MM.yyyy")
      )
      .map((el) => {
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

  const disabledTimes = useMemo(() => {
    if (!workingDays) return null
    const workingDay = workingDays[format(date, "dd.MM.yyyy")]

    const filteredWorkingDay = workingDay?.find(
      (el) => el[parentSlug] === parentValue
    )

    const calendarStartedTime = setMinutes(setHours(date, 8), 0)

    const startTime = parse(filteredWorkingDay?.calendarFromTime, "HH:mm", date)
    const endTime = parse(filteredWorkingDay?.calendarToTime, "HH:mm", date)

    const startIndex = Math.ceil(
      differenceInMinutes(startTime, calendarStartedTime) / 30
    )
    const endIndex =
      Math.floor(differenceInMinutes(endTime, calendarStartedTime) / 30) - 1

    if (isNaN(startIndex) || isNaN(endIndex)) return null

    return {
      startIndex,
      endIndex,
    }
  }, [workingDays, date, computedData])

  const isDisabled = (index) => {
    if (!view?.disable_dates?.day_slug) return false

    if (!disabledTimes?.startIndex || !disabledTimes?.endIndex) return true

    return index < disabledTimes?.startIndex || index > disabledTimes?.endIndex
  }

  const navigateToCreatePage = (time) => {
    const [hour, minute] = time?.split("-")?.[0]?.trim()?.split(":")

    const computedDate = setHours(setMinutes(date, minute), hour)

    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug

    navigateToForm(tableSlug, "CREATE", null, {
      [startTimeStampSlug]: computedDate,
      [parentSlug]: parentValue,
    })
  }

  const navigateToEditPage = (el) => {
    navigateToForm(tableSlug, "EDIT", el, {
      [parentSlug]: parentValue,
    })
  }

  return (
    <div className={styles.objectColumn}>
      {timesList.map((time, index) => (
        <div
          key={time}
          className={`${styles.timeBlock} ${
            isDisabled(index) ? styles.disabled : ""
          }`}
          style={{ overflow: "auto" }}
        >
          <div
            className={`${styles.addButton}`}
            onClick={() => navigateToCreatePage(time)}
          >
            <Add color="" />
            Создат
          </div>
        </div>
      ))}

      {computedDataWithPosition?.map((el) => (
        <div
          key={el.guid}
          className={styles.infoBlockWrapper}
          style={{ top: el.startPosition }}
          onClick={() => navigateToEditPage(el)}
        >
          <div className={styles.infoBlock} style={{ height: el.height }}>
            {view?.view_fields?.map((field) => (
              <p key={field}>{getFieldLabel(el, field)}</p>
            ))}

            <p className={styles.time}>
              {format(el.calendarStartTime, "HH:mm")} -{" "}
              {format(el.calendarEndTime, "HH:mm")}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DataColumn
