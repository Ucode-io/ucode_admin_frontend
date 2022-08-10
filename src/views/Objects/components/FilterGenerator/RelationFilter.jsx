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
    const findedOption = options?.find((el) => el?.guid === filters[name])
    return findedOption ?? null
  }, [options, filters, name])

  return (
    <Autocomplete
      id={id}
      // isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={getOptionLabel}
      options={options ?? []}
      loading={isLoading}
      value={computedValue}
      // onInputChange={search}
      onChange={(e, val) => onChange(val?.guid ?? "", name)}
      isOptionEqualToValue={(option, value) => {
        console.log('sss =>', option, value)
        return option.guid === value.guid
      }}
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
