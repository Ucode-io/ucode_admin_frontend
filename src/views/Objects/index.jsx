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
import useTabRouter from "../../hooks/useTabRouter"

const ObjectsPage = ({ isRelation, tableSlug }) => {
  const params = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { navigateToForm } = useTabRouter()

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
    navigateToForm(tableSlug)
  }
  
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
          )}

          <TabPanel>
            <TableView
              tableSlug={computedTableSlug}
              computedColumns={computedColumns}
              setViews={setViews}
              isRelation={isRelation}
              tableInfo={tableInfo}
            />
          </TabPanel>

          {views.map((view) => (
            <TabPanel key={view.id}>
              <CalendarView
                view={view}
                tableSlug={computedTableSlug}
                computedColumns={computedColumns}
                setViews={setViews}
              />
            </TabPanel>
          ))}
        </div>
      </Tabs>

      {viewCreateModalVisible && (
        <ViewCreateModal
          fields={columns[computedTableSlug]}
          closeModal={() => setViewCreateModalVisible(false)}
          setViews={setViews}
          tableSlug={computedTableSlug}
        />
      )}
    </>
  )
}

export default ObjectsPage
