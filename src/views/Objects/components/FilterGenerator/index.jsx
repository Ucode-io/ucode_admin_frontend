import { DatePicker } from "@mui/lab"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { useMemo } from "react"
import TableColumnFilter from "../../../../components/TableColumnFilter"
import TableOrderingButton from "../../../../components/TableOrderingButton"

const FilterGenerator = ({ field, name, filters = {}, onChange }) => {
  const orderingType = useMemo(
    () => filters.order?.[name],
    [filters.order, name]
  )

  const onOrderingChange = (value) => {
    if (!value) return onChange(value, "order")
    const data = {
      [name]: value,
    }
    onChange(data, "order")
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TableOrderingButton value={orderingType} onChange={onOrderingChange} />
      <Filter field={field} name={name} filters={filters} onChange={onChange} />
    </div>
  )
}

export default FilterGenerator

const Filter = ({ field, name, filters = {}, onChange }) => {
  const computedOptions = useMemo(() => {
    if (!field.attributes?.options) return []

    return field.attributes.options.map((option) => ({
      value: option,
      label: option,
    }))
  }, [field.attributes?.options])

  switch (field.type) {
    // case "PHONE":
    //   return (
    //     <TableColumnFilter>
    //       <ReactInputMask
    //         value={filters[name] ?? undefined}
    //         onChange={(e) => onChange(e.target.value, name)}
    //         mask={"(99) 999-99-99"}
    //       >
    //         {(inputProps) => (
    //           <TextField
    //             placeholder={field.attributes?.placeholder}
    //             fullWidth
    //             size="small"
    //             {...inputProps}
    //           />
    //         )}
    //       </ReactInputMask>
    //     </TableColumnFilter>
    //   )

    case "PICK_LIST":
      return (
        <TableColumnFilter>
          <FormControl style={{ width: "100%" }}>
            <InputLabel size="small">{}</InputLabel>
            <Select
              value={filters[name] ?? ""}
              onChange={(e) => onChange(e.target.value, name)}
              size="small"
              fullWidth
            >
              {computedOptions?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableColumnFilter>
      )

    case "DATE":
      return (
        <TableColumnFilter>
          <DatePicker
            inputFormat="dd.MM.yyyy"
            mask="__.__.____"
            toolbarFormat="dd.MM.yyyy"
            value={filters[name] ?? ""}
            onChange={(val) => onChange(val, name)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={false}
                style={{ width: "100%" }}
                size="small"
              />
            )}
          />
        </TableColumnFilter>
      )

    case "NUMBER":
      return (
        <TableColumnFilter>
          <TextField
            fullWidth
            size="small"
            placeholder={field.label}
            type="number"
            value={filters[name] ?? ""}
            onChange={(e) =>
              onChange(Number(e.target.value) || undefined, name)
            }
          />
        </TableColumnFilter>
      )

    default:
      return (
        <TableColumnFilter>
          <TextField
            fullWidth
            size="small"
            placeholder={field.label}
            value={filters[name] ?? ""}
            onChange={(e) => onChange(e.target.value, name)}
          />
        </TableColumnFilter>
      )
  }
}
