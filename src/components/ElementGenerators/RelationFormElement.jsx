import { useCallback, useEffect, useMemo, useState } from "react"
import { Controller } from "react-hook-form"
import constructorObjectService from "../../services/constructorObjectService"
import listToOptions from "../../utils/listToOptions"
import FEditableRow from "../FormElements/FEditableRow"
import FRow from "../FormElements/FRow"
import HFSelect from "../FormElements/HFSelect"

const RelationFormElement = ({ control, field, isLayout, sectionIndex, fieldIndex, column, mainForm, ...props }) => {
  const [options, setOptions] = useState([])

  const tableSlug = useMemo(() => {
    return field.id.split("#")?.[0] ?? ""
  }, [field.id])

  const updateOptions = useCallback(() => {
    constructorObjectService
      .getList(tableSlug, { data: { offset: 0, limit: 10 } })
      .then((res) => {
        console.log("REs ==>", res.data.response, tableSlug)
        setOptions(listToOptions(res.data.response, field.slug, "guid"))
      })
  }, [tableSlug])

  useEffect(() => {
    updateOptions()
  }, [updateOptions])

  if (!isLayout)
    return (
      <FRow label={field.label} required={field.required}>
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

  return (
    <Controller
      control={mainForm.control}
      name={`sections[${sectionIndex}].column${column}.[${fieldIndex}].field_name`}
      defaultValue={field.label}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
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
        </FEditableRow>
      )}
    ></Controller>
  )
}

export default RelationFormElement
