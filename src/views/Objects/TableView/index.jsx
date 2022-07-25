import TableCard from "../../../components/TableCard"
import { useEffect, useState } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { useDispatch } from "react-redux"
import { tableColumnActions } from "../../../store/tableColumn/tableColumn.slice"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import { pageToOffset } from "../../../utils/pageToOffset"
import useWatch from "../../../hooks/useWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import CreateButton from "../../../components/Buttons/CreateButton"
import DataTable from "../../../components/DataTable"
import { Tab, TabList, Tabs } from "react-tabs"

const TableView = ({
  computedColumns,
  tableSlug,
  setViews,
  filters,
  filterChangeHandler,
  groupField,
  group
}) => {
  const dispatch = useDispatch()
  const { navigateToForm } = useTabRouter()

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
        data: { offset: pageToOffset(currentPage), limit: 10, ...filters, [groupFieldName]: group?.value },
      })

      const pageCount = Math.ceil(data.count / 10)

      setViews(data.views ?? [])
      setTableData(objectToArray(data.response ?? {}))
      setPageCount(isNaN(pageCount) ? 1 : pageCount)
      dispatch(
        tableColumnActions.setList({
          tableSlug: tableSlug,
          columns: data.fields ?? [],
        })
      )
    } finally {
      setTableLoader(false)
    }
  }

  const deleteHandler = async (id) => {
    setTableLoader(true)
    try {
      await constructorObjectService.delete(tableSlug, id)
      getAllData()
    } catch {
      setTableLoader(false)
    }
  }

  const navigateToEditPage = (row) => {
    navigateToForm(tableSlug, "EDIT", row)
  }

  useDebouncedWatch(
    () => {
      if (currentPage === 1) getAllData()
      setCurrentPage(1)
    },
    [filters],
    500
  )

  useWatch(() => {
    getAllData()
  }, [currentPage])

  useEffect(() => {
    getAllData()
  }, [])

  return (
      <DataTable
        removableHeight={230}
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
      />
  )
}

export default TableView
