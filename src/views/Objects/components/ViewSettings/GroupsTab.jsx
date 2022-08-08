import { Checkbox } from "@mui/material"
import { useWatch } from "react-hook-form"
import { CTable, CTableBody, CTableCell, CTableRow } from "../../../../components/CTable"

const GroupsTab = ({ columns, form }) => {
  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  })

  const onCheckboxChange = (val, id) => {
    let computedValue = []
    if (val) {
      computedValue = [id]
    }
    form.setValue('group_fields', computedValue)
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

export default GroupsTab
