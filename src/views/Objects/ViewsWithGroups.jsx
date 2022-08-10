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

const ViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap
}) => {
  const { tableSlug } = useParams()

  const [filters, setFilters] = useState({})
  const { navigateToForm } = useTabRouter()

  const [tabs, setTabs] = useState(null)
  const [loader, setLoader] = useState(true)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug)
  }


  const getTabsData = (groupField) => {
    
    setLoader(true)

    constructorObjectService.getList(groupField.table_slug, { data: {} })
      .then((res) => {
        setTabs(res?.data?.response?.map(el => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug
        })))
      }).finally(() => {
        setLoader(false)
      })
  }


  useEffect(() => {
    if(!view.group_fields?.length) {
      setLoader(false)
      return
    }
    const groupFieldId = view.group_fields[0]
    const groupField = fieldsMap[groupFieldId]

    if(groupField?.type === "PICK_LIST") {
      const tabs = groupField?.attributes?.options?.map(el => ({
        label: el,
        value: el,
        slug: groupField?.slug
      }))

      setTabs(tabs)
      setLoader(false)
    }
    
    if(groupField?.type === "LOOKUP" ) {
      getTabsData(groupField)
    }
  }, [view, fieldsMap])


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
        <FastFilter filters={filters} onChange={filterChangeHandler} view={view} fieldsMap={fieldsMap} />
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
                      filterChangeHandler={filterChangeHandler}
                      group={tab}
                      view={view}
                    />
                  ) : (
                    <TableView
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
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
                      filterChangeHandler={filterChangeHandler}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  ) : (
                    <TableView
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
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

export default ViewsWithGroups
