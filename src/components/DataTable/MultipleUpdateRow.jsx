import { CTableCell } from "../CTable"
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator"
import "./style.scss"

const MultipleUpdateRow = ({
  columns,
  fields,
  selected,
  watch,
  control,
  setFormValue,
}) => {
  return (
    <tr className="multipleRow">
      <CTableCell
        style={{
          padding: "10px 20px 4px",
        }}
      ></CTableCell>
      <CTableCell
        style={{
          padding: "10px 20px 4px",
          color: "#fff",
        }}
      >
        *
      </CTableCell>

      {fields.map((field, index) => (
        <CTableCell
          key={field.id}
          style={{
            padding: 0,
          }}
        >
          <CellFormElementGenerator
            isBlackBg
            columns={columns}
            selected={selected}
            index="*"
            watch={watch}
            control={control}
            setFormValue={setFormValue}
            field={{ ...field, required: false }}
            row={{}}
          />
        </CTableCell>
      ))}
    </tr>
  )
}

export default MultipleUpdateRow
