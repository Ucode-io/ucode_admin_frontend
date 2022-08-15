import { useMemo, useState } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { pageToOffset } from "../../../utils/pageToOffset"
import useTabRouter from "../../../hooks/useTabRouter"
import DataTable from "../../../components/DataTable"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import useFilters from "../../../hooks/useFilters"

const TableView = ({
  tab,
  view,
  fieldsMap
}) => {
  const { navigateToForm } = useTabRouter()
  const {tableSlug} = useParams()
  
  const { filters, filterChangeHandler } = useFilters(tableSlug, view.id)

  console.log("FILTERSsss -->", filters)

  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoader, setDeleteLoader] = useState(false)

  const columns = useMemo(() => {
    return view?.columns?.map(el => fieldsMap[el])?.filter(el => el)
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

    setDeleteLoader(true)
    try {
      await constructorObjectService.delete(tableSlug, row.guid)
      refetch()
    } finally {
      setDeleteLoader(false)
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
        loader={tableLoader || deleteLoader}
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
