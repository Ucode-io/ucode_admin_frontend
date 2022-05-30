import { Delete } from "@mui/icons-material"
import { get } from "@ngard/tiny-get"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import CreateButton from "../../../components/Buttons/CreateButton"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import FormCard from "../../../components/FormCard"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import RelationCreateModal from "./RelationCreateModal"

const RelationSection = ({ relation }) => {
  const { tableSlug, id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [columns, setColumns] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const getAllData = async () => {
    setTableLoader(true)
    try {
      const { data } = await constructorObjectService.getList(
        relation.relatedTable?.slug,
        {
          data: { offset: pageToOffset(currentPage), limit: 10, [`${tableSlug}_id`]: id },
        }
      )
      
      const pageCount = Math.ceil(data.count / 10)

      setTableData(objectToArray(data.response ?? {}))
      setPageCount(isNaN(pageCount) ? 1 : pageCount)
      setColumns(data.fields ?? [])
      // dispatch(
      //   tableColumnActions.setList({
      //     tableSlug: relation.relatedTable?.slug,
      //     columns: data.fields ?? [],
      //   })
      // )
    } finally {
      setTableLoader(false)
    }
  }

  const deleteHandler = async (id) => {
    setTableLoader(true)
    try {
      await constructorObjectService.delete(relation.relatedTable?.slug, id)
      getAllData()
    } catch {
      setTableLoader(false)
    }
  }

  const navigateToEditPage = (id) => {
    navigate(`/object/${relation.relatedTable?.slug}/${id}`)
  }

  useEffect(() => {
    getAllData()
  }, [currentPage])

  return (
    <>
      {modalVisible && (
        <RelationCreateModal
          table={relation.relatedTable}
          closeModal={() => setModalVisible(false)}
          onCreate={getAllData}
          
        />
      )}
      <FormCard
        title={relation.relatedTable?.label}
        maxWidth="100%"
        className="p-1"
        extra={<CreateButton onClick={() => setModalVisible(true)} />}
      >
        <CTable
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
        >
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            {columns.map((field, index) => (
              <CTableCell key={index}>
                <div className="table-filter-cell">{field.label}</div>
              </CTableCell>
            ))}
            <CTableCell width={70}></CTableCell>
          </CTableHead>

          <CTableBody
            loader={tableLoader}
            columnsCount={columns.length + 2}
            dataLength={tableData.length}
          >
            {tableData.map((row, rowIndex) => (
              <CTableRow
                key={row.guid}
                onClick={() => navigateToEditPage(row.guid)}
              >
                <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
                {columns.map((field) => (
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
      </FormCard>
    </>
  )
}

export default RelationSection
