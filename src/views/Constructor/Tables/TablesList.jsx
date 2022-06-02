import { Delete } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import DeleteWrapperModal from "../../../components/DeleteWrapperModal"
import { deleteConstructorTableAction } from "../../../store/constructorTable/constructorTable.thunk"

const TablesList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const list = useSelector((state) => state.constructorTable.list)
  const loader = useSelector((state) => state.constructorTable.loader)

  const navigateToEditForm = (id, slug) => {
    navigate(`${location.pathname}/${id}/${slug}`)
  }

  const deleteTable = (id) => {
    dispatch(deleteConstructorTableAction(id))
  }

  return (
    <div>
      <CTable disablePagination>
        <CTableHead>
          <CTableCell width={10}>№</CTableCell>
          <CTableCell>Название</CTableCell>
          <CTableCell>Описание</CTableCell>
          <CTableCell width={60} />
        </CTableHead>
        <CTableBody loader={loader} columnsCount={4} dataLength={list.length}>
          {list?.map((element, index) => (
            <CTableRow
              key={element.id}
              onClick={() => navigateToEditForm(element.id, element.slug)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>{element.label}</CTableCell>
              <CTableCell>{element.description}</CTableCell>
              <CTableCell>
                <DeleteWrapperModal id={element.id} onDelete={deleteTable} >
                  <RectangleIconButton
                    color="error"
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </DeleteWrapperModal>
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default TablesList
