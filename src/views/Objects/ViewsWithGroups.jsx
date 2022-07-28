import { Download, FilterAlt, Upload } from "@mui/icons-material"
import { useMemo, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import CreateButton from "../../components/Buttons/CreateButton"
import FiltersBlockButton from "../../components/Buttons/FiltersBlockButton"
import RectangleIconButton from "../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../components/FiltersBlock"
import SearchInput from "../../components/SearchInput"
import TableCard from "../../components/TableCard"
import useTabRouter from "../../hooks/useTabRouter"
import ColumnsSelector from "./components/ColumnsSelector"
import GroupFieldSelector from "./components/GroupFieldSelector"
import ViewTabSelector from "./components/ViewTypeSelector"
import TableView from "./TableView"
import style from "./style.module.scss"
import { useEffect } from "react"
import constructorObjectService from "../../services/constructorObjectService"
import {
  getRelationFieldTabsLabel,
} from "../../utils/getRelationFieldLabel"
import { CircularProgress } from "@mui/material"
import TreeView from "./TreeView"
import FastFilter from "./components/FastFilter"

const ViewsWithGroups = ({
  tableSlug,
  views,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  computedColumns,
  groupField,
  view,
}) => {
  const [filters, setFilters] = useState({})
  const { navigateToForm } = useTabRouter()
  const [tabsData, setTabsData] = useState(null)
  const [loader, setLoader] = useState(false)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug)
  }

  const tabs = useMemo(() => {
    if (!groupField) return []
    if (groupField.type === "PICK_LIST") {
      return (
        groupField.attributes?.options?.map((el) => ({
          label: el,
          value: el,
        })) ?? []
      )
    }

    if (tabsData?.length) {
      return tabsData.map((el) => {
        const label = getRelationFieldTabsLabel(groupField, el)

        return {
          label: label,
          value: el.guid,
        }
      })
    }
  }, [groupField, tabsData])

  useEffect(() => {
    if (!groupField?.id?.includes("#")) return setTabsData(null)
    const tableSlug = groupField.id.split("#")?.[0]

    setLoader(true)

    constructorObjectService
      .getList(tableSlug, {
        data: { offset: 0, limit: 10 },
      })
      .then(({ data }) => setTabsData(data.response))
      .finally(() => setLoader(false))
  }, [groupField])

  return (
    <>
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
        <FastFilter filters={filters} onChange={filterChangeHandler} />
      </FiltersBlock>

      <Tabs direction={"ltr"} defaultIndex={0}>
        <TableCard cardStyles={{ paddingTop: 0 }} >
          <div className={style.tableCardHeader}>
            <TabList>
              {tabs?.map((tab) => (
                <Tab key={tab.value}>{tab.label}</Tab>
              ))}
            </TabList>
            <CreateButton onClick={navigateToCreatePage} />
          </div>

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
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                      groupField={groupField}
                      group={tab}
                      view={view}
                    />
                  ) : (
                    <TableView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                      groupField={groupField}
                      group={tab}
                    />
                  )}
                </TabPanel>
              ))}

              {!groupField && (
                <>
                  {view.type === "TREE" ? (
                    <TreeView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                      view={view}
                    />
                  ) : (
                    <TableView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
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
