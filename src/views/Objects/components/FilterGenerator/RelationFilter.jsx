import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useId, useMemo } from "react"
import { useQuery } from "react-query"
import constructorObjectService from "../../../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../../../utils/getRelationFieldLabel"
import FilterAutoComplete from "./FilterAutocomplete"

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const { id } = useId()

  const { data: options, isLoading } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug: field.table_slug, filters: {} }],
    () => {
      return constructorObjectService.getList(field.table_slug, { data: {} })
    },
    {
      select: (res) => {
        return (
          res?.data?.response?.map((el) => ({
            label: getRelationFieldTabsLabel(field, el),
            value: el.guid,
          })) ?? []
        )
      },
    }
  )

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option)
  }

  // const computedValue = useMemo(() => {
  //   if(!Array.isArray(filters[name])) return []

  //   return filters[name].map((filterValue) => {
  //     return options?.find(option => option.guid === filterValue)
  //   })?.filter(el => el)
  // }, [options, filters, name])

  return (
    <FilterAutoComplete
      value={filters[name] ?? []}
      onChange={(val) => onChange(val?.length ? val : null, name)}
      options={options}
      label={field.label}
    />
  )

  // return (
  //   <Autocomplete
  //     id={id}
  //     // isOptionEqualToValue={(option, value) => option.value === value.value}
  //     getOptionLabel={getOptionLabel}
  //     options={options ?? []}
  //     loading={isLoading}
  //     value={computedValue}
  //     multiple
  //     size="small"
  //     // onInputChange={search}
  //     onChange={(e, val) => onChange(val?.length ? val?.map(el => el.guid) : null, name)}
  //     isOptionEqualToValue={(option, value) => {
  //       return option.guid === value.guid
  //     }}
  //     renderInput={(params) => (
  //       <TextField
  //         {...params}
  //         placeholder={field.label}
  //         size="small"
  //         InputProps={{
  //           ...params.InputProps,
  //           style: computedValue?.length ? { paddingTop: 3, paddingBottom: 3 } : {},
  //           endAdornment: (
  //             <>
  //               {isLoading ? (
  //                 <CircularProgress color="inherit" size={20} />
  //               ) : null}
  //               {params.InputProps.endAdornment}
  //             </>
  //           ),
  //         }}
  //       />
  //     )}
  //   />
  // )
}

export default RelationFilter
