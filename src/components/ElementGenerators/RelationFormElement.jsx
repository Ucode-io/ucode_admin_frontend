import { useCallback, useEffect, useMemo, useState } from "react"
import constructorObjectService from "../../services/constructorObjectService"
import listToOptions from "../../utils/listToOptions"
import FRow from "../FormElements-backup/FRow"
import HFSelect from "../FormElements/HFSelect"

const RelationFormElement = ({ control, field, ...props }) => {
  const [options, setOptions] = useState([])

  const tableSlug = useMemo(() => {
    return field.id.split("#")?.[0] ?? ""
  }, [field.id])

  const updateOptions = useCallback(() => {
    constructorObjectService
      .getList(tableSlug, { data: { offset: 0, limit: 10 } })
      .then((res) => {
        console.log("REs ==>", res.data.response, tableSlug)
        setOptions(listToOptions(res.data.response, field.slug, 'guid'))
      })
  }, [tableSlug])

  console.log("OPTIONS ==>", options)

  useEffect(() => {
    updateOptions()
  }, [updateOptions])

  return (
    <FRow
      label={`${field.label}  (${tableSlug})`}
      required={field.required}
    >
      <HFSelect
        control={control}
        name={`${tableSlug}_id`}
        width="100%"
        options={options}
        required={field.required}
        {...props}
      />
    </FRow>
  )
}

export default RelationFormElement
