import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import FilterGenerator from "../components/FilterGenerator"
import FiltersBlock from "../../../components/FiltersBlock"
import ColumnsSelector from "../components/ColumnsSelector"
import TableCard from "../../../components/TableCard"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import { Delete } from "@mui/icons-material"
import { useEffect, useState } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { useDispatch } from "react-redux"
import { tableColumnActions } from "../../../store/tableColumn/tableColumn.slice"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import { pageToOffset } from "../../../utils/pageToOffset"
import useWatch from "../../../hooks/useWatch"
import DeleteWrapperModal from "../../../components/DeleteWrapperModal"
import useTabRouter from "../../../hooks/useTabRouter"
import ViewTabSelector from "../components/ViewTypeSelector"

const TableView = ({ computedColumns, tableSlug, setViews, isRelation, tableInfo, selectedTabIndex, setSelectedTabIndex }) => {
  const dispatch = useDispatch()
  const { navigateToForm } = useTabRouter()


  const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const getAllData = async () => {
    setTableLoader(true)
    try {
      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: pageToOffset(currentPage), limit: 10, ...filters },
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
    <>
      <FiltersBlock extra={<ColumnsSelector tableSlug={tableSlug} />} >
        <ViewTabSelector />
      </FiltersBlock>
      <TableCard>
        <CTable
          removableHeight={296}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
        >
          <CTableHead>
            <CTableRow>
            <CTableCell width={10}>№</CTableCell>
            {computedColumns.map((field, index) => (
              <CTableCell key={index}>
                <div className="table-filter-cell">
                  {field.label}
                  <FilterGenerator
                    field={field}
                    name={field.slug}
                    onChange={filterChangeHandler}
                    filters={filters}
                  />
                </div>
              </CTableCell>
            ))}
            <CTableCell></CTableCell>
            </CTableRow>
          </CTableHead>

          <CTableBody
            loader={tableLoader}
            columnsCount={computedColumns.length + 2}
            dataLength={tableData.length}
          >
            {tableData.map((row, rowIndex) => (
              <CTableRow
                key={row.guid}
                onClick={() => navigateToEditPage(row)}
              >
                <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
                {computedColumns.map((field) => (
                  <CTableCell key={field.id} className="text-nowrap">
                    <CellElementGenerator
                      field={field}
                      row={row}
                    />
                  </CTableCell>
                ))}

                <CTableCell buttonsCell >
                  <DeleteWrapperModal id={row.guid} onDelete={deleteHandler} >
                    <RectangleIconButton
                      color="error"
                      // onClick={() => deleteHandler(row.guid)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </>
  )
}

export default TableView
