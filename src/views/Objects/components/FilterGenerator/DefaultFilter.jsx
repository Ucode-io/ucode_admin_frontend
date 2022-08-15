import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useId } from "react";
import { useState } from "react";
import { useQuery } from "react-query"
import useDebounce from "../../../../hooks/useDebounce";
import constructorObjectService from "../../../../services/constructorObjectService"

const DefaultFilter = ({ field, filters, onChange, name, tableSlug }) => {
  const {id} = useId()
  const [searchText, setSearchText] = useState("");

  const { data: options, isLoading } = useQuery(["GET_OBJECT_LIST", tableSlug, searchText], () => {
    if (!tableSlug) return null
    return constructorObjectService.getList(tableSlug, {
      data: { offset: 0, limit: 10, [field.slug]: searchText },
    })
  }, { select: ({data}) => {
    return [...new Set(data.response?.map(el => el[field.slug]) ?? [])].filter(el => el)
  } })

  const search = useDebounce((_, searchText) => {
    setSearchText(searchText)
  }, 400)

  return (
    <Autocomplete
      id={id}
      multiple
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options ?? []}
      loading={isLoading}
      size="small"
      value={filters[name] ?? []}
      onInputChange={search}
      onChange={(e, val) => onChange(val ?? null, name)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={field.label}
          // label="Asynchronous"
          size="small"
          InputProps={{
            ...params.InputProps,
            style: filters[name]?.length ? { paddingTop: 3, paddingBottom: 3 } : {},
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default DefaultFilter
