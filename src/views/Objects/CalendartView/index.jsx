import { get } from "@ngard/tiny-get"
import { add, differenceInDays, parse } from "date-fns"
import { format } from "date-fns/esm"
import { useMemo, useState } from "react"
import FiltersBlock from "../../../components/FiltersBlock"
import DatesRow from "./DatesRow"
import MainFieldRow from "./MainFieldRow"
import ObjectColumn from "./ObjectColumn"
import styles from "./style.module.scss"
import TimesBlock from "./TimesBlock"

const CalendarView = ({ view, data }) => {
  const [startDate, setStartDate] = useState(
    parse("20.05.2022", "dd.MM.yyyy", new Date())
  )
  const [endDate, setEndDate] = useState(
    parse("28.05.2022", "dd.MM.yyyy", new Date())
  )

  const computedData = useMemo(() => {
    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug

    const differenceDays = differenceInDays(endDate, startDate)
    let result = {}

    for (let i = 0; i < differenceDays; i++) {
      const date = format(add(startDate, { days: i }), "dd.MM.yyyy")

      result[date] = {
        date,
        mainFields: {},
      }
    }

    data.forEach((el) => {
      const date = format(new Date(get(el, startTimeStampSlug)), "dd.MM.yyyy")
      const mainField = get(el, view.main_field)

      if (result[date]) {
        if (result[date]?.mainFields?.[mainField]?.data) {
          result[date][mainField].data.push(el)
        } else {
          result[date].mainFields[mainField] = {
            title: mainField,
            data: [el],
          }
        }
      }
    })

    result = Object.values(result)

    result.forEach((el) => {
      el.mainFields = Object.values(el.mainFields)
    })

    return result
  }, [data, view, startDate, endDate])

  return (
    <div>
      <FiltersBlock />

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <DatesRow data={computedData} />

            <MainFieldRow data={computedData} />

            <div className={styles.calendar}>
              <TimesBlock />

              {computedData?.map((el) => {
                if (!el.mainFields?.length)
                  return <ObjectColumn key={el.date} />
                return el.mainFields.map((mainField) => (
                  mainField.data.map(objectData => (
                    <ObjectColumn key={objectData.id} data={objectData}  />
                  ))
                ))
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
