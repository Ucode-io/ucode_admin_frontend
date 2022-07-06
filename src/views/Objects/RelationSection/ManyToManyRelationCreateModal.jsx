import { Checkbox } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CreateButton from "../../../components/Buttons/CreateButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import LargeModalCard from "../../../components/LargeModalCard"
import SearchInput from "../../../components/SearchInput"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import useTabRouter from "../../../hooks/useTabRouter"
import useWatch from "../../../hooks/useWatch"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"


const ManyToManyRelationCreateModal = ({ table, onCreate, closeModal }) => {
  const { tableSlug, id } = useParams()
  const { navigateToForm } = useTabRouter()

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [checkedElements, setCheckedElements] = useState([])
  const [searchText, setSearchText] = useState("")

  const [fields, setFields] = useState([])
  const [tableData, setTableData] = useState([])

  const getList = async () => {
    try {
      const {
        data: { response = {}, count = 1, fields = [] },
      } = await constructorObjectService.getList(table.slug, {
        data: { offset: pageToOffset(currentPage), limit: 10, search: searchText },
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
  }, [currentPage])

  useDebouncedWatch(() => {
    if(currentPage !== 1) setCurrentPage(1)
    else  getList()
  }, [searchText])

  return (
    <LargeModalCard
      title={table.label}
      loader={loader}
      btnLoader={btnLoader}
      oneColumn
      onSaveButtonClick={onSubmit}
      onClose={closeModal}
    >
      <div className="flex align-center gap-2 mb-2" >
        <SearchInput style={{ flex: 1 }} autoFocus onChange={setSearchText} />
        <CreateButton title="Создать новый" onClick={() => {
          navigateToForm(table.slug, "CREATE", null, {})
          closeModal()
        }} />
      </div>

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
              <CTableCell style={{ padding: "0 16px" }}>
                <Checkbox
                  onChange={(e) => onCheck(e, row.guid)}
                  checked={checkedElements.includes(row.guid)}
                />
              </CTableCell>
              <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
              {fields.map((field) => (
                <CTableCell key={field.id} className="text-nowrap">
                  <CellElementGenerator row={row} field={field} />
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
