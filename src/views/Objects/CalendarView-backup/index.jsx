import { add, differenceInDays, format, parse, setHours, setMinutes } from "date-fns"
import el from "date-fns/esm/locale/el/index.js"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import PageFallback from "../../../components/PageFallback"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import DatesRow from "./DatesRow"
import ObjectColumn from "./ObjectColumn"
import styles from "./style.module.scss"
import TimesBlock from "./TimesBlock"

const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

const CalendarView = ({
  computedColumns,
  setViews,
  filters,
  filterChangeHandler,
  groupField,
  group,
  view,
  dateFilters,
}) => {
  const { tableSlug } = useParams()

  const [tableLoader, setTableLoader] = useState(true)
  const [data, setData] = useState([])
  const { navigateToForm } = useTabRouter()

  // ======= Computed values ========

  const computedDates = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return null

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0])

    const result = []
    for (let i = 0; i <= differenceDays; i++) {
      result.push(format(add(dateFilters[0], { days: i }), "dd.MM.yyyy"))
    }
    return result
  }, [dateFilters])

  const computedData = useMemo(() => {
    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug
    const endTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "end_timestamp"
    )?.field_slug

    return computedDates?.map((date) => ({
      date,
      data: data
        .filter((el) => {
          return (
            el[startTimeStampSlug] &&
            format(new Date(el[startTimeStampSlug]), "dd.MM.yyyy") === date
          )
        })
        .map((el) => ({
          ...el,
          calendarStartTime: el[startTimeStampSlug]
            ? new Date(el[startTimeStampSlug])
            : null,
          calendarEndTime: el[endTimeStampSlug]
            ? new Date(el[endTimeStampSlug])
            : null,
        })),
    }))
  }, [data, computedDates])

  const { data: disableDatesTable } = useQuery(["GET_OBJECTS_LIST"], () => {
    if(!view?.disable_dates?.table_slug) return {}
    
    let groupFieldName = ""

    if (groupField?.id?.includes("#"))
      groupFieldName = `${groupField.id.split("#")[0]}_id`
    if (groupField?.slug) groupFieldName = groupField?.slug

    if(!groupFieldName) return {}

    return constructorObjectService.getList(view?.disable_dates?.table_slug, {
      data: { [groupFieldName]: group?.value },
    })
  }, {
    select: (res) => {
      const result = {}

      res?.data?.response?.forEach(el => {
        const weekIndex = weekDays.indexOf(el[view?.disable_dates?.day_slug])
        const calendarFromTime = el[view?.disable_dates?.time_from_slug]
        const calendarToTime = el[view?.disable_dates?.time_to_slug]

        if(weekIndex !== -1) {
          result[weekIndex] = {
            ...el,
            calendarFromTime,
            calendarToTime
          }
        }
      })

      return result
    }
  })

  const getAllData = async () => {
    setTableLoader(true)
    try {
      let groupFieldName = ""

      if (groupField?.id?.includes("#"))
        groupFieldName = `${groupField.id.split("#")[0]}_id`
      if (groupField?.slug) groupFieldName = groupField?.slug

      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { ...filters, [groupFieldName]: group?.value },
      })

      setViews(data.views ?? [])
      setData(objectToArray(data.response ?? {}))
    } finally {
      setTableLoader(false)
    }
  }

  const navigateToCreatePage = (date, time) => {
    if (!time || !date) return
    const columnDate = parse(date, 'dd.MM.yyyy', new Date())

    const [hour, minute] = time?.split("-")?.[0]?.trim()?.split(":")

    const computedDate = setHours(setMinutes(columnDate, minute), hour)


    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug

    let groupFieldName = ""

      if (groupField?.id?.includes("#"))
        groupFieldName = `${groupField.id.split("#")[0]}_id`
      if (groupField?.slug) groupFieldName = groupField?.slug

    navigateToForm(tableSlug, "CREATE", null, { [startTimeStampSlug]: computedDate, [groupFieldName]: group?.value })
  }

  useEffect(() => {
    getAllData()
  }, [filters, groupField])

  if(tableLoader) return <PageFallback />

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.wrapper}>
          <DatesRow computedDates={computedDates} />

          <div className={styles.calendar}>
            <TimesBlock />

            {computedData?.map((column, columnIndex) => (
              <ObjectColumn
                key={column.date}
                column={column}
                view={view}
                columnIndex={columnIndex}
                disableDatesTable={disableDatesTable}
                navigateToCreatePage={navigateToCreatePage}
                hasDisabledDates={!!view?.disable_dates?.table_slug}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
