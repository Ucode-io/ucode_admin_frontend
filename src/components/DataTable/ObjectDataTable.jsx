import {useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useOnClickOutside from "use-onclickoutside";
import {useLocation} from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../CTable";
import FilterGenerator from "../../views/Objects/components/FilterGenerator";
import {tableSizeAction} from "../../store/tableSize/tableSizeSlice";
import {PinIcon, ResizeIcon} from "../../assets/icons/icon";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import TableRow from "./TableRow";
import SummaryRow from "./SummaryRow";
import MultipleUpdateRow from "./MultipleUpdateRow";
import "./style.scss";
import {selectedRowActions} from "../../store/selectedRow/selectedRow.slice";
import CellCheckboxNoSign from "./CellCheckboxNoSign";
import {de} from "date-fns/locale";
import {useTranslation} from "react-i18next";
import {Button} from "@mui/material";

const ObjectDataTable = ({
  data = [],
  loader = false,
  removableHeight,
  additionalRow,
  mainForm,
  remove,
  multipleDelete,
  openFieldSettings,
  fields = [],
  isRelationTable,
  disablePagination,
  currentPage = 1,
  onPaginationChange = () => {},
  pagesCount = 1,
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
  const {i18n} = useTranslation();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const selectedRow = useSelector((state) => state.selectedRow.selected);

  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);

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
    const prevElement = columns?.findIndex((item) => item?.id === colId);

    if (prevElement === 0) {
      return 0;
    } else if (prevElement === 1) {
      const element = document.querySelector(`[id='${columns[prevElement - 1]?.id}']`);
      return element?.offsetWidth;
    } else if (prevElement === 2) {
      const element1 = document.querySelector(`[id='${columns[prevElement - 2]?.id}']`);
      const element2 = document.querySelector(`[id='${columns[prevElement - 1]?.id}']`);
      return element1?.offsetWidth + element2?.offsetWidth;
    } else if (prevElement === 3) {
      const element1 = document.querySelector(`[id='${columns[prevElement - 3]?.id}']`);
      const element2 = document.querySelector(`[id='${columns[prevElement - 2]?.id}']`);
      const element3 = document.querySelector(`[id='${columns[prevElement - 1]?.id}']`);
      return element1?.offsetWidth + element2?.offsetWidth + element3?.offsetWidth;
    } else if (prevElement === 4) {
      const element1 = document.querySelector(`[id='${columns[prevElement - 4]?.id}']`);
      const element2 = document.querySelector(`[id='${columns[prevElement - 3]?.id}']`);
      const element3 = document.querySelector(`[id='${columns[prevElement - 2]?.id}']`);
      const element4 = document.querySelector(`[id='${columns[prevElement - 1]?.id}']`);
      return element1?.offsetWidth + element2?.offsetWidth + element3?.offsetWidth + element4?.offsetWidth;
    } else if (prevElement === 5) {
      const element1 = document.querySelector(`[id='${columns[prevElement - 5]?.id}']`);
      const element2 = document.querySelector(`[id='${columns[prevElement - 4]?.id}']`);
      const element3 = document.querySelector(`[id='${columns[prevElement - 3]?.id}']`);
      const element4 = document.querySelector(`[id='${columns[prevElement - 2]?.id}']`);
      const element5 = document.querySelector(`[id='${columns[prevElement - 1]?.id}']`);
      return element1?.offsetWidth + element2?.offsetWidth + element3?.offsetWidth + element4?.offsetWidth + element5?.offsetWidth;
    }
  };

  useEffect(() => {
    if (!formVisible) {
      dispatch(selectedRowActions.clear());
    }
  }, [formVisible]);

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
      <CTableHead>
        {formVisible && selectedRow.length > 0 && (
          <MultipleUpdateRow
            columns={data}
            fields={columns}
            watch={watch}
            setFormValue={setFormValue}
            control={control}
          />
        )}
        <CTableRow>
          <CellCheckboxNoSign formVisible={formVisible} data={data} />

          {columns.map(
            (column, index) =>
              column?.attributes?.field_permission?.view_permission && (
                <CTableHeadCell
                  id={column.id}
                  key={index}
                  style={{
                    padding: "10px 4px",
                    color: "#747474",
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "normal",
                    minWidth: tableSize?.[pageName]?.[column.id]
                      ? tableSize?.[pageName]?.[column.id]
                      : "auto",
                    width: tableSize?.[pageName]?.[column.id]
                      ? tableSize?.[pageName]?.[column.id]
                      : "auto",
                    position: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[column?.id] ? `${calculateWidthFixedColumn(column.id)}px` : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "1"
                        : "0"
                    }`,
                    // color: formVisible && column?.required === true ? "red" : "",
                  }}
                >
                  <div
                    className="table-filter-cell cell-data"
                    onMouseEnter={(e) => {
                      setCurrentColumnWidth(e.relatedTarget.offsetWidth);
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setColumnId((prev) =>
                          prev === column.id ? "" : column.id
                        );
                      }}
                    >
                      {column.attributes?.[`label_${i18n.language}`] ??
                        column.attributes?.[`title_${i18n.language}`] ??
                        column.label}
                    </span>
                    {disableFilters && (
                      <FilterGenerator
                        field={column}
                        name={column.slug}
                        onChange={filterChangeHandler}
                        filters={filters}
                        tableSlug={tableSlug}
                      />
                    )}
                    {columnId === column?.id && (
                      <div className="cell-popup" ref={popupRef}>
                        <div
                          className="cell-popup-item"
                          onClick={() => handlePin(column?.id, index)}
                        >
                          <PinIcon
                            pinned={
                              tableSettings?.[pageName]?.find(
                                (item) => item?.id === column?.id
                              )?.isStiky
                            }
                          />
                          <span>Pin column</span>
                        </div>
                        <div
                          className="cell-popup-item"
                          onClick={() => handleAutoSize(column?.id, index)}
                        >
                          <ResizeIcon />
                          <span>Autosize</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CTableHeadCell>
              )
          )}

          <PermissionWrapperV2
            tableSlug={isRelationTable ? relatedTableSlug : tableSlug}
            type={["update", "delete"]}
          >
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

          <CTableHeadCell style={{padding: "2px 0", minWidth: "40px"}}>
            <Button
              variant="text"
              style={{borderColor: "#F0F0F0", borderRadius: "0px"}}
              onClick={openFieldSettings}
            >
              <AddRoundedIcon />
              Column
            </Button>
          </CTableHeadCell>
        </CTableRow>
      </CTableHead>
      <CTableBody
        loader={loader}
        columnsCount={columns.length}
        dataLength={dataLength || data?.length}
        title={title}
      >
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
        {!!summaries?.length && (
          <SummaryRow summaries={summaries} columns={columns} data={data} />
        )}
        {additionalRow}
      </CTableBody>
    </CTable>
  );
};

export default ObjectDataTable;
