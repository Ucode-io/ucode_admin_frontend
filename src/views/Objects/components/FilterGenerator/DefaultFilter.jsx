
import { useState } from "react"
import { useQuery } from "react-query"

import constructorObjectService from "../../../../services/constructorObjectService"
import FilterAutoComplete from "./FilterAutocomplete"

const DefaultFilter = ({ field, filters, onChange, name, tableSlug }) => {
   const [debouncedValue, setDebouncedValue] = useState('')

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST_ALL",  { tableSlug: tableSlug, filters: {} }],
    () => {
      if (!tableSlug) return null
      return constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 10 },
      })
    },
    {
      select: ({ data }) => {
        return [...new Set(data.response?.map((el) => el[field.slug]) ?? [])]
          .filter((el) => el)
          ?.map((el) => ({
            label: el,
            value: el,
          }))
      },
    }
  )

  return (
    <FilterAutoComplete
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      options={options}
      value={filters[name] ?? []}
      onChange={(val) => onChange(val?.length ? val : null, name)}
      label={field.label}
    />
  )
}

export default DefaultFilter
