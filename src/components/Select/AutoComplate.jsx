import { useState, useEffect } from "react";
import Select from ".";
import axios from "../../utils/axios"
import "./style.scss"

const handleFormatOptions = (list) => {
  return list && list.length ? list.map(elm => ({label: elm.name, value: elm.id})) : []
}

// const generateParams = (arr) => {
//   return arr && arr.length ? arr.map(el => '/' + el) : ''
// }

export default function AutoComplate ({
  url = '/city',
  params = "",
  queryName = 'name',
  onFetched = (res) => res.cities,
  formatOptions = handleFormatOptions,
  onChange,
  onSearch = () => {},
  value,
  children,
  queryParams,
  list,
  isMulti,
  isClearable,
  ...props
}) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(params?.includes("undefined") || params?.includes("null")) return null
    getOptions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, queryParams])

  const getOptions = (search = '') => {
    setLoading(true)
    axios.get(url + (params ? `/${params}` : ""), {params: {
      [queryName]: search,
      ...queryParams
    }})
      .then(res => setOptions(formatOptions(onFetched(res))))
      .finally(() => setLoading(false))
  }

  const onInputChange = (input) => {
    getOptions(input)
    onSearch(input)
  }

  return (
    <Select
      isSearchable
      options={list ? list : options}
      value={value}
      onChange={onChange}
      isClearable={isClearable}
      onInputChange={onInputChange}
      filterOption={() => true}
      isLoading={isMulti ? false : loading}
      isMulti={isMulti}
      {...props}
    >
      {children}
    </Select>
  )
}