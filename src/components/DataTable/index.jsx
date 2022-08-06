import { useEffect } from "react";
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

  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isResizeble) return;
    // document.addEventListener("DOMContentLoaded", function () {
    const createResizableTable = function (table) {
      if (!table) return;
      console.log("TABLE", table);
      const cols = table.querySelectorAll("th");
      console.log("TH", cols);
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
        const colSlug = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({ pageName, colSlug, colWidth }));
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
    // });
  }, []);


  

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
              }}
            >
              <div className="table-filter-cell">
                {column.label}
                {!disableFilters && (
                  <FilterGenerator
                    field={column}
                    name={column.slug}
                    onChange={filterChangeHandler}
                    filters={filters}
                    tableSlug={tableSlug}
                  />
                )}
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
            key={row.id}
            onClick={() => {
              onRowClick(row, rowIndex);
            }}
          >
            <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
            {columns.map((column, index) => (
              <CTableCell
                key={column.id}
                className="overflow-ellipsis"
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
