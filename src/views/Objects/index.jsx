import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import TableView from "./TableView"
import { TabPanel, Tabs } from "react-tabs"
import CalendarView from "./CalendartView"
import { generateGUID } from "../../utils/generateID"
import TreeView from "./TreeView"
import ViewsWithGroups from "./ViewsWithGroups"

const staticViews = [
  {
    id: generateGUID,
    type: "TABLE",
  },
]

const ObjectsPage = ({ isRelation, tableSlug }) => {
  const params = useParams()

  const tablesList = useSelector((state) => state.constructorTable.list)

  const [views, setViews] = useState([])
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const computedTableSlug = isRelation ? tableSlug : params.tableSlug

  const columns = useSelector((state) => state.tableColumn.list[computedTableSlug] ?? [])
  const groupColumnId = useSelector(state => state.tableColumn.groupColumnIds[computedTableSlug])

  const tableInfo = useMemo(() => {
    if (isRelation) return {}
    return tablesList.find((el) => el.slug === params.tableSlug)
  }, [tablesList, params.tableSlug, isRelation])

  const computedColumns = useMemo(() => {
    return (
      columns?.filter((column) => column.isVisible) ?? []
    )
  }, [columns])

  const groupField = useMemo(() => {
    return columns.find(column => column.id === groupColumnId)
  }, [groupColumnId])
  
  const computedViews = useMemo(() => {
    return [...staticViews, ...views]
  }, [views])

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {/* {!isRelation && (
            <Header
              title={tableInfo?.label}
              extra={<CreateButton onClick={navigateToCreatePage} />}
            >
              <TabList>
                <Tab>
                  <TableChart /> Таблица
                </Tab>

                {views.map((view) => (
                  <Tab key={view.id} >
                  <CalendarToday /> Календарь
                </Tab>
                ))}
                
                <TabButton onClick={() => setViewCreateModalVisible(true)}>
                  <Add /> Вид
                </TabButton>
              </TabList>
            </Header>
          )} */}

          {/* <TabPanel>
            <TableView
              tableSlug={computedTableSlug}
              computedColumns={computedColumns}
              isRelation={isRelation}
              tableInfo={tableInfo}
              selectedTab={selectedTabIndex}
              setSelectedTab={setSelectedTabIndex}
              views={computedViews}
              setViews={setViews}
            />
          </TabPanel> */}

          {computedViews.map((view) => {
            switch (view.type) {
              case "CALENDAR":
                return (
                  <TabPanel key={view.id}>
                    <CalendarView
                      view={view}
                      tableSlug={computedTableSlug}
                      computedColumns={computedColumns}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={computedViews}
                    />
                  </TabPanel>
                )

                case "TREE":
                return (
                  <TabPanel key={view.id}>
                   <TreeView
                      tableSlug={computedTableSlug}
                      computedColumns={computedColumns}
                      isRelation={isRelation}
                      tableInfo={tableInfo}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={computedViews}
                      setViews={setViews}
                      view={view}
                    />
                  </TabPanel>
                )

              default:
                return (
                  <TabPanel key={view.id}>
                    <ViewsWithGroups
                      tableSlug={computedTableSlug}
                      computedColumns={computedColumns}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={computedViews}
                      setViews={setViews}
                      groupField={groupField}
                      view={view}
                    />
                  </TabPanel>
                )
            }
          })}
        </div>
      </Tabs>

     
    </>
  )
}

export default ObjectsPage
