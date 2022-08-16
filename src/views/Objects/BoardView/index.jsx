import { Add, Download, FilterAlt, Upload } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useId } from "react"
import { useEffect } from "react"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { Container, Draggable } from "react-smooth-dnd"
import FiltersBlockButton from "../../../components/Buttons/FiltersBlockButton"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import SearchInput from "../../../components/SearchInput"
import useFilters from "../../../hooks/useFilters"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { applyDrag } from "../../../utils/applyDrag"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import ColumnsSelector from "../components/ColumnsSelector"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import GroupFieldSelector from "../components/GroupFieldSelector"
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
    }, {
      select: ({data}) => data.response ?? [],
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
        <FastFilter fieldsMap={fieldsMap} view={view} />
      </FiltersBlock>

      {loader ? (
        <PageFallback />
      ) : (
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

  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el,
          value: el,
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
