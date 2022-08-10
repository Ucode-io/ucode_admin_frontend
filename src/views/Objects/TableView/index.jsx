import { useEffect, useMemo, useState } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import useWatch from "../../../hooks/useWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import DataTable from "../../../components/DataTable"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useQuery } from "react-query"

const TableView = ({
  filterChangeHandler,
  tab,
  view,
  fieldsMap
}) => {
  const { navigateToForm } = useTabRouter()
  const {tableSlug} = useParams()
  const filters = useSelector((state) => state.filter.list[tableSlug]?.[view.id] ?? {})


  // const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  // const [pageCount, setPageCount] = useState(1)

  const columns = useMemo(() => {
    return view?.columns?.map(el => fieldsMap[el])
  }, [view, fieldsMap])

  const { data: { tableData, pageCount } = { tableData: [], pageCount: 1 } , refetch, isLoading: tableLoader } = useQuery({
    queryKey: ["GET_OBJECTS_LIST", { tableSlug, currentPage, limit: 10, filters: { ...filters, [tab?.slug]: tab?.value } }],
    queryFn: () => {
      return constructorObjectService.getList(tableSlug, {
        data: { offset: pageToOffset(currentPage), limit: 100, ...filters, [tab?.slug]: tab?.value },
      })
    },
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count) ? 1 : Math.ceil(res.data?.count / 10)
      }
    },
  })


  const deleteHandler = async (row) => {

    // setTableLoader(true)
    try {
      await constructorObjectService.delete(tableSlug, row.guid)
      refetch()
    } catch {
      // setTableLoader(false)
    }
  }

  const navigateToEditPage = (row) => {
    navigateToForm(tableSlug, "EDIT", row)
  }
  // useEffect(() => {
  //   getAllData()
  // }, [])
  
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
