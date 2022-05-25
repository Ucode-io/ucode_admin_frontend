import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import FilterGenerator from "../components/FilterGenerator"
import { get } from "@ngard/tiny-get"
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
import { useLocation, useNavigate } from "react-router-dom"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import { pageToOffset } from "../../../utils/pageToOffset"

const TableView = ({ computedColumns, tableSlug, setViews, isRelation }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

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

  const navigateToEditPage = (id) => {
    if (isRelation) navigate(`/object/${tableSlug}/${id}`, { state: filters })
    else navigate(`${pathname}/${id}`)
  }

  useDebouncedWatch(
    () => {
      if(currentPage === 1) getAllData()
      setCurrentPage(1)
    },
    [filters],
    500
  )

  useEffect(() => {
    if(currentPage === 1) getAllData()
    setCurrentPage(1)
  }, [currentPage])

  return (
    <>
      <FiltersBlock extra={<ColumnsSelector tableSlug={tableSlug} />} />
      <TableCard>
        <CTable
          removableHeight={240}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
        >
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            {computedColumns.map((field, index) => (
              <CTableCell key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
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
            <CTableCell width={70}></CTableCell>
          </CTableHead>

          <CTableBody
            loader={tableLoader}
            columnsCount={computedColumns.length + 2}
            dataLength={tableData.length}
          >
            {tableData.map((row, rowIndex) => (
              <CTableRow
                key={row.guid}
                onClick={() => navigateToEditPage(row.guid)}
              >
                <CTableCell>{rowIndex + 1}</CTableCell>
                {computedColumns.map((field) => (
                  <CTableCell key={field.id} className="text-nowrap">
                    <CellElementGenerator
                      type={field.type}
                      value={get(row, field.slug, "")}
                    />
                  </CTableCell>
                ))}

                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteHandler(row.guid)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
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
