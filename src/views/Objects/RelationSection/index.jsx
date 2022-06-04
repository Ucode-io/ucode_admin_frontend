import { Delete } from "@mui/icons-material"
import { get } from "@ngard/tiny-get"
import { useEffect, useState } from "react"
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
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal"
import RelationCreateModal from "./RelationCreateModal"

const RelationSection = ({ relation }) => {
  const { tableSlug, id } = useParams()
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
          data: {
            offset: pageToOffset(currentPage, 5),
            limit: 5,
            [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]:
              id,
          },
        }
      )

      const pageCount = Math.ceil(data.count / 10)

      if (id) {
        setTableData(objectToArray(data.response ?? {}))
        setPageCount(isNaN(pageCount) ? 1 : pageCount)
      }

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

  const deleteHandler = async (elementId) => {
    setTableLoader(true)
    try {
      if (relation.type === "Many2Many") {
        const data = {
          id_from: id,
          id_to: [elementId],
          table_from: tableSlug,
          table_to: relation.relatedTable?.slug,
        }

        await constructorObjectService.deleteManyToMany(data)
      } else {
        await constructorObjectService.delete(
          relation.relatedTable?.slug,
          elementId
        )
      }

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
      {modalVisible && relation.type !== "Many2Many" && (
        <RelationCreateModal
          table={relation.relatedTable}
          closeModal={() => setModalVisible(false)}
          onCreate={getAllData}
        />
      )}
      {modalVisible && relation.type === "Many2Many" && (
        <ManyToManyRelationCreateModal
          table={relation.relatedTable}
          closeModal={() => setModalVisible(false)}
          onCreate={getAllData}
        />
      )}
      <FormCard
        icon={relation.relatedTable?.icon}
        title={relation.relatedTable?.label}
        maxWidth="100%"
        className="p-1"
        extra={
          <CreateButton disabled={!id} onClick={() => setModalVisible(true)} />
        }
      >
        <CTable
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
          loader={tableLoader}
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
