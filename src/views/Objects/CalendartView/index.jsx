import { get } from "@ngard/tiny-get"
import { add, differenceInDays, isValid, startOfWeek } from "date-fns"
import { endOfWeek, format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import constructorObjectService from "../../../services/constructorObjectService"
import { getFieldLabel } from "../../../utils/getFieldLabel"
import { objectToArray } from "../../../utils/objectToArray"
import ViewTabSelector from "../components/ViewTypeSelector"
import DatesRow from "./DatesRow"
import MainFieldRow from "./MainFieldRow"
import ObjectColumn from "./ObjectColumn"
import styles from "./style.module.scss"
import TimesBlock from "./TimesBlock"

const CalendarView = ({ view, tableSlug, setViews, selectedTabIndex, setSelectedTabIndex, views }) => {
  const [filters, setFilters] = useState({})
  const [loader, setLoader] = useState(true)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ])
  const [data, setData] = useState([])

  const computedData = useMemo(() => {
    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug
    const endTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "end_timestamp"
    )?.field_slug

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0])
    let result = {}

    for (let i = 0; i < differenceDays; i++) {
      const date = format(add(dateFilters[0], { days: i }), "dd.MM.yyyy")

      result[date] = {
        date,
        mainFields: {},
      }
    }

    data.forEach((el) => {
      const date =
        isValid(new Date(get(el, startTimeStampSlug))) &&
        format(new Date(get(el, startTimeStampSlug)), "dd.MM.yyyy")
      const startTime =
        isValid(new Date(get(el, startTimeStampSlug))) &&
        new Date(get(el, startTimeStampSlug))
      const endTime =
        isValid(new Date(get(el, endTimeStampSlug))) &&
        new Date(get(el, endTimeStampSlug))

      const mainField = getFieldLabel(el, view.main_field)

      const computedEl = {
        ...el,
        startTime,
        endTime,
      }

      if (result[date]) {
        if (result[date]?.mainFields?.[mainField]?.data?.length) {
          result[date].mainFields[mainField].data.push(computedEl)
        } else {
          result[date].mainFields[mainField] = {
            title: mainField,
            data: [computedEl],
          }
        }
      }
    })

    result = Object.values(result)

    result.forEach((el) => {
      el.mainFields = Object.values(el.mainFields)
    })

    return result
  }, [data, view, dateFilters])

  useDebouncedWatch(
    () => {
      getAllData()
    },
    [filters],
    500
  )

  useEffect(() => {
    if (!dateFilters[0] || !dateFilters[1]) return
    getAllData()
  }, [dateFilters])

  const getAllData = async () => {
    setLoader(true)
    try {
      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 10, ...filters },
      })

      setViews(data.views ?? [])
      setData(objectToArray(data.response ?? {}))

      // dispatch(
      //   tableColumnActions.setList({
      //     tableSlug: tableSlug,
      //     columns: data.fields ?? [],
      //   })
      // )
    } finally {
      setLoader(false)
      // setLoader(false)
    }
  }

  return (
    <div>
      <FiltersBlock>
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
        />
        <CRangePicker value={dateFilters} onChange={setDateFilters} />
      </FiltersBlock>

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
                  <ObjectColumn
                    key={mainField.title}
                    data={mainField.data}
                    view={view}
                  />
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
