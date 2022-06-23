import { Delete, Edit } from "@mui/icons-material"
import { get } from "@ngard/tiny-get"
import RectangleIconButton from "../Buttons/RectangleIconButton"
import { CTable, CTableBody, CTableCell, CTableRow } from "../CTable"
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
      <CTableRow>
        {columns.map((column, index) => (
          <CTableCell key={index}>
            <div className="table-filter-cell">
              {column.label}
              {/* <FilterGenerator
                field={field}
                name={field.slug}
                onChange={filterChangeHandler}
                filters={filters}
              /> */}
            </div>
          </CTableCell>
        ))}

        {(onDeleteClick || onEditClick) && <CTableCell width={10}></CTableCell>}
      </CTableRow>

      <CTableBody
        loader={loader}
        columnsCount={columns.length}
        dataLength={dataLength || data.length}
      >
        {data?.map((row, index) => (
          <CTableRow key={row.id}>
            {columns.map((column, index) => (
              <CTableCell key={column.id} className="text-nowrap">
                <CellElementGenerator
                  field={column}
                  row={row}
                />
              </CTableCell>
            ))}

            {(onDeleteClick || onEditClick) && (
              <CTableCell>
                <div className="flex">
                  {onEditClick && (
                    <RectangleIconButton
                      color="success"
                      className="mr-1"
                      onClick={() => onEditClick(row, index)}
                    >
                      <Edit color="success" />
                    </RectangleIconButton>
                  )}
                  {onDeleteClick && (
                    <RectangleIconButton
                      color="error"
                      onClick={() => onDeleteClick(row, index)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
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
