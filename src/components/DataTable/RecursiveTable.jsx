import { CTableCell, CTableRow } from "../CTable";
import GroupCellElementGenerator from "./GroupCellElementGenerator";
import { useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Checkbox } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { get } from "@ngard/tiny-get";
import { getRelationFieldTableCellLabel } from "../../utils/getRelationFieldLabel";
import { useMemo, useState } from "react";

const RecursiveTable = ({
  element,
  index,
  columns,
  width,
  control,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  mainForm,
  checkboxValue,
  onCheckboxChange,
  currentPage,
  view,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  tableSettings,
  pageName,
  calculateWidth,
  watch,
  setFormValue,
  tableSlug,
  isChecked = () => {},
  formVisible,
  remove,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
  data,
  style,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [hovered, setHovered] = useState(false);
  const [columnResult, setColumnResult] = useState();

  const clickHandler = () => {
    if (element?.data?.length) {
      setChildBlockVisible((prev) => !prev);
    }
  };
  const filteredColumns = columns.filter((column) =>
    view?.attributes?.group_by_columns.includes(
      column.attributes.field_permission.field_id
    )
  );

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(
        selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid)
      );
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };
  //   <CTableCell
  //   align="center"
  //   className="data_table__number_cell"
  //   style={{
  //     padding: "0 4px",
  //     minWidth: width,
  //   }}
  // >
  //   <div
  //     style={{
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //     }}
  //   >
  //     {hovered ? (
  //       <Button
  //         onClick={() => {
  //           onRowClick(element, index);
  //         }}
  //         style={{
  //           minWidth: "max-content",
  //         }}
  //       >
  //         <OpenInFullIcon />
  //       </Button>
  //     ) : (
  //       <span
  //         className="data_table__row_number"
  //         style={{ display: "block", width: "35px" }}
  //       >
  //         {/* {(currentPage - 1) * limit + index + 1} */}
  //         {/* {rowIndex + 1} */}
  //       </span>
  //     )}

  //     {hovered ||
  //     selectedObjectsForDelete.find(
  //       (item) => item?.guid === element?.guid
  //     ) ? (
  //       <Checkbox
  //         checked={selectedObjectsForDelete?.find(
  //           (item) => item?.guid === element?.guid
  //         )}
  //         onChange={() => {
  //           changeSetDelete(element);
  //         }}
  //       />
  //     ) : (
  //       ""
  //     )}
  //   </div>
  // </CTableCell>

  const getValue = (field, row) => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "");

    const result = getRelationFieldTableCellLabel(
      field,
      row,
      field.slug + "_data"
    );
    return result;
  };

  return (
    <>
      {element && (
        <CTableRow
          key={index}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {columns?.map((column, index) => {
            return (
              <CTableCell
                key={column.id}
                className={`overflow-ellipsis ${tableHeight}`}
                style={{
                  minWidth: "220px",
                  color: "#262626",
                  fontSize: "13px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  padding: "0 5px",
                  cursor:
                    filteredColumns.find((item) => item.id === column.id) &&
                    getValue(column, element)
                      ? "pointer"
                      : "default",
                }}
                onClick={
                  filteredColumns.find((item) => item.id === column.id) &&
                  getValue(column, element) &&
                  clickHandler
                }
              >
                <Box display={"flex"} alignItems={"center"}>
                  {filteredColumns.find((item) => item.id === column.id) &&
                  getValue(column, element) ? (
                    childBlockVisible ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )
                  ) : null}
                  <GroupCellElementGenerator field={column} row={element} />
                </Box>
              </CTableCell>
            );
          })}
        </CTableRow>
      )}

      {childBlockVisible &&
        element?.data?.map((childELement, childIndex) => (
          <RecursiveTable
            element={childELement}
            index={childIndex}
            columns={columns}
            width={"80px"}
            remove={remove}
            watch={watch}
            control={control}
            key={element.id}
            mainForm={mainForm}
            formVisible={formVisible}
            selectedObjectsForDelete={selectedObjectsForDelete}
            setSelectedObjectsForDelete={setSelectedObjectsForDelete}
            onRowClick={onRowClick}
            isChecked={isChecked}
            calculateWidthFixedColumn={calculateWidthFixedColumn}
            onCheckboxChange={onCheckboxChange}
            currentPage={currentPage}
            limit={limit}
            setFormValue={setFormValue}
            tableHeight={tableHeight}
            tableSettings={tableSettings}
            pageName={pageName}
            calculateWidth={calculateWidth}
            tableSlug={tableSlug}
            onDeleteClick={onDeleteClick}
            relationAction={relationAction}
            onChecked={onChecked}
            relationFields={relationFields}
            data={data}
            view={view}
          />
        ))}
    </>
  );
};

export default RecursiveTable;
