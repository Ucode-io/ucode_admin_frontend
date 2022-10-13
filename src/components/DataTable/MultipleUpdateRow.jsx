import { CTableCell } from "../CTable"
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator"
import "./style.scss"
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"

const MultipleUpdateRow = ({
  columns,
  isCollapsed,
  fields,
  selected,
  watch,
  control,
  setFormValue,
}) => {
  return (
    <tr
      className="multipleRow"
      style={{
        height: isCollapsed ? "100%" : "0",
      }}
    >
      <CTableCell
        style={{
          padding: 0,
          color: "#fff",
          textAlign: "center",
          display: isCollapsed ? "" : "none",
        }}
      >
        <BorderColorOutlinedIcon style={{ paddingBottom: 3 }} />
      </CTableCell>

      {fields.map((field, index) => (
        <CTableCell
          key={field.id}
          style={{
            padding: 0,
            display: isCollapsed ? "" : "none",
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
