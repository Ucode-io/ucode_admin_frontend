
import { useQuery } from "react-query"
import useDebounce from "../../../../hooks/useDebounce"
import constructorObjectService from "../../../../services/constructorObjectService"
import FilterAutoComplete from "./FilterAutocomplete"

const DefaultFilter = ({ field, filters, onChange, name, tableSlug }) => {
  // const { id } = useId()
  // const [searchText, setSearchText] = useState("")

  const { data: options, isLoading } = useQuery(
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
      options={options}
      value={filters[name] ?? []}
      onChange={(val) => onChange(val?.length ? val : null, name)}
      label={field.label}
    />
  )

  // return (
  //   <Autocomplete
  //     id={id}
  //     multiple
  //     isOptionEqualToValue={(option, value) => option === value}
  //     getOptionLabel={(option) => option}
  //     options={options ?? []}
  //     loading={isLoading}
  //     size="small"
  //     value={filters[name] ?? []}
  //     onInputChange={search}
  //     onChange={(e, val) => onChange(val?.length ? val : null, name)}
  //     renderInput={(params) => (
  //       <TextField
  //         {...params}
  //         placeholder={field.label}
  //         // label="Asynchronous"
  //         size="small"
  //         InputProps={{
  //           ...params.InputProps,
  //           style: filters[name]?.length ? { paddingTop: 3, paddingBottom: 3 } : {},
  //           endAdornment: (
  //             <>
  //               {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
  //               {params.InputProps.endAdornment}
  //             </>
  //           ),
  //         }}
  //       />
  //     )}
  //   />
  // )
}

export default DefaultFilter
