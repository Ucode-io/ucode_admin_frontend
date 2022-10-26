import { useTranslation } from "react-i18next"
import ButtonsPopover from "../../../../../components/ButtonsPopover"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../../../components/CTable"

const SessionsTable = ({ loader, tableData }) => {
  const { t } = useTranslation()

  return (
    <CTable loader={loader} removableHeight={340} disablePagination>
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={20}>No</CTableCell>
          <CTableCell>{t("fio")}</CTableCell>
          <CTableCell>{t("email")}</CTableCell>
          <CTableCell>{t("login")}</CTableCell>
          <CTableCell width={30}></CTableCell>
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody
          loader={loader}
          columnsCount={5}
          dataLength={tableData?.length}
        >
          {tableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              // onClick={() => navigate(`/projects/${data.id}/backlog`)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>{data.email}</CTableCell>
              <CTableCell>{data.login}</CTableCell>
              <CTableCell>
                <ButtonsPopover
                  id={data.id}
                  // onEditClick={navigateToEditForm}
                  // onDeleteClick={deleteTableData}
                />
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  )
}

export default SessionsTable
