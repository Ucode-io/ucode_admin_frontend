import { Download, Upload } from "@mui/icons-material"
import { add, differenceInDays, endOfWeek, format, startOfWeek } from "date-fns"
import { useEffect } from "react"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import CRangePicker from "../../../components/DatePickers/CRangePicker"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import constructorObjectService from "../../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import { listToMap } from "../../../utils/listToMap"
import { objectToArray } from "../../../utils/objectToArray"
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
  const [tabs, setTabs] = useState(null)
  const [loader, setLoader] = useState(false)

  const [filters, setFilters] = useState({})

  const { data: { data, fieldsMap } = { data: [], fieldsMap: [] }, isLoading } =
    useQuery(
      ["GET_OBJECTS_LIST_WITH_RELATIONS", { tableSlug, filters }],
      () => {
        return constructorObjectService.getList(tableSlug, {
          data: { with_relations: true, ...filters },
        })
      },
      {
        select: (res) => {
          const responseData = objectToArray(res.data.response ?? {})
          const fields = res.data?.fields ?? []
          const relationFields = res?.data?.relation_fields ?? []
          const fieldsMap = listToMap([...fields, ...relationFields])
          const data = responseData.map((row) => ({
            ...row,
            date: row[view.calendar_from_slug]
              ? format(new Date(row[view.calendar_from_slug]), "dd.MM.yyyy")
              : null,
            elementFromTime: row[view.calendar_from_slug]
              ? new Date(row[view.calendar_from_slug])
              : null,
            elementToTime: row[view.calendar_to_slug]
              ? new Date(row[view.calendar_to_slug])
              : null,
          }))

          return {
            data,
            fieldsMap,
          }
        },
      }
    )

  const getTabsData = async (groupFields) => {
    console.log('bbbbbb')
    setLoader(true)
    const promises = groupFields.map((field) => promiseGenerator(field))

    try {
      const tabsData = await Promise.all(promises)
      setTabs(tabsData)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    const groupFieldIds = view.group_fields
    const groupFields = groupFieldIds.map((id) => fieldsMap[id]).filter(el => el)

    if(!groupFields?.length) return

    getTabsData(groupFields)
  }, [view, fieldsMap])


  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0])

    const result = []
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], { days: i }))
    }
    return result
  }, [dateFilters])

  return (
    <div>
      <FiltersBlock
        extra={
          <>
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

        <CRangePicker value={dateFilters} onChange={setDateFilters} />
      </FiltersBlock>

      {isLoading ? (
        <PageFallback />
      ) : (
        <Calendar
          data={data}
          fieldsMap={fieldsMap}
          datesList={datesList}
          view={view}
          tabs={tabs}
        />
      )}
    </div>
  )
}

const promiseGenerator = (field) => {
  if (field?.type === "LOOKUP")
    return new Promise((resolve, reject) => {
      constructorObjectService
        .getList(field.slug?.slice(0, -3), { data: {} })
        .then((res) => {
          const data = {
            id: field.id,
            list: res.data?.response?.map((el) => ({
              ...el,
              label: getRelationFieldTabsLabel(field, el),
              value: el.guid,
              slug: field?.slug,
            })),
          }

          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })

  return new Promise((resolve) => {
    resolve({
      id: field.id,
      list: field.attributes?.options?.map((el) => ({
        label: el,
        value: el,
        slug: field?.slug,
      })),
    })
  })
}

export default CalendarView
