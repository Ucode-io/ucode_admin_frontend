import { useEffect, useMemo, useState } from "react"
import HFSelect from "../../../components/FormElements/HFSelect"
import classes from "../style.module.scss"

const DynamicFields = ({ control, setValue, table = {}, index }) => {
  const [selectedCollection, setSelectedCollection] = useState(null)

  useEffect(() => {
    setValue(
      "tables[0].object_id",
      table.find((item) => item.table_slug === selectedCollection)?.guid
    )
    setValue("tables[0].table_slug", selectedCollection)
  }, [selectedCollection])

  const computedOptions = useMemo(() => {
    return table?.map((field) => ({
      value: field.table_slug,
      label: field.name,
    }))
  }, [table])

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFSelect
        control={control}
        name="tables[0].table_slug"
        size="large"
        value={selectedCollection}
        fullWidth
        options={computedOptions}
        onChange={(e, val) => {
          setSelectedCollection(e)
        }}
        placeholder={table.label}
      />
    </div>
  )
}

export default DynamicFields
