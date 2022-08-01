import { get } from "@ngard/tiny-get"
import {
  add,
  differenceInDays,
  isValid,
  setHours,
  setMinutes,
  startOfWeek,
} from "date-fns"
import { endOfWeek, format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { getFieldLabel } from "../../../utils/getFieldLabel"
import { objectToArray } from "../../../utils/objectToArray"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import ViewTabSelector from "../components/ViewTypeSelector"
import DatesRow from "./DatesRow"
import MainFieldRow from "./MainFieldRow"
import ObjectColumn from "./ObjectColumn"
import styles from "./style.module.scss"
import TimesBlock from "./TimesBlock"

const CalendarView = ({
  view,
  tableSlug,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
}) => {
  const [filters, setFilters] = useState({})
  const [loader, setLoader] = useState(true)
  const [data, setData] = useState([])
  const { navigateToForm } = useTabRouter()

  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ])

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

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const getAllData = async () => {
    setLoader(true)
    try {
      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 10, ...filters },
      })

      setViews(data.views ?? [])
      setData(objectToArray(data.response ?? {}))
    } finally {
      setLoader(false)
    }
  }

  const navigateToCreatePage = (time, columnIndex, data) => {
    console.log("DATA ================>", view)
    if (!time || !dateFilters?.[0]) return
    const date = add(dateFilters[0], { days: columnIndex })

    const [hour, minute] = time?.split("-")?.[0]?.trim()?.split(":")

    const computedDate = setHours(setMinutes(date, minute), hour)

    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug
    
    let filters = {}

    if(view.main_field?.includes('#')) {
      const slug = view.main_field.split('#')?.[0]?.split('.')?.[0]
      filters = {
        [`${slug}_id`]: data?.[0]?.[[`${slug}_id`]]
      }
    }

    // console.log("STATE =====>", { [startTimeStampSlug]: computedDate, ...filters }, data)

    navigateToForm(tableSlug, "CREATE", null, { [startTimeStampSlug]: computedDate, ...filters })
  }

  // useDebouncedWatch(
  //   () => {
  //     getAllData()
  //   },
  //   [filters],
  //   500
  // )

  useEffect(() => {
    if (!dateFilters[0] || !dateFilters[1]) return
    getAllData()
  }, [dateFilters, filters])

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton />
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
        />
        <CRangePicker value={dateFilters} onChange={setDateFilters} />
        <FastFilter filters={filters} onChange={filterChangeHandler} />
      </FiltersBlock>

      {loader ? <PageFallback /> : <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <DatesRow data={computedData} />

            <MainFieldRow data={computedData} />

            <div className={styles.calendar}>
              <TimesBlock />

              {computedData?.map((el, columnIndex) => {
                if (!el.mainFields?.length)
                  return (
                    <ObjectColumn
                      key={el.date}
                      columnIndex={columnIndex}
                      dateFilters={dateFilters}
                      navigateToCreatePage={navigateToCreatePage}
                    />
                  )
                return el.mainFields.map((mainField) => (
                  <ObjectColumn
                    key={mainField.title}
                    data={mainField.data}
                    view={view}
                    columnIndex={columnIndex}
                    navigateToCreatePage={navigateToCreatePage}
                  />
                ))
              })}
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default CalendarView
