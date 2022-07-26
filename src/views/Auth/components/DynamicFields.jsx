import { useMemo } from "react"
import HFSelect from "../../../components/FormElements/HFSelect"
import classes from "../style.module.scss"

const DynamicFields = ({ control, table = {}, index }) => {


  const computedOptions = useMemo(() => {
    return table?.data?.response?.map(el => {
      const label = table.view_field?.map(field => {
        return `${el[field]} `
      })?.join(" ")

      return {
        label,
        value: el.guid,
      }
    }) ?? []
  }, [table])

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFSelect
        // required
        control={control}
        name={`tables.${table.slug}`}
        size="large"
        fullWidth
        options={computedOptions}
        placeholder={table.label}
        // startAdornment={
        //   <InputAdornment position="start">
        //     <SupervisedUserCircle style={{ fontSize: "30px" }} />
        //   </InputAdornment>
        // }
      />
    </div>
  )
}

export default DynamicFields
