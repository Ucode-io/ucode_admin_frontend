import { Paper } from "@mui/material"
import { forwardRef } from "react"
import CPagination from "../CPagination"
import EmptyDataComponent from "../EmptyDataComponent"
import TableLoader from "../TableLoader/index"
import "./style.scss"

export const CTable = ({ children, count, page, setCurrentPage, removableHeight = 186, disablePagination, loader }) => {
  return (
    <Paper className="CTableContainer">
      <div className="table" style={{ height: removableHeight ? `calc(100vh - ${removableHeight}px)` : 'auto', overflow: loader ? 'hidden' : 'auto' }} >
        <table>{children}</table>
      </div>
      
      {!disablePagination && <CPagination count={count} page={page} setCurrentPage={setCurrentPage} />}
    </Paper>
  )
}

export const CTableHead = ({ children }) => {
  return <thead className="CTableHead">{children}</thead>
}

export const CTableHeadRow = ({ children }) => {
  return <tr className="CTableHeadRow">{children}</tr>
}

export const CTableBody = forwardRef(({ children, columnsCount, loader, dataLength, ...props }, ref) => {

  return (
    <>
    <TableLoader isVisible={loader} columnsCount={columnsCount} rowsCount={dataLength || 3}  />

    <tbody className="CTableBody" {...props} ref={ref} >
      {children}
      <EmptyDataComponent columnsCount={columnsCount} isVisible={!dataLength}  />
    </tbody>
    </>
  )
})

export const CTableRow = ({ children, ...props }) => {
  return <tr className="CTableRow" {...props} >{children}</tr>
}

export const CTableCell = ({ children, className="", ...props }) => {
  return (
    <td className={`CTableCell ${className}`} {...props}>
      {children}
    </td>
  )
}
