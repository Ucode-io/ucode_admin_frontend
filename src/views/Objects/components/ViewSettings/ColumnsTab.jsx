import { Checkbox } from "@mui/material"
import { useWatch } from "react-hook-form"
import { CTable, CTableBody, CTableCell, CTableRow } from "../../../../components/CTable"

const ColumnsTab = ({ columns, form }) => {
  const selectedColumns = useWatch({
    control: form.control,
    name: "columns",
  })

  const onCheckboxChange = (val, id) => {
    const computedValue = [...selectedColumns]

    if (val) {
      computedValue.push(id)
    } else {
      const index = selectedColumns.findIndex((el) => el === id)
      computedValue.splice(index, 1)
    }

    form.setValue('columns', computedValue)
  }

  return (
    <div>
      <CTable
        removableHeight={false}
        disablePagination
        tableStyle={{ border: "none" }}
      >
        <CTableBody dataLength={1}>
          {columns.map((column) => (
            <CTableRow key={column.id} >
              <CTableCell>{column.label}</CTableCell>
              <CTableCell style={{ width: 20 }}>
                <Checkbox
                  checked={selectedColumns.includes(column.id)}
                  onChange={(e, val) => onCheckboxChange(val, column.id)}
                />
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default ColumnsTab
