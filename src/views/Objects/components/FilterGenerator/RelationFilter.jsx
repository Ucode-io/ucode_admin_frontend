import { useState } from "react"
import { useQuery } from "react-query"
import useObjectsQuery from "../../../../queries/hooks/useObjectsQuery"

import { getRelationFieldTabsLabel } from "../../../../utils/getRelationFieldLabel"
import FilterAutoComplete from "./FilterAutocomplete"

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const [debouncedValue, setDebouncedValue] = useState("")
  const [localCheckedValues, setLocalCheckedValues] = useState([])

  const { query: { data: options } } = useObjectsQuery({
    tableSlug: field.table_slug,
    queryPayload: {
      view_fields: field?.view_fields?.map((field) => field.slug),
      search: debouncedValue,
      limit: 10
    },
    queryParams: {
      select: (res) => {
        return (
          res?.data?.response?.map((el) => ({
            label: getRelationFieldTabsLabel(field, el),
            value: el.guid,
          })) ?? []
        )
      },
    }  
  })

  // const { data: options } = useQuery(
  //   [
  //     "GET_OBJECT_LIST_ALL",
  //     { tableSlug: field.table_slug, filters: {} },
  //     debouncedValue,
  //   ],
  //   () => {
  //     return constructorObjectService.getList(field.table_slug, {
  //       data: {
  //         view_fields: field?.view_fields?.map((f) => f.slug),
  //         search: debouncedValue,
  //         limit: 10,
  //       },
  //     })
  //   },
  //   {
      
  //   }
  // )

  return (
    <FilterAutoComplete
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      value={filters[name] ?? []}
      localCheckedValues={localCheckedValues}
      onChange={(val, item) => {
        onChange(val?.length ? val : null, name)
        if (item) {
          setLocalCheckedValues((p) =>
            p.find((i) => i.value === item.value)
              ? p.filter((i) => i.value !== item.value)
              : [...p, item]
          )
        }
      }}
      options={options}
      label={field.label}
    />
  )
}

export default RelationFilter
