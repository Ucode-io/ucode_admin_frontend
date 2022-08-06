
import { Add } from "@mui/icons-material"
import { differenceInMinutes, format, parse, setHours, setMinutes } from "date-fns"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import useTabRouter from "../../../hooks/useTabRouter"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const MockColumn = ({groupColumns, level, workingDays, date, view}) => {

  const parentSlug = groupColumns?.[level]?.slug
  const parentValue = groupColumns?.[level]?.guid

  const { navigateToForm } = useTabRouter()
  const {tableSlug} = useParams()

  const disabledTimes = useMemo(() => {
    if(!workingDays) return null
    const workingDay = workingDays[format(date, 'dd.MM.yyyy')]

  

    const filteredWorkingDay = workingDay?.find(el => el[parentSlug] === parentValue)
    const calendarStartedTime = setMinutes(setHours(date, 8), 0)

    const startTime = parse(filteredWorkingDay?.calendarFromTime, 'HH:mm', date) 
    const endTime = parse(filteredWorkingDay?.calendarToTime, 'HH:mm', date)

    const startIndex = Math.ceil(differenceInMinutes(startTime, calendarStartedTime) / 30)
    const endIndex = Math.floor(differenceInMinutes(endTime, calendarStartedTime) / 30) - 1

    if(isNaN(startIndex) || isNaN(endIndex)) return null
    
    return {
      startIndex,
      endIndex
    }
  }, [workingDays, date, groupColumns, level])


  const isDisabled = (index) => {
    if(!view?.disable_dates?.day_slug) return false
    if(!disabledTimes?.startIndex || !disabledTimes?.endIndex) return true
    return index < disabledTimes?.startIndex || index > disabledTimes?.endIndex
  }

  const navigateToCreatePage = (time) => {
    const [hour, minute] = time?.split("-")?.[0]?.trim()?.split(":")

    const computedDate = setHours(setMinutes(date, minute), hour)

    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug

    navigateToForm(tableSlug, "CREATE", null, { [startTimeStampSlug]: computedDate, [parentSlug]: parentValue })
  }

  return timesList.map((time, index) => (
    <div
      key={time}
      className={`${styles.timeBlock} ${isDisabled(index) ? styles.disabled : ''}`}
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
  ))
}

export default MockColumn
