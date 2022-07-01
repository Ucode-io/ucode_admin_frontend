import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import useCashboxTabRouter from "../../../hooks/useCashboxTabRouter"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import useWatch from "../../../hooks/useWatch"
import constructorObjectService from "../../../services/constructorObjectService"
import { tableColumnActions } from "../../../store/tableColumn/tableColumn.slice"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import FilterGenerator from "../../Objects/components/FilterGenerator"

const CashboxAppointMentsTable = ({ tableSlug }) => {
  const { navigateToForm } = useCashboxTabRouter()
  const dispatch = useDispatch()

  const columns = useSelector((state) => state.tableColumn.list)

  const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  const computedColumns = useMemo(() => {
    return columns[tableSlug]?.filter((column) => column.isVisible) ?? []
  }, [columns, tableSlug])

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

      // setViews(data.views ?? [])
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
    navigateToForm(row.guid)
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
    <div className="pt-2" >
      <CTable
        removableHeight={250}
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
              <CTableRow key={row.guid} onClick={() => navigateToEditPage(row)}>
                <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
                {computedColumns.map((field) => (
                  <CTableCell key={field.id} className="text-nowrap">
                    <CellElementGenerator field={field} row={row} />
                  </CTableCell>
                ))}

                <CTableCell buttonsCell>
                  {/* <DeleteWrapperModal id={row.guid} onDelete={deleteHandler}>
                    <RectangleIconButton
                      color="error"
                      // onClick={() => deleteHandler(row.guid)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal> */}
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>


      </CTable>
    </div>
  )
}

export default CashboxAppointMentsTable
