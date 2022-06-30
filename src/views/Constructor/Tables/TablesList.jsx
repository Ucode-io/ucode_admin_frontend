import { Delete } from "@mui/icons-material"
import { useState } from "react"
import { useFieldArray } from "react-hook-form"
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
import TableCard from "../../../components/TableCard"
import TableRowButton from "../../../components/TableRowButton"
import applicationService from "../../../services/applicationSercixe"
import constructorTableService from "../../../services/constructorTableService"
import ImportModal from "./ImportModal"

const TablesList = ({ mainForm, appData, getData}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loader, setLoader] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [modalLoader, setModalLoader] = useState()

  const { fields: list, remove,  } = useFieldArray({
    control: mainForm.control,
    name: "tables",
    keyName: "key",
  })

  const navigateToEditForm = (id, slug) => {
    navigate(`${location.pathname}/objects/${id}/${slug}`)
  }

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/objects/create`)
  }

  const openImportModal = () => {
    setImportModalVisible(true)
  }

  const closeImportModal = () => {
    setImportModalVisible(false)
  }

  const importTable = (checkedElements) => {
    setModalLoader()


    applicationService
      .update({
        ...appData,
        table_ids: [...list.map(el => el.id), ...checkedElements],
      })
      .then(() => {
        closeImportModal()
        getData()
      })
      .finally(() => setModalLoader(false))
  }

  const deleteTable = async (id) => {
    setLoader(true)

    const index = list?.findIndex((table) => table.id === id)

    const computedTableIds =
      list?.filter((table) => table.id !== id).map((table) => table.id) ?? []

    try {
      // await constructorTableService.delete(id)

      await applicationService.update({
        ...appData,
        table_ids: computedTableIds,
      })
      remove(index)
    } finally {
      setLoader(false)
    }
  }

  return (
    <>
      {importModalVisible && <ImportModal  closeModal={closeImportModal} importTable={importTable} btnLoader={modalLoader} />}
      <TableCard>
        <CTable disablePagination removableHeight={120}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Название</CTableCell>
            <CTableCell>Описание</CTableCell>
            <CTableCell width={60} />
          </CTableHead>
          <CTableBody columnsCount={4} dataLength={1} loader={loader}>
            {list?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id, element.slug)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element.label}</CTableCell>
                <CTableCell>{element.description}</CTableCell>
                <CTableCell>
                  <DeleteWrapperModal id={element.id} onDelete={deleteTable}>
                    <RectangleIconButton color="error">
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
              </CTableRow>
            ))}

            <TableRowButton
              colSpan={4}
              onClick={openImportModal}
              title="Импортировать из других приложений"
            />
            <TableRowButton
              colSpan={4}
              onClick={navigateToCreateForm}
              title="Создать новый"
            />
          </CTableBody>
        </CTable>
      </TableCard>
    </>
  )
}

export default TablesList
