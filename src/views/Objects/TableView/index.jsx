import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator"
import FilterGenerator from "../components/FilterGenerator"
import { get } from "@ngard/tiny-get"
import FiltersBlock from "../../../components/FiltersBlock"
import ColumnsSelector from "../components/ColumnsSelector"
import TableCard from "../../../components/TableCard"

const TableView = ({
  computedColumns,
  filterChangeHandler,
  filters,
  tableLoader,
  tableData,
  navigateToEditPage,
  tableSlug,
}) => {
  return (
    <>
      <FiltersBlock extra={<ColumnsSelector tableSlug={tableSlug} />} />
      <TableCard>
        <CTable>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            {computedColumns.map((field) => (
              <CTableCell key={field.id}>
                {field.label}
                <FilterGenerator
                  field={field}
                  name={field.slug}
                  onChange={filterChangeHandler}
                  filters={filters}
                />
              </CTableCell>
            ))}
          </CTableHead>

          <CTableBody
            loader={tableLoader}
            columnsCount={computedColumns.length + 1}
            dataLength={tableData.length}
          >
            {tableData.map((row, rowIndex) => (
              <CTableRow
                key={row.guid}
                onClick={() => navigateToEditPage(row.guid)}
              >
                <CTableCell>{rowIndex + 1}</CTableCell>
                {computedColumns.map((field) => (
                  <CTableCell key={field.id} className="text-nowrap">
                    <CellElementGenerator
                      type={field.type}
                      value={get(row, field.slug, "")}
                    />
                  </CTableCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </>
  )
}

export default TableView
