import { Checkbox } from "@mui/material"
import { useMutation } from "react-query"
import constructorObjectService from "../../services/constructorObjectService"

import { CTableCell, CTableRow } from "../CTable"
import CellElementGenerator from "../ElementGenerators/CellElementGenerator"
import TableRowForm from "./TableRowForm"

const TableRow = ({
  row,
  key,
  rowIndex,
  control,
  onRowClick,
  checkboxValue,
  onCheckboxChange,
  currentPage,
  columns,
  tableHeight,
  tableSettings,
  pageName,
  calculateWidth,
  watch,
  setFormValue,
  tableSlug,
  isChecked = () => {},
  formVisible,
  setFormVisible,
  remove,
  limit = 10,
}) => {
  const { mutate: deleteRow } = useMutation(
    () => constructorObjectService.delete(tableSlug, row.guid),
    {
      onSuccess: () => remove(rowIndex),
    }
  )

  if (formVisible)
    return (
      <TableRowForm
        onDelete={deleteRow}
        remove={remove}
        watch={watch}
        onCheckboxChange={onCheckboxChange}
        checkboxValue={checkboxValue}
        row={row}
        key={key}
        setFormVisible={setFormVisible}
        formVisible={formVisible}
        currentPage={currentPage}
        limit={limit}
        control={control}
        setFormValue={setFormValue}
        rowIndex={rowIndex}
        columns={columns}
        tableHeight={tableHeight}
        tableSettings={tableSettings}
        pageName={pageName}
        calculateWidth={calculateWidth}
        tableSlug={tableSlug}
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
        {onCheckboxChange && (
          <div
            className={`data_table__row_checkbox ${
              isChecked(row) ? "checked" : ""
            }`}
          >
            <Checkbox
              checked={isChecked(row)}
              onChange={(_, val) => onCheckboxChange(val, row)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
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
      {/* <PermissionWrapperV2 tabelSlug={tableSlug} type={["update", "delete"]}>
      </PermissionWrapperV2> */}
    </CTableRow>
  )
}

export default TableRow
