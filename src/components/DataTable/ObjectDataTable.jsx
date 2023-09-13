import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";
import { useLocation } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CTable, CTableBody, CTableHead, CTableHeadCell, CTableRow } from "../CTable";
import FilterGenerator from "../../views/Objects/components/FilterGenerator";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import { PinIcon, ResizeIcon } from "../../assets/icons/icon";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import TableRow from "./TableRow";
import SummaryRow from "./SummaryRow";
import MultipleUpdateRow from "./MultipleUpdateRow";
import "./style.scss";
import { selectedRowActions } from "../../store/selectedRow/selectedRow.slice";
import CellCheckboxNoSign from "./CellCheckboxNoSign";
import { Box, Button, LinearProgress } from "@mui/material";
import TableHeadForTableView from "./TableHeadForTableView";
import InfiniteScroll from "react-infinite-scroll-component";
import constructorObjectService from "../../services/constructorObjectService";

const ObjectDataTable = ({
  data = [],
  loader = false,
  setDrawerState,
  removableHeight,
  additionalRow,
  mainForm,
  elementHeight,
  selectedView,
  isTableView = false,
  remove,
  multipleDelete,
  openFieldSettings,
  sortedDatas,
  fields = [],
  isRelationTable,
  disablePagination,
  currentPage = 1,
  onPaginationChange = () => {},
  pagesCount = 1,
  setSortedDatas,
  columns = [],
  relatedTableSlug,
  watch,
  control,
  setFormValue,
  dataLength,
  onDeleteClick,
  onEditClick,
  onRowClick = () => {},
  filterChangeHandler = () => {},
  filters,
  disableFilters,
  tableStyle,
  wrapperStyle,
  tableSlug,
  isResizeble,
  paginationExtraButton,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  onCheckboxChange,
  limit,
  setLimit,
  isChecked,
  formVisible,
  summaries,
  relationAction,
  onChecked,
  defaultLimit,
  title,
  view,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);

  const popupRef = useRef(null);
  useOnClickOutside(popupRef, () => setColumnId(""));
  const pageName = location?.pathname.split("/")[location.pathname.split("/").length - 1];

  useEffect(() => {
    if (!isResizeble) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll("th");
      [].forEach.call(cols, function (col, idx) {
        // Add a resizer element to the column
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");

        // Set the height
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
        dispatch(tableSizeAction.setTableSize({ pageName, colID, colWidth }));
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
    dispatch(tableSizeAction.setTableSize({ pageName, colID, colWidth: "auto" }));
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
    const colIdx = tableSettings?.[pageName]?.filter((item) => item?.isStiky === true)?.findIndex((item) => item?.id === colId);

    if (index === 0) {
      return 0;
    } else if (colIdx === 0) {
      return 0;
    } else if (tableSettings?.[pageName]?.filter((item) => item?.isStiky === true).length === 1) {
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

  useEffect(() => {
    if (!formVisible) {
      dispatch(selectedRowActions.clear());
    }
  }, [formVisible]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    constructorObjectService.getList(tableSlug, { data: { limit: 0, offset: 0 } }).then((res) => {
      setCount(Math.ceil(res.data?.count / limit));
    });
  }, [tableSlug, limit]);

  const hasMore = useMemo(() => {
    return currentPage <= count;
  }, [currentPage, pagesCount, tableSlug, data, count]);

  return (
    <CTable
      disablePagination={disablePagination}
      removableHeight={removableHeight}
      count={pagesCount}
      page={currentPage}
      setCurrentPage={onPaginationChange}
      loader={loader}
      multipleDelete={multipleDelete}
      selectedObjectsForDelete={selectedObjectsForDelete}
      tableStyle={tableStyle}
      wrapperStyle={wrapperStyle}
      paginationExtraButton={paginationExtraButton}
      limit={limit}
      setLimit={setLimit}
      defaultLimit={defaultLimit}
    >
      {/* <Box
        style={{
          width: "100%",
        }}
      >
        <InfiniteScroll
          dataLength={data?.length}
          next={() => {
            if (hasMore) {
              onPaginationChange(currentPage + 1);
            }
          }}
          hasMore={hasMore}
          loader={
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          }
          // height={"calc(100vh - 170px)"}
          height={`${elementHeight - 50}px`}
        >
          <table> */}
            <CTableHead>
              {formVisible && selectedRow.length > 0 && <MultipleUpdateRow columns={data} fields={columns} watch={watch} setFormValue={setFormValue} control={control} />}
              <CTableRow>
                <CellCheckboxNoSign formVisible={formVisible} data={data} />

                {columns.map(
                  (column, index) =>
                    column?.attributes?.field_permission?.view_permission && (
                      <TableHeadForTableView
                        column={column}
                        index={index}
                        pageName={pageName}
                        sortedDatas={sortedDatas}
                        setSortedDatas={setSortedDatas}
                        setDrawerState={setDrawerState}
                        tableSize={tableSize}
                        tableSettings={tableSettings}
                        view={view}
                        selectedView={selectedView}
                        calculateWidthFixedColumn={calculateWidthFixedColumn}
                        handlePin={handlePin}
                        handleAutoSize={handleAutoSize}
                        popupRef={popupRef}
                        columnId={columnId}
                        setColumnId={setColumnId}
                        setCurrentColumnWidth={setCurrentColumnWidth}
                        isTableView={isTableView}
                        FilterGenerator={FilterGenerator}
                        filterChangeHandler={filterChangeHandler}
                        filters={filters}
                        tableSlug={tableSlug}
                        disableFilters={disableFilters}
                      />
                    )
                )}

                <PermissionWrapperV2 tableSlug={isRelationTable ? relatedTableSlug : tableSlug} type={["update", "delete"]}>
                  {(onDeleteClick || onEditClick) && (
                    <CTableHeadCell width={10}>
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          padding: "10px 4px",
                          color: "#747474",
                          fontSize: "13px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          backgroundColor: "#fff",
                        }}
                      >
                        Actions
                      </span>
                    </CTableHeadCell>
                  )}
                </PermissionWrapperV2>

                <CTableHeadCell style={{ padding: "2px 0", minWidth: "40px" }}>
                  <Button variant="text" style={{ borderColor: "#F0F0F0", borderRadius: "0px" }} onClick={openFieldSettings}>
                    <AddRoundedIcon />
                    Column
                  </Button>
                </CTableHeadCell>
              </CTableRow>
            </CTableHead>

            <CTableBody columnsCount={columns.length} dataLength={dataLength || data?.length} title={title}>
              {(isRelationTable ? fields : data)?.map((row, rowIndex) => (
                <TableRow
                  width={"80px"}
                  remove={remove}
                  watch={watch}
                  control={control}
                  key={row.id}
                  row={row}
                  mainForm={mainForm}
                  formVisible={formVisible}
                  rowIndex={rowIndex}
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
                  relationAction={relationAction}
                  onChecked={onChecked}
                  relationFields={fields}
                  data={data}
                  view={view}
                />
              ))}
              {!!summaries?.length && <SummaryRow summaries={summaries} columns={columns} data={data} />}
              {additionalRow}
            </CTableBody>
          {/* </table>
        </InfiniteScroll>
      </Box> */}
    </CTable>
  );
};

export default ObjectDataTable;
