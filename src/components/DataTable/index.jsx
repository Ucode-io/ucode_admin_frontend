import { Delete, Edit } from "@mui/icons-material"
import { get } from "@ngard/tiny-get"
import FilterGenerator from "../../views/Objects/components/FilterGenerator"
import RectangleIconButton from "../Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../CTable"
import DeleteWrapperModal from "../DeleteWrapperModal"
import CellElementGenerator from "../ElementGenerators/CellElementGenerator"

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
}) => {
  return (
    <CTable
      disablePagination={disablePagination}
      removableHeight={removableHeight}
      count={pagesCount}
      page={currentPage}
      setCurrentPage={onPaginationChange}
      loader={loader}
    >
      <CTableHead>
        <CTableRow>
          <CTableCell width={10}>№</CTableCell>
          {columns.map((column, index) => (
            <CTableCell key={index}>
              <div className="table-filter-cell">
                {column.label}
                <FilterGenerator
                  field={column}
                  name={column.slug}
                  onChange={filterChangeHandler}
                  filters={filters}
                />
              </div>
            </CTableCell>
          ))}

          {(onDeleteClick || onEditClick) && (
            <CTableCell width={10}></CTableCell>
          )}
        </CTableRow>
      </CTableHead>

      <CTableBody
        loader={loader}
        columnsCount={columns.length}
        dataLength={dataLength || data.length}
      >
        {data?.map((row, rowIndex) => (
          <CTableRow
            key={row.id}
            onClick={() => {
              onRowClick(row, rowIndex)
            }}
          >
             <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
            {columns.map((column, index) => (
              <CTableCell key={column.id} className="text-nowrap">
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
                    <DeleteWrapperModal id={row.guid} onDelete={() => onDeleteClick(row, rowIndex)}>
                      <RectangleIconButton
                        color="error"
                      >
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
  )
}

export default DataTable
