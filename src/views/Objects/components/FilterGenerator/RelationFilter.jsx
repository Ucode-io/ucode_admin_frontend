import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useId, useMemo } from "react"
import { useQuery } from "react-query"
import constructorObjectService from "../../../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../../../utils/getRelationFieldLabel"

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const { id } = useId()

  const { data: options, isLoading } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug: field.table_slug, filters: {} }],
    () => {
      return constructorObjectService.getList(field.table_slug, { data: {} })
    },
    {
      select: (res) => {
        return res?.data?.response ?? []
      },
    }
  )

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option)
  }

  const computedValue = useMemo(() => {
    if(!Array.isArray(filters[name])) return []

    return filters[name].map((filterValue) => {
      return options?.find(option => option.guid === filterValue)
    })?.filter(el => el)

    // const findedOption = options?.find((el) => el?.guid === filters[name])
    // return findedOption ?? null
  }, [options, filters, name])

  console.log('computedValuecomputedValue', computedValue)

  return (
    <Autocomplete
      id={id}
      // isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={getOptionLabel}
      options={options ?? []}
      loading={isLoading}
      value={computedValue}
      multiple
      size="small"
      // onInputChange={search}
      onChange={(e, val) => onChange(val?.map(el => el.guid) ?? null, name)}
      isOptionEqualToValue={(option, value) => {
        return option.guid === value.guid
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={field.label}
          size="small"
          InputProps={{
            ...params.InputProps,
            style: computedValue?.length ? { paddingTop: 3, paddingBottom: 3 } : {},
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
