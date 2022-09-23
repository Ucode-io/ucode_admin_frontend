
import { get } from "@ngard/tiny-get"
import { useState } from "react"
import { useQuery } from "react-query"
import useObjectsQuery from "../../../../queries/hooks/useObjectsQuery"

import constructorObjectService from "../../../../services/constructorObjectService"
import FilterAutoComplete from "./FilterAutocomplete"

const DefaultFilter = ({ field, filters, onChange, name, tableSlug }) => {
   const [debouncedValue, setDebouncedValue] = useState('')
   const [options, setOptions] = useState([])

   const value = filters[name]
   

   const { query } = useObjectsQuery({
    tableSlug: tableSlug,
    queryPayload: {
      [name]: debouncedValue,
      limit: 10,
      additional_ids: value
    },
    queryParams: {
      onSuccess: ({data}) => {
        setOptions([...new Set(data.response?.map((el) => el[field.slug]) ?? [])]
        .filter((el) => el)
        ?.map((el) => ({
          label: el,
          value: el,
        })))
      },
    }  
  })

  // const { data: options } = useQuery(
  //   ["GET_OBJECT_LIST_ALL",  { tableSlug: tableSlug, filters: {} }],
  //   () => {
  //     if (!tableSlug) return null
  //     return constructorObjectService.getList(tableSlug, {
  //       data: { offset: 0, limit: 10 },
  //     })
  //   },
  //   {
  //     select: ({ data }) => {
  //       return 
  //     },
  //   }
  // )

  return (
    <FilterAutoComplete
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      options={options}
      value={filters[name] ?? []}
      onChange={(val) => onChange(val?.length ? val : undefined, name)}
      label={field.label}
    />
  )
}

export default DefaultFilter
