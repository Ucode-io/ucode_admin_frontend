import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import Header from "../../components/Header"
import PageFallback from "../../components/PageFallback"
import constructorObjectService from "../../services/constructorObjectService"
import { objectToArray } from "../../utils/objectToArray"
import { tableColumnActions } from "../../store/tableColumn/tableColumn.slice"
import TableView from "./TableView"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Add, CalendarToday, TableChart } from "@mui/icons-material"
import TabButton from "../../components/Buttons/TabButton"
import CalendarView from "./CalendartView"
import useDebouncedWatch from "../../hooks/useDebouncedWatch"
import ViewCreateModal from "./TableView/ViewCreateModal"
import constructorViewService from "../../services/constructorViewService"

const ObjectsPage = ({ isRelation, tableSlug }) => {
  const params = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const tablesList = useSelector((state) => state.constructorTable.list)
  const columns = useSelector((state) => state.tableColumn.list)

  const [views, setViews] = useState([])
  const [loader, setLoader] = useState(true)
  const [tableLoader, setTableLoader] = useState(false)
  const [tableData, setTableData] = useState([])
  const [filters, setFilters] = useState({})
  const [viewCreateModalVisible, setViewCreateModalVisible] = useState(false)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

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

  const getAllData = async () => {
    setTableLoader(true)
    try {
      const getTableData = constructorObjectService.getList(computedTableSlug, {
        data: { offset: 0, limit: 100, ...filters },
      })

      const getViews = constructorViewService.getList({
        table_slug: computedTableSlug,
      })

      const [{ data }, { views = [] }] = await Promise.all([
        getTableData,
        getViews
      ])

      setViews(views)
      setTableData(objectToArray(data.response ?? {}))
      dispatch(
        tableColumnActions.setList({
          tableSlug: computedTableSlug,
          columns: data.fields ?? [],
        })
      )
    } finally {
      setTableLoader(false)
      setLoader(false)
    }
  }

  const navigateToCreatePage = () => {
    navigate(`${pathname}/create`)
  }

  const navigateToEditPage = (id) => {
    if (isRelation)
      navigate(`/object/${computedTableSlug}/${id}`, { state: filters })
    else navigate(`${pathname}/${id}`)
  }

  useDebouncedWatch(
    () => {
      getAllData()
    },
    [filters],
    500
  )

  useEffect(() => {
    getAllData()
  }, [computedTableSlug])


  if (loader) return <PageFallback />

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
              computedColumns={computedColumns}
              filterChangeHandler={filterChangeHandler}
              filters={filters}
              tableLoader={tableLoader}
              tableData={tableData}
              navigateToEditPage={navigateToEditPage}
              tableSlug={computedTableSlug}
            />
          </TabPanel>

          {!!views.length && (
            <TabPanel>
              <CalendarView view={views[0]} data={tableData} />
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
