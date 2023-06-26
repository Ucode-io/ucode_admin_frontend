import { Delete } from "@mui/icons-material";
import { Checkbox } from "@mui/material";

import { CTableCell, CTableRow } from "../CTable";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator";
import CellCheckboxOrOrderNumBlock from "./CellCheckboxOrOrderNumBlock";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import DeleteWrapperModal from "../DeleteWrapperModal";

const TableRowForm = ({
  onCheckboxChange,
  checkboxValue,
  watch = () => {},
  row,
  onDeleteClick = () => {},
  formVisible,
  remove,
  control,
  currentPage,
  rowIndex,
  relatedTableSlug,
  isRelationTable,
  columns,
  tableSettings,
  tableSlug,
  setFormValue,
  pageName,
  calculateWidth,
  limit = 10,
  relationFields,
  data,
}) => {
  return (
    <CTableRow>
      <CellCheckboxOrOrderNumBlock
        currentPage={currentPage}
        limit={limit}
        rowIndex={rowIndex}
        row={row}
      />
      {onCheckboxChange && !formVisible && (
        <CTableCell>
          <Checkbox
            checked={checkboxValue === row.guid}
            onChange={(_, val) => onCheckboxChange(val, row)}
            onClick={(e) => e.stopPropagation()}
          />
        </CTableCell>
      )}

      {!formVisible && (
        <CTableCell align="center">
          {(currentPage - 1) * limit + rowIndex + 1}
        </CTableCell>
      )}
      {columns.map((column, index) => (
        <CTableCell
          key={column.id}
          className={`overflow-ellipsis editable_col`}
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
            minWidth: "max-content",
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
            relationfields={relationFields}
            data={data}
          />
        </CTableCell>
      ))}
      <CTableCell style={{ verticalAlign: "middle", padding: 0 }}>
        <PermissionWrapperV2
          type="delete"
          tableSlug={isRelationTable ? relatedTableSlug : tableSlug}
        >
          <RectangleIconButton
            color="error"
            onClick={() =>
              row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
            }
          >
            <Delete color="error" />
          </RectangleIconButton>
        </PermissionWrapperV2>
      </CTableCell>
    </CTableRow>
  );
};

export default TableRowForm;
