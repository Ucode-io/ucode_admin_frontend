import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {Checkbox} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import useOnClickOutside from "use-onclickoutside";
import {tableSizeAction} from "../../../store/tableSize/tableSizeSlice";
import "./style.scss";

import {Box, Flex, Image} from "@chakra-ui/react";
import FieldButton from "../../../components/DataTable/FieldButton";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import AddDataColumn from "../../table-redesign/AddDataColumn";
import TableRow from "../../table-redesign/table-row";
import Th from "./Th-table";

const DrawerObjectDataTable = ({
  tableView,
  data = [],
  setDrawerState,
  setDrawerStateField,
  getValues,
  mainForm,
  isTableView = false,
  remove,
  openFieldSettings,
  sortedDatas,
  fields = [],
  isRelationTable = false,
  currentPage = 1,
  setSortedDatas,
  columns = [],
  relatedTableSlug,
  watch,
  control,
  setFormValue,
  onDeleteClick,
  onRowClick = () => {},
  tableSlug,
  isResizeble,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  onCheckboxChange,
  limit,
  isChecked,
  formVisible,
  relationAction,
  onChecked,
  view,
  refetch,
  menuItem,
  getAllData = () => {},
  layoutData,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [addNewRow, setAddNewRow] = useState(false);

  const tabHeight = document.querySelector("#tabsHeight")?.offsetHeight ?? 0;
  console.log("datadata", data);
  const popupRef = useRef(null);
  useOnClickOutside(popupRef, () => setColumnId(""));
  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];
  useEffect(() => {
    if (!isResizeble) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll("th");
      [].forEach.call(cols, function (col, idx) {
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");

        resizer.style.height = `${table.offsetHeight}px`;

        col.appendChild(resizer);

        createResizableColumn(col, resizer, idx);
      });
    };

    const createResizableColumn = function (col, resizer, idx) {
      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e) {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        resizer.classList.add("resizing");
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const colID = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth}));
        dispatch(
          tableSizeAction.setTableSettings({
            pageName,
            colID,
            colWidth,
            isStiky: "ineffective",
            colIdx: idx - 1,
          })
        );
        col.style.width = `${colWidth}px`;
      };

      const mouseUpHandler = function () {
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      resizer.addEventListener("mousedown", mouseDownHandler);
    };

    createResizableTable(document.getElementById("resizeMe"));
  }, [data, isResizeble, pageName, dispatch]);

  const handleAutoSize = (colID, colIdx) => {
    dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth: "auto"}));
    const element = document.getElementById(colID);
    element.style.width = "auto";
    element.style.minWidth = "auto";
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: element.offsetWidth,
        isStiky: "ineffective",
        colIdx,
      })
    );
    setColumnId("");
  };

  const handlePin = (colID, colIdx) => {
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: currentColumnWidth,
        isStiky: true,
        colIdx,
      })
    );
    setColumnId("");
  };

  const calculateWidth = (colId, index) => {
    const colIdx = tableSettings?.[pageName]
      ?.filter((item) => item?.isStiky === true)
      ?.findIndex((item) => item?.id === colId);

    if (index === 0) {
      return 0;
    } else if (colIdx === 0) {
      return 0;
    } else if (
      tableSettings?.[pageName]?.filter((item) => item?.isStiky === true)
        .length === 1
    ) {
      return 0;
    } else {
      return tableSettings?.[pageName]
        ?.filter((item) => item?.isStiky === true)
        ?.slice(0, colIdx)
        ?.reduce((acc, item) => acc + item?.colWidth, 0);
    }
  };

  const calculateWidthFixedColumn = (colId) => {
    const prevElementIndex = columns?.findIndex((item) => item.id === colId);

    if (prevElementIndex === -1 || prevElementIndex === 0) {
      return 0;
    }

    let totalWidth = 0;

    for (let i = 0; i < prevElementIndex; i++) {
      const element = document.querySelector(`[id='${columns?.[i].id}']`);
      totalWidth += element?.offsetWidth || 0;
    }

    return totalWidth;
  };

  const renderColumns = (columns ?? []).filter((column) =>
    Boolean(column?.attributes?.field_permission?.view_permission)
  );

  return (
    <div className="CTableContainer">
      <div
        className="table"
        style={{
          border: "none",
          borderRadius: 0,
          flexGrow: 1,
          backgroundColor: "#fff",
          borderTop: "1px solid #E5E9EB",
          height: `calc(100vh - ${0 + tabHeight + 130}px)`,
        }}>
        <table id="resizeMe">
          <thead
            style={{
              borderBottom: "1px solid #EAECF0",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}>
            <tr>
              <IndexTh
                items={isRelationTable ? columns : data}
                selectedItems={selectedObjectsForDelete}
                formVisible={formVisible}
                onSelectAll={(checked) =>
                  setSelectedObjectsForDelete(
                    checked ? (isRelationTable ? columns : data) : []
                  )
                }
              />
              {renderColumns.map((column) => (
                <Th
                  key={column.id}
                  tableSlug={tableSlug}
                  columns={renderColumns}
                  column={column}
                  view={view}
                  tableSettings={tableSettings}
                  tableSize={tableSize}
                  pageName={pageName}
                  sortedDatas={sortedDatas}
                  setSortedDatas={setSortedDatas}
                  relationAction={relationAction}
                  isRelationTable={isRelationTable}
                  setFieldCreateAnchor={setFieldCreateAnchor}
                  setFieldData={setFieldData}
                  getAllData={getAllData}
                  setCurrentColumnWidth={setCurrentColumnWidth}
                />
              ))}
              <PermissionWrapperV2
                tableSlug={isRelationTable ? relatedTableSlug : tableSlug}
                type="add_field"
                id="addField">
                <FieldButton
                  // tableLan={tableLan}
                  openFieldSettings={openFieldSettings}
                  view={view}
                  mainForm={mainForm}
                  fields={fields}
                  setFieldCreateAnchor={setFieldCreateAnchor}
                  fieldCreateAnchor={fieldCreateAnchor}
                  fieldData={fieldData}
                  setFieldData={setFieldData}
                  setDrawerState={setDrawerState}
                  setDrawerStateField={setDrawerStateField}
                  menuItem={menuItem}
                />
              </PermissionWrapperV2>
            </tr>
          </thead>
          <tbody>
            {(isRelationTable ? fields : data).map(
              (virtualRowObject, index) => (
                <TableRow
                  key={isRelationTable ? virtualRowObject?.id : index}
                  tableView={tableView}
                  width={"40px"}
                  remove={remove}
                  watch={watch}
                  getValues={getValues}
                  control={control}
                  row={virtualRowObject}
                  mainForm={mainForm}
                  formVisible={formVisible}
                  rowIndex={index}
                  isTableView={isTableView}
                  selectedObjectsForDelete={selectedObjectsForDelete}
                  setSelectedObjectsForDelete={setSelectedObjectsForDelete}
                  isRelationTable={isRelationTable}
                  relatedTableSlug={relatedTableSlug}
                  onRowClick={onRowClick}
                  isChecked={isChecked}
                  calculateWidthFixedColumn={calculateWidthFixedColumn}
                  onCheckboxChange={onCheckboxChange}
                  currentPage={currentPage}
                  limit={limit}
                  setFormValue={setFormValue}
                  columns={columns}
                  tableHeight={tableHeight}
                  tableSettings={tableSettings}
                  pageName={pageName}
                  calculateWidth={calculateWidth}
                  tableSlug={tableSlug}
                  onDeleteClick={onDeleteClick}
                  relationAction={false}
                  onChecked={onChecked}
                  relationFields={fields?.length}
                  data={data}
                  view={view}
                  firstRowWidth={45}
                />
              )
            )}

            {addNewRow && (
              <AddDataColumn
                rows={fields}
                columns={columns}
                isRelationTable={true}
                setAddNewRow={setAddNewRow}
                isTableView={isTableView}
                tableView={tableView}
                tableSlug={relatedTableSlug}
                fields={columns}
                getValues={getValues}
                mainForm={mainForm}
                originControl={control}
                setFormValue={setFormValue}
                relationfields={fields}
                data={data}
                view={view}
                onRowClick={onRowClick}
                width={"80px"}
                refetch={refetch}
                pageName={pageName}
                tableSettings={tableSettings}
                calculateWidthFixedColumn={calculateWidthFixedColumn}
                firstRowWidth={45}
              />
            )}

            <PermissionWrapperV2 tableSlug={tableSlug} type={"write"}>
              <tr>
                <td
                  style={{
                    padding: "0",
                    position: "sticky",
                    left: "0",
                    backgroundColor: "#FFF",
                    zIndex: "1",
                    width: "45px",
                    color: "#007aff",
                  }}>
                  <Flex
                    id="addRowBtn"
                    h="30px"
                    alignItems="center"
                    justifyContent="center"
                    transition="background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
                    cursor="pointer"
                    _hover={{bg: "rgba(0, 122, 255, 0.08)"}}
                    onClick={() => setAddNewRow(true)}>
                    <AddRoundedIcon fill="#007aff" />
                  </Flex>
                </td>
              </tr>
            </PermissionWrapperV2>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const IndexTh = ({items, selectedItems, onSelectAll}) => {
  const {tableSlug} = useParams();
  const permissions = useSelector((state) => state?.permissions?.permissions);
  const hasPermission = permissions?.[tableSlug]?.delete;
  const [hover, setHover] = useState(false);

  const showCheckbox = hover || selectedItems?.length > 0;

  return (
    <Box
      minWidth="45px"
      textAlign="center"
      as="th"
      bg="#f6f6f6"
      py="2px"
      px="12px"
      borderRight="1px solid #EAECF0"
      position="sticky"
      left={0}
      zIndex={1}
      onMouseEnter={hasPermission ? () => setHover(true) : null}
      onMouseLeave={hasPermission ? () => setHover(false) : null}>
      {!showCheckbox && <Image src="/img/hash.svg" alt="index" mx="auto" />}
      {showCheckbox && (
        <Checkbox
          style={{width: 10, height: 10}}
          checked={items?.length === selectedItems?.length}
          indeterminate={
            selectedItems?.length > 0 && items?.length !== selectedItems?.length
          }
          onChange={(_, checked) => onSelectAll(checked)}
        />
      )}
    </Box>
  );
};

export default DrawerObjectDataTable;
