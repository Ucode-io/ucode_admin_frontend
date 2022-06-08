import { format } from "date-fns"
import { useEffect, useId, useMemo, useState } from "react"
import constructorObjectService from "../../services/constructorObjectService"
import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import useDebouncedWatch from "../../hooks/useDebouncedWatch"
import FRow from "../FormElements/FRow"
import { Controller } from "react-hook-form"
import FEditableRow from "../FormElements/FEditableRow"

const RelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  mainForm,
  ...props
}) => {
  const tableSlug = useMemo(() => {
    return field.id.split("#")?.[0] ?? ""
  }, [field.id])

  // const { data: options } = useQuery(["GET_OBJECT_LIST", tableSlug], () => constructorObjectService.getList(tableSlug, { data: {} }), {
  //   select: ({data}) => {
  //     if(field.type === "DATE") data.response.forEach(el => { el[field.slug] = format(new Date(el[field.slug]), 'dd.MM.yyyy') })
  //     if(field.type === "DATE_TIME") data.response.forEach(el => { el[field.slug] = format(new Date(el[field.slug]), 'dd.MM.yyyy HH:mm') })

  //     return listToOptions(data.response, field.slug, "guid")
  //   }
  // })

  if (!isLayout)
    return (
      <FRow label={field.label} required={field.required}>
        <Controller
          control={control}
          name={`${tableSlug}_id`}
          defaultValue={null}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AutoCompleteElement
              value={value}
              setValue={onChange}
              field={field}
              tableSlug={tableSlug}
            />
          )}
        />
      </FRow>
    )

  return (
    <Controller
      control={mainForm.control}
      name={`sections[${sectionIndex}].fields.[${fieldIndex}].field_name`}
      defaultValue={field.label}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
          required={field.required}
        >
          <Controller
            control={control}
            name={`${tableSlug}_id`}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AutoCompleteElement
                value={value}
                setValue={onChange}
                field={field}
                tableSlug={tableSlug}
              />
            )}
          />
        </FEditableRow>
      )}
    ></Controller>
  )
}

const AutoCompleteElement = ({ field, value, tableSlug, setValue }) => {
  const [loader, setLoader] = useState(false)

  const [options, setOptions] = useState([])
  const id = useId()
  const [searchText, setSearchText] = useState("")

  const getOptionLabel = (option) => {
    let label = ""

    field.attributes?.fields?.forEach((el) => {
      let value = ""

      if (el.type === "DATE")
        value = format(new Date(option[el.slug]), "dd.MM.yyyy")
      else if (el.type === "DATE_TIME")
        value = format(new Date(option[el.slug]), "dd.MM.yyyy HH:mm")
      else value = option[el.slug]

      label += `${value ?? ""} `
    })

    return label
  }

  const computedValue = useMemo(() => {
    return options.find((el) => el.guid === value) ?? null
  }, [options, value])

  const getOptions = () => {
    setLoader(true)
    constructorObjectService
      .getList(tableSlug, { data: { search: searchText } })
      .then((res) => setOptions(res.data.response ?? []))
      .finally(() => setLoader(false))
  }

  const getValueOption = () => {
    setLoader(true)
    constructorObjectService
      .getById(tableSlug, value)
      .then((res) => {
        setOptions([res.data.response])
      })
      .finally(() => setLoader(false))
  }

  useDebouncedWatch(
    () => {
      getOptions()
    },
    [searchText],
    500
  )

  useEffect(() => {
    if (value) getValueOption()
    else getOptions()
  }, [])

  return (
    <Autocomplete
      id={id}
      options={options}
      getOptionLabel={getOptionLabel}
      // isOptionEqualToValue={(option, value) => {
      //   console.log("llllll ===>", option, value)
      //   return option.guid === value.guid
      // }}
      onInputChange={(event, newInputValue) => {
        setSearchText(newInputValue)
      }}
      filterOptions={(x) => x}
      value={computedValue}
      loading={loader}
      onChange={(event, newValue) => {
        setValue(newValue?.guid ?? null)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loader ? <CircularProgress color="primary" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default RelationFormElement

// const RelationFormElement = ({ control, field, isLayout, sectionIndex, fieldIndex, column, mainForm, ...props }) => {

//   const tableSlug = useMemo(() => {
//     return field.id.split("#")?.[0] ?? ""
//   }, [field.id])

//   const { data: options } = useQuery(["GET_OBJECT_LIST", tableSlug], () => constructorObjectService.getList(tableSlug, { data: {} }), {
//     select: ({data}) => {
//       if(field.type === "DATE") data.response.forEach(el => { el[field.slug] = format(new Date(el[field.slug]), 'dd.MM.yyyy') })
//       if(field.type === "DATE_TIME") data.response.forEach(el => { el[field.slug] = format(new Date(el[field.slug]), 'dd.MM.yyyy HH:mm') })

//       return listToOptions(data.response, field.slug, "guid")
//     }
//   })

//   if (!isLayout)
//     return (
//       <FRow label={field.label} required={field.required}>
//         <HFSelect
//           control={control}
//           name={`${tableSlug}_id`}
//           width="100%"
//           options={options}
//           required={field.required}
//           {...props}
//         />
//       </FRow>
//     )

//   return (
//     <Controller
//       control={mainForm.control}
//       name={`sections[${sectionIndex}].column${column}.[${fieldIndex}].field_name`}
//       defaultValue={field.label}
//       render={({ field: { onChange, value }, fieldState: { error } }) => (
//         <FEditableRow
//           label={value}
//           onLabelChange={onChange}
//           required={field.required}
//         >
//           <HFSelect
//             control={control}
//             name={`${tableSlug}_id`}
//             width="100%"
//             // options={options}
//             required={field.required}
//             {...props}
//           />
//         </FEditableRow>
//       )}
//     ></Controller>
//   )
// }

// export default RelationFormElement
