import { Delete, Edit } from "@mui/icons-material"
import { Checkbox } from "@mui/material"
import { useState } from "react"
import RectangleIconButton from "../Buttons/RectangleIconButton"
import { CTableCell, CTableRow } from "../CTable"
import DeleteWrapperModal from "../DeleteWrapperModal"
import CellElementGenerator from "../ElementGenerators/CellElementGenerator"
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2"
import TableRowForm from "./TableRowForm"

const TableRow = ({
  row,
  rowIndex,
  onRowClick,
  checkboxValue,
  onCheckboxChange,
  currentPage,
  columns,
  tableHeight,
  tableSettings,
  pageName,
  calculateWidth,
  tableSlug,
  onDeleteClick,
  onEditClick,
  onFormSubmit,
  isChecked=()=>{},
  limit = 10,
}) => {
  const [formVisible, setFormVisible] = useState(false)

  if (formVisible)
    return (
      <TableRowForm
        onCheckboxChange={onCheckboxChange}
        checkboxValue={checkboxValue}
        row={row}
        currentPage={currentPage}
        limit={limit}
        rowIndex={rowIndex}
        columns={columns}
        tableHeight={tableHeight}
        tableSettings={tableSettings}
        pageName={pageName}
        calculateWidth={calculateWidth}
        setFormVisible={setFormVisible}
        tableSlug={tableSlug}
        onFormSubmit={onFormSubmit}
      />
    )

  return (
    <CTableRow
      onClick={() => {
        onRowClick(row, rowIndex)
      }}
    >
      <CTableCell align="center" className="data_table__number_cell">
        <span className="data_table__row_number">
          {(currentPage - 1) * limit + rowIndex + 1}
        </span>
        {onCheckboxChange && <div className={`data_table__row_checkbox ${isChecked(row) ? 'checked' : ''}`}>
          <Checkbox
            checked={isChecked(row)}
            onChange={(_, val) => onCheckboxChange(val, row)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>}
      </CTableCell>

      {columns.map((column, index) => (
        <CTableCell
          key={column.id}
          className={`overflow-ellipsis ${tableHeight}`}
          style={{
            padding: "8px 12px 4px",
            position: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? "sticky"
              : "relative",
            left: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? calculateWidth(column?.id, index)
              : "0",
            backgroundColor: "#fff",
            zIndex: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? "1"
              : "",
          }}
        >
          <CellElementGenerator field={column} row={row} />
        </CTableCell>
      ))}
      <PermissionWrapperV2 tabelSlug={tableSlug} type={["update", "delete"]}>
        {(onDeleteClick || onFormSubmit) && (
          <CTableCell
            style={{ padding: "8px 12px 4px", verticalAlign: "middle" }}
          >
            <div className="flex">
              {onFormSubmit && (
                <RectangleIconButton
                  color="success"
                  className="mr-1"
                  size="small"
                  onClick={() => setFormVisible(true)}
                >
                  <Edit color="primary" />
                </RectangleIconButton>
              )}
              {onDeleteClick && (
                <DeleteWrapperModal
                  id={row.guid}
                  onDelete={() => onDeleteClick(row, rowIndex)}
                >
                  <RectangleIconButton color="error">
                    <Delete color="error" />
                  </RectangleIconButton>
                </DeleteWrapperModal>
              )}
            </div>
          </CTableCell>
        )}
      </PermissionWrapperV2>
    </CTableRow>
  )
}

export default TableRow
