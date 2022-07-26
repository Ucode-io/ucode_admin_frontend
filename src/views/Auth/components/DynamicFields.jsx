import { SupervisedUserCircle } from "@mui/icons-material"
import { InputAdornment } from "@mui/material"
import { useMemo } from "react"
import { useQuery } from "react-query"
import HFSelect from "../../../components/FormElements/HFSelect"
import constructorTableService from "../../../services/constructorTableService"
import classes from "../style.module.scss"

const DynamicFields = ({ control, table = {} }) => {

  // const { data } = useQuery(["GET_TABLE_DATA", table.slug], () => {
  //   return constructorTableService.getById(table.slug)
  // })

  console.log("TABLE ===>", table)

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
        name={`${table.slug}_id`}
        size="large"
        fullWidth
        options={computedOptions}
        placeholder="Выберите тип пользователя"
        startAdornment={
          <InputAdornment position="start">
            <SupervisedUserCircle style={{ fontSize: "30px" }} />
          </InputAdornment>
        }
      />
    </div>
  )
}

export default DynamicFields
