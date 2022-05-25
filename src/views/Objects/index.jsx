import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import Header from "../../components/Header"
import TableView from "./TableView"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Add, CalendarToday, TableChart } from "@mui/icons-material"
import TabButton from "../../components/Buttons/TabButton"
import CalendarView from "./CalendartView"
import ViewCreateModal from "./TableView/ViewCreateModal"

const ObjectsPage = ({ isRelation, tableSlug }) => {
  
  const params = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const tablesList = useSelector((state) => state.constructorTable.list)
  const columns = useSelector((state) => state.tableColumn.list)

  const [views, setViews] = useState([])
  const [viewCreateModalVisible, setViewCreateModalVisible] = useState(false)

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

  const navigateToCreatePage = () => {
    navigate(`${pathname}/create`)
  }
  
  // if(loader) return <PageFallback />

  return (
    <>
      <Tabs direction={"ltr"}>
        <div>
          {!isRelation && (
            <Header
              title={tableInfo?.label}
              extra={<CreateButton onClick={navigateToCreatePage} />}
            >
              <TabList>
                <Tab>
                  <TableChart /> Таблица
                </Tab>

                {!!views.length && (
                  <Tab>
                    <CalendarToday /> Календарь
                  </Tab>
                )}

                <TabButton onClick={() => setViewCreateModalVisible(true)}>
                  <Add /> Вид
                </TabButton>
              </TabList>
            </Header>
          )}

          <TabPanel>
            <TableView
              tableSlug={computedTableSlug}
              computedColumns={computedColumns}
              setViews={setViews}
              isRelation={isRelation}
            />
          </TabPanel>

          {!!views.length && (
            <TabPanel>
              <CalendarView
                view={views[0]}
                tableSlug={computedTableSlug}
                computedColumns={computedColumns}
                setViews={setViews}
              />
            </TabPanel>
          )}
        </div>
      </Tabs>

      {viewCreateModalVisible && (
        <ViewCreateModal
          fields={computedColumns}
          closeModal={() => setViewCreateModalVisible(false)}
        />
      )}
    </>
  )
}

export default ObjectsPage
