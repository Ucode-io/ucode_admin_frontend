import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable"
import CellElementGenerator from "../../components/ElementGenerators/CellElementGenerator"
import Header from "../../components/Header"
import PageFallback from "../../components/PageFallback"
import TableCard from "../../components/TableCard"
import constructorObjectService from "../../services/constructorObjectService"
import { objectToArray } from "../../utils/objectToArray"
import { get } from "@ngard/tiny-get"
import FiltersBlock from "../../components/FiltersBlock"
import ColumnsSelector from "./components/ColumnsSelector"
import { tableColumnActions } from "../../store/tableColumn/tableColumn.slice"
import TableColumnFilter from "../../components/TableColumnFilter"
import FilterGenerator from "./components/FilterGenerator"

const ObjectsPage = ({ isRelation, tableSlug }) => {
  const params = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const tablesList = useSelector((state) => state.constructorTable.list)
  const columns = useSelector((state) => state.tableColumn.list)

  const [loader, setLoader] = useState(true)
  const [tableLoader, setTableLoader] = useState(false)
  const [tableData, setTableData] = useState([])
  const [filters, setFilters] = useState({})

  const filterChangeHandler = (value, name) => {
    console.log("CHANGE ==>", value, name)
    setFilters({
      ...filters,
      [name]: value,
    })
    getAllData()
  }

  console.log("FILTERS ==>", filters)

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
      const { data } = await constructorObjectService.getList(
        computedTableSlug,
        {
          data: { offset: 0, limit: 10, ...filters },
        }
      )

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

  useEffect(() => {
    getAllData()
  }, [computedTableSlug])

  if (loader) return <PageFallback />

  return (
    <div>
      {!isRelation && (
        <Header
          title={tableInfo.label}
          extra={<CreateButton onClick={navigateToCreatePage} />}
        />
      )}

      <FiltersBlock
        extra={
          <>
            <ColumnsSelector tableSlug={computedTableSlug} />
          </>
        }
      />

      <TableCard>
        <CTable>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            {computedColumns.map((field) => (
              <CTableCell key={field.id}>
                {field.label}
                <FilterGenerator
                  field={field}
                  name={field.slug}
                  onChange={filterChangeHandler}
                  filters={filters}
                />
              </CTableCell>
            ))}
          </CTableHead>

          <CTableBody
            loader={tableLoader}
            columnsCount={computedColumns.length + 1}
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
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  )
}

export default ObjectsPage
