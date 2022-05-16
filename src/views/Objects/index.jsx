import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
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

const ObjectsPage = ({ isRelation, tableSlug, filters = [] }) => {
  const params = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const tablesList = useSelector((state) => state.constructorTable.list)

  const [loader, setLoader] = useState(true)
  const [tableLoader, setTableLoader] = useState(false)
  const [tableData, setTableData] = useState([])
  const [fields, setFields] = useState([])

  const computedTableSlug = isRelation ? tableSlug : params.tableSlug

  const tableInfo = useMemo(() => {
    if(isRelation) return {}
    return tablesList.find((el) => el.slug === params.tableSlug)
  }, [tablesList, params.tableSlug, isRelation])

  const getAllData = async () => {
    setLoader(true)
    try {
      const { data } = await constructorObjectService.getList(computedTableSlug, {
        data: { offset: 0, limit: 10, ...filters},
      })

      setTableData(objectToArray(data.response ?? {}))
      setFields(data.fields ?? [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }

  const navigateToCreatePage = () => {
    navigate(`${pathname}/create`)
  }
  const navigateToEditPage = (id) => {
    if(isRelation) navigate(`/object/${computedTableSlug}/${id}`, { state: filters })
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

      <TableCard>
        <CTable>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            {fields.map((field) => (
              <CTableCell key={field.id}>{field.label}</CTableCell>
            ))}
          </CTableHead>

          <CTableBody
            loader={tableLoader}
            columnsCount={4}
            dataLength={tableData.length}
          >
            {tableData.map((row, rowIndex) => (
              <CTableRow
                key={row.guid}
                onClick={() => navigateToEditPage(row.guid)}
              >
                <CTableCell>{rowIndex + 1}</CTableCell>
                {fields.map((field) => (
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
