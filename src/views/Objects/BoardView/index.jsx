import { Download, Upload } from "@mui/icons-material"
import { useId } from "react"
import { useState } from "react"
import { useQuery } from "react-query"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Container, Draggable } from "react-smooth-dnd"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import useFilters from "../../../hooks/useFilters"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { applyDrag } from "../../../utils/applyDrag"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import ExcelButtons from "../components/ExcelButtons"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import SettingsButton from "../components/ViewSettings/SettingsButton"
import ViewTabSelector from "../components/ViewTypeSelector"
import BoardColumn from "./BoardColumn"
import styles from "./style.module.scss"

const BoardView = ({
  view,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  fieldsMap,
}) => {
  const { tableSlug } = useParams()
  const { new_list } = useSelector((state) => state.filter)
  const id = useId()

  const [columns, setColumns] = useState([])
  const { navigateToForm } = useTabRouter()
  const { filters } = useFilters(tableSlug, view.id)

  const { data = [], isLoading: dataLoader } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug, id, filters }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: filters ?? {},
      })
    },
    {
      select: ({ data }) => data.response ?? [],
    }
  )

  const groupFieldId = view?.group_fields?.[0]
  const groupField = fieldsMap[groupFieldId]
  const { data: tabs, isLoading: tabsLoader } = useQuery(
    queryGenerator(groupField, filters)
  )

  const loader = dataLoader || tabsLoader

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug)
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult)
    if (result) setColumns(result)
  }

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
          setViews={setViews}
        />
      </FiltersBlock>

      <div className="title" style={{ padding: '10px', background: '#fff', borderBottom: '1px solid #E5E9EB', marginBottom: '10px' }}>
        <h3>{view.table_label}</h3>
      </div>

      {/* <FastFilter fieldsMap={fieldsMap} view={view} /> */}
      {loader ? (
        <PageFallback />
      ) : (
        <div className={styles.wrapper}>
          {(view?.quick_filters?.length > 0 ||
            (new_list[tableSlug] &&
              new_list[tableSlug].some((i) => i.checked))) && (
            <div className={styles.filters}>
              <p>Фильтры</p>
              <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
            </div>
          )}

          <div className={styles.board}>
            <Container
              lockAxis="x"
              onDrop={onDrop}
              orientation="horizontal"
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
              style={{ display: "flex", gap: 24 }}
            >
              {tabs?.map((tab) => (
                <Draggable key={tab.value}>
                  <BoardColumn
                    key={tab.value}
                    tab={tab}
                    data={data}
                    fieldsMap={fieldsMap}
                    view={view}
                    navigateToCreatePage={navigateToCreatePage}
                  />
                </Draggable>
              ))}
            </Container>
          </div>
        </div>
      )}
    </div>
  )
}

const queryGenerator = (groupField, filters = {}) => {
  if (!groupField)
    return {
      queryFn: () => {},
    }

  const filterValue = filters[groupField.slug]
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {}

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el.label,
          value: el.value,
          slug: groupField?.slug,
        })),
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
        { tableSlug: groupField.table_slug, filters: computedFilters },
      ],
      queryFn,
      select: (res) =>
        res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
    }
  }
}

export default BoardView
