import { Add } from "@mui/icons-material"
import { differenceInMinutes, format, setHours, setMinutes } from "date-fns"
import { useMemo } from "react"
import { getRelationFieldTableCellLabel, getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const DataColumn = ({ date, data, parentTab, fieldsMap, view }) => {

  const elements = useMemo(() => {
    if (!parentTab) return []

    return data?.filter((el) => el[parentTab.slug] === parentTab.value && el.date === format(date, 'dd.MM.yyyy'))
  }, [parentTab, data])

  const elementsWithPosition = useMemo(() => {
    const calendarStartedTime = setMinutes(setHours(date, 8), 0)

    return elements?.map((el) => {
      const startPosition =
        Math.floor(
          differenceInMinutes(el.elementFromTime, calendarStartedTime) / 30
        ) * 40

      const height =
        Math.ceil(
          differenceInMinutes(el.elementToTime, el.elementFromTime) / 30
        ) *
          40 -
        10

      return {
        ...el,
        startPosition,
        height,
      }
    })
  }, [date, elements])

  const viewFields = useMemo(() => {
    return view?.columns?.map(id => fieldsMap[id])?.filter(el => el)
  }, [fieldsMap, view])

  return (
    <div className={styles.objectColumn}>
      {timesList.map((time, index) => (
        <div
          key={time}
          className={styles.timeBlock}
          // className={`${styles.timeBlock} ${
          //   isDisabled(index) ? styles.disabled : ""
          // }`}
          style={{ overflow: "auto" }}
        >
          <div
            className={`${styles.addButton}`}
            // onClick={() => navigateToCreatePage(time)}
          >
            <Add color="" />
            Создат
          </div>
        </div>
      ))}

      {elementsWithPosition?.map((el) => (
        <div
          key={el.guid}
          className={styles.infoBlockWrapper}
          style={{ top: el.startPosition }}
          // onClick={() => navigateToEditPage(el)}
        >
          <div className={styles.infoBlock} style={{ height: el.height }}>

            {
              viewFields?.map(field => (
                <div  > <b>{field.label}: </b> { field.type === "LOOKUP" ? getRelationFieldTableCellLabel(field, el, field.table_slug) : el[field.slug] } </div>
              ))
            }

            <p className={styles.time}>
              {format(el.elementFromTime, "HH:mm")} -{" "}
              {format(el.elementToTime, "HH:mm")}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DataColumn
