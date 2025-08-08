import { useState } from "react"
import { useTablesListQuery } from "../../../../../services/constructorTableService"
import useDebounce from "../../../../../hooks/useDebounce"

export const useTablesProps = () => {
const [searchText, setSearchText] = useState("")

  const {data: tables} = useTablesListQuery({
    params: {
      search: searchText
    }
  })

  const handleOnChange = useDebounce((e) => {
    setSearchText(e.target.value)
  }, 500)

  return {
    tables,
    setSearchText,
    handleOnChange,
  }
}
