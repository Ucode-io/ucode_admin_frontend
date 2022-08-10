import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { filterActions } from "../../../../store/filter/filter.slice"
import { Filter } from "../FilterGenerator"
import styles from "./style.module.scss"

const FastFilter = ({view, fieldsMap }) => {
  const { tableSlug } = useParams()
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter.list[tableSlug]?.[view.id] ?? {})

  const computedFields = useMemo(() => {

    return view?.quick_filters?.map(el => fieldsMap[el?.field_id])?.filter(el => el) ?? []
  }, [ view, fieldsMap ])
    
  const onChange = (value, name) => {
    dispatch(filterActions.setFilter({ tableSlug: tableSlug, viewId: view.id, name, value }))
  }

  return (
    <div className={styles.filtersBlock} >
      {
        computedFields?.map(filter => (
          <div className={styles.filter} key={filter.id} >

            <Filter field={filter} name={filter?.path_slug ?? filter.slug} tableSlug={tableSlug} filters={filters} onChange={onChange} />
          </div>
        ))
      }
      

    </div>
  )
}

export default FastFilter
