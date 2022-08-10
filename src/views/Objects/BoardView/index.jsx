import { Add, Download, FilterAlt, Upload } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useId } from "react"
import { useEffect } from "react"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { Container, Draggable } from "react-smooth-dnd"
import FiltersBlockButton from "../../../components/Buttons/FiltersBlockButton"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import SearchInput from "../../../components/SearchInput"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { applyDrag } from "../../../utils/applyDrag"
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import ColumnsSelector from "../components/ColumnsSelector"
import FastFilter from "../components/FastFilter"
import FastFilterButton from "../components/FastFilter/FastFilterButton"
import GroupFieldSelector from "../components/GroupFieldSelector"
import SettingsButton from "../components/SettingsButton"
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
  const id = useId()
  const [columns, setColumns] = useState([])
  const { navigateToForm } = useTabRouter()
  const [filters, setFilters] = useState({})
  

  const { data, isLoading } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug, id, filters: {} }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {},
      })
    }
  )

  console.log("ISLOADING ===>", isLoading)

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

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug)
  }

  useEffect(() => {
    if (!groupField) return 
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

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton  />

            <GroupFieldSelector tableSlug={tableSlug} />

            <ColumnsSelector tableSlug={tableSlug}  />

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
        {/* <SearchInput /> */}
        <FastFilter filters={filters} onChange={filterChangeHandler} />
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

export default BoardView
