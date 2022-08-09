import { Download, Upload } from "@mui/icons-material"
import { add, differenceInDays, endOfWeek, format, startOfWeek } from "date-fns"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useDispatch } from "react-redux"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import constructorObjectService from "../../../services/constructorObjectService"
import { tableColumnActions } from "../../../store/tableColumn/tableColumn.slice"
import { objectToArray } from "../../../utils/objectToArray"
import ColumnsSelector from "../components/ColumnsSelector"
import CalendarFastFilter from "../components/FastFilter/CalendarFastFilter.jsx"
import CalendarFastFilterButton from "../components/FastFilter/CalendarFastFilter.jsx/CalendarFastFilterButton"
import CalendarGroupFieldSelector from "../components/GroupFieldSelector/CalendarGroupFieldSelector"
import SettingsButton from "../components/ViewSettings/SettingsButton"
import ViewTabSelector from "../components/ViewTypeSelector"
import Calendar from "./Calendar"

const CalendarView = ({
  view,
  tableSlug,
  tableColumns,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  groupField,
  views,
}) => {
  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ])

  const dispatch = useDispatch()

  const [data, setData] = useState([])
  const [filters, setFilters] = useState({})

  const computedData = useMemo(() => {
    const startTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "start_timestamp"
    )?.field_slug
    const endTimeStampSlug = view.group_fields?.find(
      ({ field_type }) => field_type === "end_timestamp"
    )?.field_slug

    return data?.map((el) => ({
      ...el,
      calendarStartTime: el[startTimeStampSlug]
        ? new Date(el[startTimeStampSlug])
        : null,
      calendarEndTime: el[endTimeStampSlug]
        ? new Date(el[endTimeStampSlug])
        : null,
    }))
  }, [data, view])

  const { isLoading = true } = useQuery(
    ["GET_OBJECTS_LIST_WITH_RELATIONS", tableSlug, filters],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { with_relations: true, ...filters },
      })
    },
    {
      onSuccess: ({ data }) => {
        setViews(data.views ?? [])
        setData(objectToArray(data.response ?? {}))
        // dispatch(
        //   tableColumnActions.setList({
        //     tableSlug,
        //     columns: data.fields ?? [],
        //   })
        // )
        dispatch(
          tableColumnActions.setRelationColumns({
            tableSlug,
            columns: data.relation_fields ?? [],
          })
        )
      },
    }
  )

  const { data: workingDays } = useQuery(["GET_OBJECTS_LIST"], () => {
    if(!view?.disable_dates?.table_slug) return {}

    return constructorObjectService.getList(view?.disable_dates?.table_slug, { data: {} })
  }, {
    select: (res) => {
      const result = {}
    
      res?.data?.response?.forEach(el => {
        const date = el[view?.disable_dates?.day_slug]
        const calendarFromTime = el[view?.disable_dates?.time_from_slug]
        const calendarToTime = el[view?.disable_dates?.time_to_slug]

        if(date) {
          const formattedDate = format(new Date(date), 'dd.MM.yyyy')

          if(!result[formattedDate]?.[0]) {
            result[formattedDate] = [{
              ...el,
              calendarFromTime,
              calendarToTime
            }]
          } else {
            result[formattedDate].push({
              ...el,
              calendarFromTime,
              calendarToTime
            })
          }
        }
      })

      return result
    }
  })

  const computedDates = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return null

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0])

    const result = []
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], { days: i }))
    }
    return result
  }, [dateFilters])


  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <CalendarFastFilterButton />

            <CalendarGroupFieldSelector tableSlug={tableSlug} />

            <ColumnsSelector tableSlug={tableSlug} />

            <RectangleIconButton color="white">
              <Upload />
            </RectangleIconButton>
            <RectangleIconButton color="white">
              <Download />
            </RectangleIconButton>

            <SettingsButton />
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

        {/* <SearchInput /> */}
        <CalendarFastFilter filters={filters} onChange={filterChangeHandler} />
      </FiltersBlock>
        
      {isLoading && (
        <PageFallback />
      )}

      <Calendar dateFilters={dateFilters} computedDates={computedDates} data={computedData} view={view} filters={filters} workingDays={workingDays} />

    </div>
  )
}

export default CalendarView
