import { useEffect, useState } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { useDispatch } from "react-redux"
import { tableColumnActions } from "../../../store/tableColumn/tableColumn.slice"
import { pageToOffset } from "../../../utils/pageToOffset"
import useWatch from "../../../hooks/useWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import DataTable from "../../../components/DataTable"
import { useParams } from "react-router-dom"

const TableView = ({
  computedColumns,
  setViews,
  filters,
  filterChangeHandler,
  groupField,
  group
}) => {
  const dispatch = useDispatch()
  const { navigateToForm } = useTabRouter()
  const {tableSlug} = useParams()

  const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  const getAllData = async () => {
    setTableLoader(true)
    try {
      let groupFieldName = ''

      if(groupField?.id?.includes('#')) groupFieldName = `${groupField.id.split('#')[0]}_id`
      if(groupField?.slug) groupFieldName = groupField?.slug

      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: pageToOffset(currentPage), limit: 10, ...filters, [groupFieldName]: group?.value},
      })

      setViews(data.views ?? [])
      setTableData(objectToArray(data.response ?? {}))
      setPageCount(isNaN(data?.count) ? 1 : Math.ceil(data.count / 10))
      dispatch(
        tableColumnActions.setList({
          tableSlug,
          columns: data.fields ?? [],
        })
      )
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
  
  return (
      <DataTable
        removableHeight={207}
        currentPage={currentPage}
        pagesCount={pageCount}
        onPaginationChange={setCurrentPage}
        loader={tableLoader}
        data={tableData}
        columns={computedColumns}
        filters={filters}
        filterChangeHandler={filterChangeHandler}
        onRowClick={navigateToEditPage}
        onDeleteClick={deleteHandler}
        tableSlug={tableSlug}
        tableStyle={{ borderRadius: 0, border: 'none', borderBottom: '1px solid #E5E9EB' }}
      />
  )
}

export default TableView
