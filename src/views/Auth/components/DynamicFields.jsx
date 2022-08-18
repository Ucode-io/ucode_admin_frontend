import { useMemo } from "react"
import HFSelect from "../../../components/FormElements/HFSelect"
import classes from "../style.module.scss"

const DynamicFields = ({ control, table = {}, index }) => {
  console.log("table", table?.data?.fields)
  // console.log('table', table);

  const computedOptions = useMemo(() => {
    return table?.data?.fields?.map((field) => ({
      value: field.slug,
      label: field.label,
    }))
  }, [table])

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFSelect
        control={control}
        name={`tables.${table.slug}`}
        size="large"
        fullWidth
        options={computedOptions}
        placeholder={table.label}
      />
    </div>
  )
}

export default DynamicFields
