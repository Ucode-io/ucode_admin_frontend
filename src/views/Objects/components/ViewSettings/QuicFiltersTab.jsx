import { Checkbox } from "@mui/material"
import { useFieldArray } from "react-hook-form"
import CSelect from "../../../../components/CSelect"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../../components/CTable"

const QuickFiltersTab = ({ columns, form }) => {
  const { fields: quickFilters, append, remove } = useFieldArray({
    control: form.control,
    name: "quick_filters",
    keyName: 'key'
  })

  const onCheckboxChange = (val, id) => {
    if(val) {
      append({
        default_value: "",
        field_id: id,
      })
    }
    else {
      const index = quickFilters.findIndex(({ field_id }) => field_id === id)
      remove(index)
    }
  }

  return (
    <div>
      <CTable
        removableHeight={false}
        disablePagination
        tableStyle={{ border: "none" }}
      >
        <CTableBody dataLength={1}>
          {columns.map((column, index) => (
            <QuickFilterRow key={column.id} column={column} index={index} onCheckboxChange={onCheckboxChange} quickFilters={quickFilters} />
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

const QuickFilterRow = ({column, onCheckboxChange, quickFilters}) => {
  const isActive = quickFilters.some(({ field_id }) => field_id === column.id)


  return (
    <CTableRow>
      <CTableCell>{column.label}</CTableCell>
      <CTableCell style={{ width: 20 }}>
        <Checkbox checked={isActive} onChange={(e, val) => onCheckboxChange(val, column.id)} />
      </CTableCell>
      <CTableCell style={{ width: 250 }} >
        {isActive && <CSelect disabledHelperText />}
      </CTableCell>
    </CTableRow>
  )
}

export default QuickFiltersTab
