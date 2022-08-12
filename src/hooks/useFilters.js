import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"




const useFilters = (tableSlug, viewId) => {
  const {state} = useLocation()

  const filtersFromLocation = useMemo(() => state ?? {}, [state])
  const filtersFromRedux = useSelector((state) => state.filter.list[tableSlug]?.[viewId] ?? {})

  const filters = useMemo(() => {
    return { ...filtersFromRedux, ...filtersFromLocation}
  }, [filtersFromRedux, filtersFromLocation])

  return {filters}
}

export default useFilters