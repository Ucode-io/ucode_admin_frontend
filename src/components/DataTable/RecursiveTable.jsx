import { useState } from "react";
import { CTableCell, CTableRow } from "../CTable";
import GroupCellElementGenerator from "./GroupCellElementGenerator";
import { useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Checkbox } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

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

  const clickHandler = () => {
    if (element?.data?.length) {
      setChildBlockVisible((prev) => !prev);
    }
  };

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(
        selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid)
      );
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };

  return (
    <>
      {element && (
        <CTableRow
          key={index}
          onClick={clickHandler}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "0 4px",
              minWidth: width,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {hovered ? (
                <Button
                  onClick={() => {
                    onRowClick(element, index);
                  }}
                  style={{
                    minWidth: "max-content",
                  }}
                >
                  <OpenInFullIcon />
                </Button>
              ) : (
                <span
                  className="data_table__row_number"
                  style={{ display: "block", width: "35px" }}
                >
                  {/* {(currentPage - 1) * limit + index + 1} */}
                  {/* {rowIndex + 1} */}
                </span>
              )}

              {hovered ||
              selectedObjectsForDelete.find(
                (item) => item?.guid === element?.guid
              ) ? (
                <Checkbox
                  checked={selectedObjectsForDelete?.find(
                    (item) => item?.guid === element?.guid
                  )}
                  onChange={() => {
                    changeSetDelete(element);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </CTableCell>
          {columns.map((column, index) => (
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
              }}
            >
              <Box display={"flex"} alignItems={"center"}>
                {/* {childBlockVisible ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )} */}
                <GroupCellElementGenerator field={column} row={element} />
              </Box>
            </CTableCell>
          ))}
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
