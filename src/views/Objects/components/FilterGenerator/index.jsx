import { DatePicker } from "@mui/lab"
import { FormControl, InputLabel, TextField } from "@mui/material"
import { useMemo } from "react"
import CSelect from "../../../../components/CSelect"
import TableColumnFilter from "../../../../components/TableColumnFilter"
import TableOrderingButton from "../../../../components/TableOrderingButton"
import DefaultFilter from "./DefaultFilter"

const FilterGenerator = ({ field, name, filters = {}, onChange, tableSlug }) => {
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
      <Filter field={field} name={name} filters={filters} onChange={onChange} tableSlug={tableSlug} />
    </div>
  )
}

export default FilterGenerator

const Filter = ({ field = {}, name, filters = {}, onChange , tableSlug}) => {
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
            <CSelect
              value={filters[name] ?? ""}
              onChange={(e) => onChange(e.target.value, name)}
              size="small"
              fullWidth
              disabledHelperText
              options={computedOptions}
              placeholder={field.label}
            />
          </FormControl>
        </TableColumnFilter>
      )

    case "PHOTO": return null

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

    case "SWITCH":
      return (
        <TableColumnFilter>
          <CSelect
            fullWidth
            placeholder={field.label}
            value={filters[name] ?? ""}
            disabledHelperText
            options={[
              {
                label: field.attributes?.text_true ?? "Да",
                value: "true",
              },
              {
                label: field.attributes?.text_false ?? "Нет",
                value: "false",
              },
            ]}
            onChange={(e) => onChange(e.target.value, name)}
          />
        </TableColumnFilter>
      )

    default:
      return (
        <TableColumnFilter>
          <DefaultFilter
            field={field}
            filters={filters}
            onChange={onChange}
            name={name}
            tableSlug={tableSlug}
          />
        </TableColumnFilter>
      )
  }
}
