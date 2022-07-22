import { Add, Download, FilterAlt, Upload } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useEffect } from "react"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { Container, Draggable } from "react-smooth-dnd"
import FiltersBlockButton from "../../../components/Buttons/FiltersBlockButton"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import SearchInput from "../../../components/SearchInput"
import constructorObjectService from "../../../services/constructorObjectService"
import { applyDrag } from "../../../utils/applyDrag"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import ColumnsSelector from "../components/ColumnsSelector"
import GroupFieldSelector from "../components/GroupFieldSelector"
import ViewTabSelector from "../components/ViewTypeSelector"
import BoardColumn from "./BoardColumn"
import styles from "./style.module.scss"

const BoardView = ({
  tableSlug,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  setViews,
  groupField,
  tableColumns,
}) => {
  const [columns, setColumns] = useState([])

  const { data, isLoading } = useQuery(
    ["GET_OBJECT_LIST_ALL", tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {},
      })
    }
  )

  const { data: columnsData, isLoading: groupFieldIsLoading } = useQuery(
    ["GET_OBJECT_LIST_FOR_COLUMNS", groupField],
    () => {
      if (!groupField?.id?.includes("#")) return null
      const computedTableSlug = groupField.id.split("#")?.[0]
      return constructorObjectService.getList(computedTableSlug, {
        data: {},
      })
    }
  )

  const groupFieldName = useMemo(() => {
    if (groupField?.id?.includes("#"))
      return `${groupField.id.split("#")[0]}_id`
    if (groupField?.slug) return groupField?.slug

    return ""
  }, [groupField])

  useEffect(() => {
    if (!groupField) return []
    if (groupField.type === "PICK_LIST") {
      setColumns(
        groupField.attributes?.options?.map((el) => ({
          label: el,
          value: el,
        })) ?? []
      )
    }

    const data = columnsData?.data?.response

    if (data?.length) {
      setColumns(
        data.map((el) => {
          const label = getRelationFieldTabsLabel(groupField, el)

          return {
            label: label,
            value: el.guid,
          }
        })
      )
    }
  }, [columnsData, groupField])

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult)

    if (result) setColumns(result)
  }

  console.log('columns ==>', columns, columnsData)

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <GroupFieldSelector tableSlug={tableSlug} />

            <ColumnsSelector tableSlug={tableSlug} />

            <RectangleIconButton color="grey">
              <Upload color="primary" />
            </RectangleIconButton>
            <RectangleIconButton color="grey">
              <Download color="primary" />
            </RectangleIconButton>
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
        />
        <SearchInput />
        <FiltersBlockButton>
          <FilterAlt color="primary" />
          Быстрый фильтр
        </FiltersBlockButton>
      </FiltersBlock>

      {isLoading || groupFieldIsLoading ? (
        <PageFallback />
      ) : (
        <div className={styles.board}>
          <Container
            lockAxis="x"
            orientation="horizontal"
            onDrop={onDrop}
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
            {columns?.map((column) => (
              <Draggable key={column.value}>
                <BoardColumn
                  key={column.value}
                  column={column}
                  data={data?.data?.response}
                  groupFieldName={groupFieldName}
                  tableColumns={tableColumns}
                  tableSlug={tableSlug}
                />
              </Draggable>
            ))}
          </Container>
        </div>
      )}
    </div>
  )
}

export default BoardView
