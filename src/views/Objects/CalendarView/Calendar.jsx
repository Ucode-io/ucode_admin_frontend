import { useState } from "react"
import { useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import constructorObjectService from "../../../services/constructorObjectService"
import { selectElementFromEndOfString } from "../../../utils/selectElementFromEnd"
import CalendarColumn from "./CalendarColumn"
import styles from "./style.module.scss"
import TimesColumn from "./TimesColumn"

const Calendar = ({ dateFilters, computedDates, data, view, filters }) => {
  const { tableSlug } = useParams()
  const groupColumns = useSelector(
    (state) => state.tableColumn.calendarGroupColumns[tableSlug] ?? []
  )
  
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState([])

  const fetchGroupObjects = async () => {
    try {
      setIsLoading(true)

      const computedFilters = {...filters}

      Object.keys(computedFilters).forEach(key => {
        if(!computedFilters[key]) delete computedFilters[key]
      })

      const requests = groupColumns.map(
        (column) => constructorObjectService.getList(column.table_slug, {
          data: computedFilters ?? {},
        }) 
      )
      
      const result = await Promise.all(requests)
      
      // console.log("RESULT ---->", result, filters, groupColumns)

      setResult(result)
      // const data = result[0]?.data?.response

      // const computed = data?.map((el) => ({
      //   ...el,
      //   child: recursiveFunction(el, 0, result),
      // }))

      // console.log("RESULt222 --->", computed)

      // setComputedData(computed)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(true)
    }
  }

  // const result = useQueries(
  //   groupColumns.map((column) => ({
  //     queryKey: ["GET_OBJECT_LIST_FOR_GROUP", column.table_slug, filters],
  //     queryFn: () =>
  //       constructorObjectService.getList(column.table_slug, {
  //         data: { ...filters, aaaa: "123" },
  //       }),
  //   }))
  // )

  useEffect(() => {
    fetchGroupObjects()
  }, [filters])

  // const isLoading = result?.some(el => el.isLoading)

  const recursiveFunction = (el, level) => {
    if (level === groupColumns?.length - 1) {
      const slug = groupColumns[level]?.slug

      return data?.filter((child) => child[slug] === el.guid)
    } else {
      const slug = selectElementFromEndOfString({
        string: groupColumns[level]?.slug,
        separator: ".",
      })

      const ddd = result[level + 1]?.data?.response

      return ddd
        ?.filter((child) => child[slug] === el.guid)
        ?.map((child) => ({
          ...child,
          child: recursiveFunction(child, level + 1),
        }))
    }
  }

  const computedData = useMemo(() => {
    if(!result) return []

    const data = result[0]?.data?.response

    const computed = data?.map((el) => ({
      ...el,
      child: recursiveFunction(el, 0)
    }))

    return computed
  }, [isLoading, result, data])


  return (
    <div className={styles.calendar}>
      <TimesColumn />

      {
        computedDates?.map((date) => (
          <CalendarColumn
            key={date}
            date={date}
            computedData={computedData}
            groupColumns={groupColumns}
            view={view}
          />
        ))}
    </div>
  )
}

export default Calendar
