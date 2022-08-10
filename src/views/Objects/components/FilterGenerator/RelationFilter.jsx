import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useId, useState } from "react"
import { useQuery } from "react-query"
import useDebounce from "../../../../hooks/useDebounce"
import constructorObjectService from "../../../../services/constructorObjectService"
import { getRelationFieldLabel, getRelationFieldTabsLabel } from "../../../../utils/getRelationFieldLabel"

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const { id } = useId()
  const [searchText, setSearchText] = useState("")
  

  const { data: options, isLoading } = useQuery(
    ["GET_OBJECT_LIST", field.table_slug, searchText],
    () => {
      if (!field.table_slug) return null
      return constructorObjectService.getList(field.table_slug, {
        data: { offset: 0, limit: 10, [field.slug]: searchText },
      })
    },
    {
      select: ({ data }) => {
        const result = {}

        data.response?.forEach((el) => {
          result[el.guid] = {
            label: getRelationFieldTabsLabel(field, el),
            value: el.guid,
          }
        })

        return Object.values(result)
      },
    }
  )

  const search = useDebounce((_, searchText) => {
    setSearchText(searchText)
  }, 400)

  return (
    <Autocomplete
      id={id}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options ?? []}
      loading={isLoading}
      value={filters[name]}
      onInputChange={search}
      onChange={(e, val) => onChange(val?.value ?? "", name)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={field.label}
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default RelationFilter
