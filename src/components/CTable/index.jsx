import {Paper} from "@mui/material";
import {forwardRef} from "react";
import CPagination from "../CPagination";
import EmptyDataComponent from "../EmptyDataComponent";
import TableLoader from "../TableLoader/index";
import "./style.scss";

export const CTable = ({
  children,
  count,
  selectedObjectsForDelete,
  page,
  setCurrentPage,
  removableHeight = 186,
  disablePagination,
  loader,
  multipleDelete,
  tableStyle = {},
  wrapperStyle = {},
  paginationExtraButton,
  limit,
  setLimit,
  defaultLimit,
  view,
}) => {
  return (
    <Paper className="CTableContainer" style={wrapperStyle}>
      <div
        className="table"
        style={{
          height: removableHeight
            ? `calc(100vh - ${removableHeight}px)`
            : "auto",
          overflow: loader ? "hidden" : "auto",
          ...tableStyle,
        }}
      >
        <table id="resizeMe">{children}</table>
      </div>

      {!disablePagination && (
        <CPagination
          count={count}
          selectedObjectsForDelete={selectedObjectsForDelete}
          page={page}
          setCurrentPage={setCurrentPage}
          paginationExtraButton={paginationExtraButton}
          limit={limit}
          multipleDelete={multipleDelete}
          setLimit={setLimit}
          defaultLimit={defaultLimit}
          view={view}
        />
      )}
    </Paper>
  );
};

export const CTableHead = ({children}) => {
  return <thead className="CTableHead">{children}</thead>;
};

export const CTableHeadRow = ({children}) => {
  return <tr className="CTableHeadRow">{children}</tr>;
};

export const CTableHeadCell = ({
  children,
  className = "",
  buttonsCell = false,
  ...props
}) => {
  return <th {...props}>{children}</th>;
};

export const CTableBody = forwardRef(
  (
    {
      children,
      columnsCount,
      loader,
      title,
      selectedObjectsForDelete,
      dataLength,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <TableLoader
          isVisible={loader}
          columnsCount={columnsCount}
          rowsCount={dataLength || 3}
        />

        <tbody className="CTableBody" {...props} ref={ref}>
          {children}
          <EmptyDataComponent
            columnsCount={columnsCount}
            isVisible={!dataLength}
            title={title}
          />
        </tbody>
      </>
    );
  }
);

export const CTableRow = ({children, className, ...props}) => {
  return (
    <tr className={`CTableRow ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const CTableCell = ({
  children,
  className = "",
  buttonsCell = false,
  ...props
}) => {
  return (
    <td
      className={`CTableCell ${className} ${buttonsCell ? "buttonsCell" : ""}`}
      {...props}
    >
      {children}
    </td>
  );
};
