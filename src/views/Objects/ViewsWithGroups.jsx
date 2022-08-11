import { Download, Upload } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import CreateButton from "../../components/Buttons/CreateButton"
import RectangleIconButton from "../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../components/FiltersBlock"
import TableCard from "../../components/TableCard"
import useTabRouter from "../../hooks/useTabRouter"
import ViewTabSelector from "./components/ViewTypeSelector"
import TableView from "./TableView"
import style from "./style.module.scss"
import TreeView from "./TreeView"
import FastFilter from "./components/FastFilter"
import SettingsButton from "./components/ViewSettings/SettingsButton"
import { useParams } from "react-router-dom"
import constructorObjectService from "../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel"
import { CircularProgress } from "@mui/material"
import { useQuery } from "react-query"
import { useSelector } from "react-redux"

const ViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap
}) => {
  const { tableSlug } = useParams()
  const filters = useSelector((state) => state.filter.list[tableSlug]?.[view.id] ?? {})

  const { navigateToForm } = useTabRouter()

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug)
  }

  
  const groupFieldId = view?.group_fields?.[0]
  const groupField = fieldsMap[groupFieldId]

  const { data: tabs, isLoading: loader } = useQuery(queryGenerator(groupField, filters))

  console.log('tableLoader || deleteLoader', loader)


  return (
    <>
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
        <FastFilter view={view} fieldsMap={fieldsMap} />
      </FiltersBlock>

      <Tabs direction={"ltr"} defaultIndex={0}>
        <TableCard type="withoutPadding">
          <div className={style.tableCardHeader}>
            <TabList>
              {tabs?.map((tab) => (
                <Tab key={tab.value}>{tab.label}</Tab>
              ))}
            </TabList>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CreateButton type="secondary" onClick={navigateToCreatePage} />
            </div>
          </div>

          {/* <>
            {view.type === "TREE" ? (
              <TreeView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
                view={view}
              />
            ) : (
              <TableView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
              />
            )}
          </> */}

          {loader ? (
            <div className={style.loader}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {tabs?.map((tab) => (
                <TabPanel key={tab.value}>
                  {view.type === "TREE" ? (
                    <TreeView
                      filters={filters}
                      group={tab}
                      view={view}
                    />
                  ) : (
                    <TableView
                      filters={filters}
                      tab={tab}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  )}
                </TabPanel>
              ))}

              {!tabs?.length && (
                <>
                  {view.type === "TREE" ? (
                    <TreeView
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  ) : (
                    <TableView
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  )}
                </>
              )}
            </>
          )}
        </TableCard>
      </Tabs>
    </>
  )
}


const queryGenerator = (groupField, filters = {}) => {

  if(!groupField) return {
    queryFn: () => {}
  }

  const filterValue = filters[groupField.slug]
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {}
  
  if(groupField?.type === "PICK_LIST") {
    return {
      queryKey: ['GET_GROUP_OPTIONS', groupField.id],
      queryFn: () => groupField?.attributes?.options?.map(el => ({
        label: el,
        value: el,
        slug: groupField?.slug
      }))
    }
  }

  if(groupField?.type === "LOOKUP") {
    const queryFn = () => constructorObjectService.getList(groupField.table_slug, { data: computedFilters ?? {} })

    return {
      queryKey: ["GET_OBJECT_LIST_ALL", { tableSlug: groupField.table_slug, filters: computedFilters }],
      queryFn,
      select: res => res?.data?.response?.map(el => ({
        label: getRelationFieldTabsLabel(groupField, el),
        value: el.guid,
        slug: groupField?.slug
      }))
    }
  }

}

export default ViewsWithGroups
