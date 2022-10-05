import { Delete } from "@mui/icons-material"
import { Checkbox } from "@mui/material"

import RectangleIconButton from "../Buttons/RectangleIconButton"
import { CTableCell, CTableRow } from "../CTable"
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator"

const TableRowForm = ({
  onCheckboxChange,
  checkboxValue,
  watch = () => {},
  row,
  onDelete = () => {},
  remove,
  control,
  currentPage,
  rowIndex,
  columns,
  tableSettings,
  tableSlug,
  setFormValue,
  pageName,
  calculateWidth,
  limit = 10,
}) => {
  console.log("row - ", row)
  return (
    <CTableRow>
      {onCheckboxChange && (
        <CTableCell>
          <Checkbox
            checked={checkboxValue === row.guid}
            onChange={(_, val) => onCheckboxChange(val, row)}
            onClick={(e) => e.stopPropagation()}
          />
        </CTableCell>
      )}
      <CTableCell align="center">
        {(currentPage - 1) * limit + rowIndex + 1}
      </CTableCell>
      {columns.map((column, index) => (
        <CTableCell
          key={column.id}
          className={`overflow-ellipsis`}
          style={{
            padding: 0,
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
            minWidth: 270,
          }}
        >
          <CellFormElementGenerator
            tableSlug={tableSlug}
            watch={watch}
            fields={columns}
            field={column}
            row={row}
            index={rowIndex}
            control={control}
            setFormValue={setFormValue}
          />
        </CTableCell>
      ))}
      <CTableCell style={{ verticalAlign: "middle", padding: 0 }}>
        <RectangleIconButton color="error" onClick={onDelete}>
          <Delete color="error" />
        </RectangleIconButton>
      </CTableCell>
    </CTableRow>
  )
}

export default TableRowForm
