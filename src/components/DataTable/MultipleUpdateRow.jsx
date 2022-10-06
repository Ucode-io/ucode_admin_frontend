import { CTableCell, CTableRow } from "../CTable"
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator"

const MultipleUpdateRow = ({ columns, watch, control, setFormValue }) => {
  return (
    <CTableRow className="amountRow">
      <CTableCell
        style={{
          padding: "10px 20px 4px",
          backgroundColor: "#e3e3e3",
        }}
      >
        *
      </CTableCell>

      {columns.map((column, index) => (
        <CTableCell
          key={column.id}
          style={{
            padding: 0,
            backgroundColor: "#e3e3e3",
          }}
        >
          <CellFormElementGenerator
            columns={columns}
            index="*"
            watch={watch}
            control={control}
            setFormValue={setFormValue}
            field={column}
            row={{}}
          />
        </CTableCell>
      ))}
    </CTableRow>
  )
}

export default MultipleUpdateRow
