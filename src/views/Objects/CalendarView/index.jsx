import { add, differenceInDays, endOfWeek, format, startOfWeek } from "date-fns"
import { useMemo, useState } from "react"
import { useQueries, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import useFilters from "../../../hooks/useFilters"
import constructorObjectService from "../../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import { listToMap } from "../../../utils/listToMap"
import { selectElementFromEndOfString } from "../../../utils/selectElementFromEnd"
import ExcelButtons from "../components/ExcelButtons"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import SettingsButton from "../components/ViewSettings/SettingsButton"
import ViewTabSelector from "../components/ViewTypeSelector"
import Calendar from "./Calendar"

const CalendarView = ({
  view,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
}) => {
  const { tableSlug } = useParams()
  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ])
  const [fieldsMap, setFieldsMap] = useState({})

  const { filters, dataFilters } = useFilters(tableSlug, view.id)

  const groupFieldIds = view.group_fields
  const groupFields = groupFieldIds
    .map((id) => fieldsMap[id])
    .filter((el) => el)

  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0])

    const result = []
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], { days: i }))
    }
    return result
  }, [dateFilters])

  const { data: { data } = { data: [] }, isLoading } = useQuery(
    ["GET_OBJECTS_LIST_WITH_RELATIONS", { tableSlug, dataFilters }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { with_relations: true, ...dataFilters },
      })
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? []
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? []
        const fieldsMap = listToMap([...fields, ...relationFields])
        const data = res.data?.response?.map((row) => ({
          ...row,
          calendar: {
            date: row[view.calendar_from_slug]
              ? format(new Date(row[view.calendar_from_slug]), "dd.MM.yyyy")
              : null,
            elementFromTime: row[view.calendar_from_slug]
              ? new Date(row[view.calendar_from_slug])
              : null,
            elementToTime: row[view.calendar_to_slug]
              ? new Date(row[view.calendar_to_slug])
              : null,
          },
        }))
        return {
          fieldsMap,
          data,
        }
      },
      onSuccess: (res) => {
        if (Object.keys(fieldsMap)?.length) return
        setFieldsMap(res.fieldsMap)
      },
    }
  )

  const { data: workingDays } = useQuery(
    ["GET_OBJECTS_LIST", view?.disable_dates?.table_slug],
    () => {
      if (!view?.disable_dates?.table_slug) return {}

      return constructorObjectService.getList(view?.disable_dates?.table_slug, {
        data: {},
      })
    },
    {
      select: (res) => {
        const result = {}

        res?.data?.response?.forEach((el) => {
          const date = el[view?.disable_dates?.day_slug]
          const calendarFromTime = el[view?.disable_dates?.time_from_slug]
          const calendarToTime = el[view?.disable_dates?.time_to_slug]

          if (date) {
            const formattedDate = format(new Date(date), "dd.MM.yyyy")

            if (!result[formattedDate]?.[0]) {
              result[formattedDate] = [
                {
                  ...el,
                  calendarFromTime,
                  calendarToTime,
                },
              ]
            } else {
              result[formattedDate].push({
                ...el,
                calendarFromTime,
                calendarToTime,
              })
            }
          }
        })

        return result
      },
    }
  )

  const tabResponses = useQueries(queryGenerator(groupFields, filters))
  const tabs = tabResponses?.map((response) => response?.data)
  const tabLoading = tabResponses?.some((response) => response?.isLoading)

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton view={view} />
            <ExcelButtons />

            <SettingsButton />
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />

        <CRangePicker value={dateFilters} onChange={setDateFilters} />
        <FastFilter view={view} fieldsMap={fieldsMap} />
      </FiltersBlock>

      {isLoading || tabLoading ? (
        <PageFallback />
      ) : (
        <Calendar
          data={data}
          fieldsMap={fieldsMap}
          datesList={datesList}
          view={view}
          tabs={tabs}
          workingDays={workingDays}
        />
      )}
    </div>
  )
}

// ========== UTILS==========

const queryGenerator = (groupFields, filters = {}) => {
  return groupFields?.map((field) => promiseGenerator(field, filters))
}

const promiseGenerator = (groupField, filters = {}) => {
  const filterValue = filters[groupField.slug]
  const defaultFilters = filterValue ? { [groupField.slug]: filterValue } : {}

  const relationFilters = {}

  Object.entries(filters)?.forEach(([key, value]) => {
    if (!key?.includes(".")) return

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    })

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop()

      relationFilters[slug] = value
    } else {
      const slug = key.split(".")?.pop()

      if (groupField.slug === slug) {
        relationFilters[slug] = value
      }
    }
  })
  const computedFilters = { ...defaultFilters, ...relationFilters }

  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () => ({
        id: groupField.id,
        list: groupField.attributes?.options?.map((el) => ({
          ...el,
          label: el,
          value: el,
          slug: groupField?.slug,
        })),
      }),
    }
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getList(
        groupField?.type === "LOOKUP"
          ? groupField.slug?.slice(0, -3)
          : groupField.slug?.slice(0, -4),
        {
          data: computedFilters ?? {},
        }
      )

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {
          tableSlug:
            groupField?.type === "LOOKUP"
              ? groupField.slug?.slice(0, -3)
              : groupField.slug?.slice(0, -4),
          filters: computedFilters,
        },
      ],
      queryFn,
      select: (res) => ({
        id: groupField.id,
        list: res.data?.response?.map((el) => ({
          ...el,
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
      }),
    }
  }
}

export default CalendarView
