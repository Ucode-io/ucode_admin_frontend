import { Download, Upload } from "@mui/icons-material"
import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns"
import { useMemo, useState } from "react"
import { useQueries, useQuery } from "react-query"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import useFilters from "../../../hooks/useFilters"
import constructorObjectService from "../../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import { listToMap } from "../../../utils/listToMap"
import { selectElementFromEndOfString } from "../../../utils/selectElementFromEnd"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import SettingsButton from "../components/ViewSettings/SettingsButton"
import ViewTabSelector from "../components/ViewTypeSelector"
import Gantt from "./Gantt"

const GanttView = ({ view, selectedTabIndex, setSelectedTabIndex, views }) => {
  const { tableSlug } = useParams()

  const {filters} = useFilters(tableSlug, view.id)

  const [dateFilters, setDateFilters] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ])
  const [fieldsMap, setFieldsMap] = useState({})

  const groupFieldIds = view.group_fields
  const groupFields = groupFieldIds
    .map((id) => fieldsMap[id])
    .filter((el) => el)

  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return []

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0])

    const result = []
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], { days: i }))
    }
    return result
  }, [dateFilters])

  console.log('aaaa =>', dateFilters, datesList)

  const { data: { data } = { data: [] }, isLoading } = useQuery(
    ["GET_OBJECTS_LIST_WITH_RELATIONS", { tableSlug, filters }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { with_relations: true, ...filters },
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

  const tabResponses = useQueries(queryGenerator(groupFields, filters))
  const tabs = tabResponses?.map((response) => response?.data)
  const tabLoading = tabResponses?.some((response) => response?.isLoading)

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton view={view} />
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
        />

        <CRangePicker interval={'months'} value={dateFilters} onChange={setDateFilters} />
        <FastFilter view={view} fieldsMap={fieldsMap} />
      </FiltersBlock>

      {isLoading || tabLoading ? (
        <PageFallback />
      ) : (
        <Gantt
          data={data}
          fieldsMap={fieldsMap}
          datesList={datesList}
          view={view}
          tabs={tabs}
          // workingDays={workingDays}
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
  console.log('groupField.relation_fields =>', groupField)

  Object.entries(filters)?.forEach(([key, value]) => {

    if (!key?.includes(".")) return

    if(key.split(".")?.pop() === groupField.slug) {
      relationFilters[key.split(".")?.pop()] = value
      return
    }

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    })

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop()

      relationFilters[slug] = value
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

  if (groupField?.type === "LOOKUP") {
    const queryFn = () =>
      constructorObjectService.getList(groupField.table_slug, {
        data: computedFilters ?? {},
      })

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.slug?.slice(0, -3), filters: computedFilters },
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

export default GanttView
