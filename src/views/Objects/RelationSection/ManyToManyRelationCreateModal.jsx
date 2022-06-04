import { Checkbox } from "@mui/material"
import { get } from "@ngard/tiny-get"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import LargeModalCard from "../../../components/LargeModalCard"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"

const ManyToManyRelationCreateModal = ({ table, onCreate, closeModal }) => {
  const { tableSlug, id } = useParams()

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [checkedElements, setCheckedElements] = useState([])

  const [fields, setFields] = useState([])
  const [tableData, setTableData] = useState([])

  const getList = async () => {
    try {
      const {
        data: { response = {}, count = 1, fields = [] },
      } = await constructorObjectService.getList(table.slug, {
        data: { offset: pageToOffset(currentPage), limit: 10 },
      })

      const pageCount = Math.ceil(count / 10)

      setFields(fields)
      setPageCount(isNaN(pageCount) ? 1 : pageCount)
      setTableData(objectToArray(response ?? {}))
    } finally {
      setLoader(false)
    }
  }

  const onCheck = (e, id) => {
    if (e.target.checked) {
      setCheckedElements([...checkedElements, id])
    } else {
      setCheckedElements(checkedElements.filter((element) => element !== id))
    }
  }

  const onSubmit = async () => {
    try {
      setBtnLoader(true)

      const data = {
        id_from: id,
        id_to: checkedElements,
        table_from: tableSlug,
        table_to: table.slug,
      }

      await constructorObjectService.updateManyToMany(data)

      await onCreate(checkedElements)
      closeModal()
    } catch (error) {}
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <LargeModalCard
      title={table.label}
      loader={loader}
      btnLoader={btnLoader}
      oneColumn
      onSaveButtonClick={onSubmit}
      onClose={closeModal}
    >
      <CTable
        removableHeight={false}
        count={pageCount}
        page={currentPage}
        setCurrentPage={setCurrentPage}
      >
        <CTableHead>
          <CTableCell width={70}></CTableCell>
          <CTableCell width={10}>№</CTableCell>
          {fields.map((field, index) => (
            <CTableCell key={index}>
              <div className="table-filter-cell">
                {field.label}
                {/* <FilterGenerator
                  field={field}
                  name={field.slug}
                  onChange={filterChangeHandler}
                  filters={filters}
                /> */}
              </div>
            </CTableCell>
          ))}
        </CTableHead>

        <CTableBody
          loader={loader}
          columnsCount={fields.length + 2}
          dataLength={tableData.length}
        >
          {tableData.map((row, rowIndex) => (
            <CTableRow
              key={row.guid}
              // onClick={() => navigateToEditPage(row.guid)}
            >
              <CTableCell>
                <Checkbox
                  onChange={(e) => onCheck(e, row.guid)}
                  checked={checkedElements.includes(row.guid)}
                />
              </CTableCell>
              <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
              {fields.map((field) => (
                <CTableCell key={field.id} className="text-nowrap">
                  <CellElementGenerator
                    type={field.type}
                    value={get(row, field.slug, "")}
                  />
                </CTableCell>
              ))}

              {/* <CTableCell>
                <DeleteWrapperModal id={row.guid} onDelete={deleteHandler}>
                  <RectangleIconButton
                    color="error"
                    // onClick={() => deleteHandler(row.guid)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </DeleteWrapperModal>
              </CTableCell> */}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </LargeModalCard>
  )
}

export default ManyToManyRelationCreateModal
