import { useState } from "react"
import { useQuery } from "react-query"

import constructorObjectService from "../../../../services/constructorObjectService"
import { getRelationFieldTabsLabel } from "../../../../utils/getRelationFieldLabel"
import FilterAutoComplete from "./FilterAutocomplete"

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const [debouncedValue, setDebouncedValue] = useState('')

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug: field.table_slug, filters: {} }, debouncedValue],
    () => {
      return constructorObjectService.getList(field.table_slug, { data: {
        view_fields: field?.view_fields?.map(f => f.slug), search: debouncedValue, limit: 10
      } })
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

  return (
    <FilterAutoComplete
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      value={filters[name] ?? []}
      onChange={(val) => onChange(val?.length ? val : null, name)}
      options={options}
      label={field.label}
    />
  )
}

export default RelationFilter
