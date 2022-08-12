import { useEffect, useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import FilterGenerator from "../../views/Objects/components/FilterGenerator";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../CTable";
import DeleteWrapperModal from "../DeleteWrapperModal";
import CellElementGenerator from "../ElementGenerators/CellElementGenerator";
import { useDispatch, useSelector } from "react-redux";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import { useLocation } from "react-router-dom";
import "./style.scss";
import { PinIcon, ResizeIcon } from "../../assets/icons/icon";
import OutsideClickHandler from "react-outside-click-handler";

const DataTable = ({
  data = [],
  loader = false,
  removableHeight,
  disablePagination,
  currentPage = 1,
  onPaginationChange = () => {},
  pagesCount = 1,
  columns = [],
  additionalRow,
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
}) => {
  const location = useLocation();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);

  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];
  const dispatch = useDispatch();
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
  }, []);

  const handleAutoSize = (colID,colIdx) => {
    dispatch(
      tableSizeAction.setTableSize({ pageName, colID, colWidth: "auto" })
    );
    const element = document.getElementById(colID);
    element.style.width = "auto";
    element.style.minWidth = "auto";
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: element.offsetWidth,
        isStiky: 'ineffective',
        colIdx
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
      return (
        tableSettings?.[pageName]
          ?.filter((item) => item?.isStiky === true)
          ?.slice(0, colIdx)
          ?.reduce((acc, item) => acc + item?.colWidth, 0)
      );
    }
  };

  return (
    <CTable
      disablePagination={disablePagination}
      removableHeight={removableHeight}
      count={pagesCount}
      page={currentPage}
      setCurrentPage={onPaginationChange}
      loader={loader}
      tableStyle={tableStyle}
      wrapperStyle={wrapperStyle}
    >
      <CTableHead>
        <CTableRow>
          <CTableHeadCell width={10}>№</CTableHeadCell>
          {columns.map((column, index) => (
            <CTableHeadCell
              id={column.id}
              key={index}
              style={{
                minWidth: tableSize?.[pageName]?.[column.id]
                  ? tableSize?.[pageName]?.[column.id]
                  : "auto",
                width: tableSize?.[pageName]?.[column.id]
                  ? tableSize?.[pageName]?.[column.id]
                  : "auto",
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
              <div
                className="table-filter-cell cell-data"
                onMouseEnter={(e) => {
                  setCurrentColumnWidth(e.relatedTarget.offsetWidth);
                }}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setColumnId((prev) =>
                      prev === column.id ? "" : column.id
                    );
                  }}
                >
                  {column.label}
                </span>
                {!disableFilters && (
                  <FilterGenerator
                    field={column}
                    name={column.slug}
                    onChange={filterChangeHandler}
                    filters={filters}
                    tableSlug={tableSlug}
                  />
                )}
                {columnId === column?.id ? (
                  <div className="cell-popup">
                    <OutsideClickHandler onOutsideClick={() => setColumnId("")}>
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
                    </OutsideClickHandler>
                  </div>
                ) : null}
              </div>
            </CTableHeadCell>
          ))}

          {(onDeleteClick || onEditClick) && (
            <CTableHeadCell width={10}></CTableHeadCell>
          )}
        </CTableRow>
      </CTableHead>

      <CTableBody
        loader={loader}
        columnsCount={columns.length}
        dataLength={dataLength || data?.length}
      >
        {data?.map((row, rowIndex) => (
          <CTableRow
            key={row.guid || row.id}
            onClick={() => {
              onRowClick(row, rowIndex);
            }}
          >
            <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
            {columns.map((column, index) => (
              <CTableCell
                key={column.id}
                className="overflow-ellipsis"
                style={{
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

            {(onDeleteClick || onEditClick) && (
              <CTableCell>
                <div className="flex">
                  {onEditClick && (
                    <RectangleIconButton
                      color="success"
                      className="mr-1"
                      onClick={() => onEditClick(row, rowIndex)}
                    >
                      <Edit color="success" />
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
          </CTableRow>
        ))}

        {additionalRow}
      </CTableBody>
    </CTable>
  );
};

export default DataTable;
