import { endOfWeek, startOfWeek } from "date-fns"
import { useState } from "react"
import { useQuery } from "react-query"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import ViewTabSelector from "../components/ViewTypeSelector"
import styles from "./style.module.scss"

const CalendarView = ({ view, tableSlug, setViews, selectedTabIndex, setSelectedTabIndex, views }) => {
  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ])

  const [filters, setFilters] = useState({})

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const { data = [] } = useQuery(['GET_OBJECT_LIST', tableSlug], () => {
    return constructorObjectService.getList(tableSlug, {
      data: { offset: 0, limit: 10, ...filters },
    })
  }, {
    select: (res) => {
      return objectToArray(res?.data?.response ?? {})
    }
  })

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

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.wrapper}>

            {/* <DatesRow data={computedData} /> */}


          </div>
        </div>
      </div>
      

    </div>
  )
}

export default CalendarView
