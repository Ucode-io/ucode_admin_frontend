import { useEffect, useMemo, useState } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import useWatch from "../../../hooks/useWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import DataTable from "../../../components/DataTable"
import { useParams } from "react-router-dom"

const TableView = ({
  filters,
  filterChangeHandler,
  tab,
  view,
  fieldsMap
}) => {
  const { navigateToForm } = useTabRouter()
  const {tableSlug} = useParams()

  const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  const columns = useMemo(() => {
    return view?.columns?.map(el => fieldsMap[el])
  }, [view, fieldsMap])

  const getAllData = async () => {
    setTableLoader(true)
    try {

      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: pageToOffset(currentPage), limit: 10, [tab?.slug]: tab?.value, ...filters},
      })

      setTableData(objectToArray(data.response ?? {}))
      setPageCount(isNaN(data?.count) ? 1 : Math.ceil(data.count / 10))
    } finally {
      setTableLoader(false)
    }
  }

  const deleteHandler = async (row) => {

    setTableLoader(true)
    try {
      await constructorObjectService.delete(tableSlug, row.guid)
      getAllData()
    } catch {
      setTableLoader(false)
    }
  }

  const navigateToEditPage = (row) => {
    navigateToForm(tableSlug, "EDIT", row)
  }

  useWatch(() => {
    if (currentPage === 1) getAllData()
    setCurrentPage(1)
  },
  [filters])

  useWatch(() => {
    getAllData()
  }, [currentPage])

  useEffect(() => {
    getAllData()
  }, [])

  console.log('view -->', view, columns)
  
  return (
      <DataTable
        removableHeight={207}
        currentPage={currentPage}
        pagesCount={pageCount}
        columns={columns}
        onPaginationChange={setCurrentPage}
        loader={tableLoader}
        data={tableData}
        filters={filters}
        filterChangeHandler={filterChangeHandler}
        onRowClick={navigateToEditPage}
        onDeleteClick={deleteHandler}
        tableSlug={tableSlug}
        tableStyle={{ borderRadius: 0, border: 'none', borderBottom: '1px solid #E5E9EB' }}
        isResizeble={true}
      />
  )
}

export default TableView
