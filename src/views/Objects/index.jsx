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
import Header from "../../components/Header"
import PageFallback from "../../components/PageFallback"
import TableCard from "../../components/TableCard"
import constructorFieldService from "../../services/constructorFieldService"
import constructorObjectService from "../../services/constructorObjectService"
import { objectToArray } from "../../utils/objectToArray"

const ObjectsPage = () => {
  const { tableSlug } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const tablesList = useSelector((state) => state.constructorTable.list)

  const [loader, setLoader] = useState(true)
  const [tableLoader, setTableLoader] = useState(false)
  const [tableData, setTableData] = useState([])
  const [fields, setFields] = useState([])

  const tableInfo = useMemo(() => {
    return tablesList.find((el) => el.slug === tableSlug)
  }, [tablesList, tableSlug])

  const getAllData = async () => {
    if (!tableInfo) return

    const getTableData = constructorObjectService.getList(tableSlug, {
      data: { offset: 0, limit: 10 },
    })

    const getFields = constructorFieldService.getList({
      table_id: tableInfo.id,
    })

    try {
      const [{ data = {} }, { fields = [] }] = await Promise.all([
        getTableData,
        getFields,
      ])

      setTableData(objectToArray(data))
      setFields(fields)
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }

  const navigateToCreatePage = () => { navigate(`${pathname}/create`) }
  const navigateToEditPage = (id) => { navigate(`${pathname}/${id}`) }

  useEffect(() => {
    getAllData()
  }, [tableInfo])

  if (loader) return <PageFallback />

  return (
    <div>
      <Header title={tableInfo.label} extra={<CreateButton onClick={navigateToCreatePage} />} />

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
                key={row.id}
                onClick={() => navigateToEditPage(row.id)}
              >
                <CTableCell>{ rowIndex + 1 }</CTableCell>
                {fields.map((field) => (
                  <CTableCell key={field.id}>{ row[field.slug] }</CTableCell>
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
