import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useId, useState } from "react"
import { useQuery } from "react-query"
import useDebounce from "../../../../hooks/useDebounce"
import constructorObjectService from "../../../../services/constructorObjectService"

const RelationFilter = ({ field = {}, filters, onChange }) => {
  const { id } = useId()
  const [searchText, setSearchText] = useState("")



  const fieldTableSlug = field.id.split("#")[0]
  const name = `${fieldTableSlug}_id`
  const viewField = field.attributes?.[0]

  
  const { data: options, isLoading } = useQuery(
    ["GET_OBJECT_LIST", fieldTableSlug, searchText],
    () => {
      if (!fieldTableSlug) return null
      return constructorObjectService.getList(fieldTableSlug, {
        data: { offset: 0, limit: 10, [viewField.slug]: searchText },
      })
    },
    {
      select: ({ data }) => {
        const result = {}

        data.response?.forEach((el) => {
          result[el.guid] = {
            label: el[viewField.slug],
            value: el.guid,
          }
        })

        return Object.values(result)
      },
    }
  )

  console.log('options --->', options)




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
          // label="Asynchronous"
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
