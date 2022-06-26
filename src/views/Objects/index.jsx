import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import TableView from "./TableView"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import CalendarView from "./CalendartView"
import ViewCreateModal from "./TableView/ViewCreateModal"
import useTabRouter from "../../hooks/useTabRouter"
import { generateGUID } from "../../utils/generateID"
import Header from "../../components/Header"
import CreateButton from "../../components/Buttons/CreateButton"
import { CalendarToday, TableChart } from "@mui/icons-material"
import TreeView from "./TreeView"

const staticViews = [
  {
    id: generateGUID,
    type: "TABLE",
  },
]

const ObjectsPage = ({ isRelation, tableSlug }) => {
  const params = useParams()
  const { navigateToForm } = useTabRouter()

  const tablesList = useSelector((state) => state.constructorTable.list)
  const columns = useSelector((state) => state.tableColumn.list)

  const [views, setViews] = useState([])
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)



  const computedTableSlug = isRelation ? tableSlug : params.tableSlug

  const tableInfo = useMemo(() => {
    if (isRelation) return {}
    return tablesList.find((el) => el.slug === params.tableSlug)
  }, [tablesList, params.tableSlug, isRelation])

  const computedColumns = useMemo(() => {
    return (
      columns[computedTableSlug]?.filter((column) => column.isVisible) ?? []
    )
  }, [columns, computedTableSlug])

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
                    <TableView
                      tableSlug={computedTableSlug}
                      computedColumns={computedColumns}
                      isRelation={isRelation}
                      tableInfo={tableInfo}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={computedViews}
                      setViews={setViews}
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
