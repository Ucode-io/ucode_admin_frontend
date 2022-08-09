import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { Filter } from "../FilterGenerator"
import styles from "./style.module.scss"

const FastFilter = ({ filters, onChange, view, fieldsMap }) => {
  const { tableSlug } = useParams()

  const computedFields = useMemo(() => {

    return view?.quick_filters?.map(el => fieldsMap[el?.field_id])?.filter(el => el) ?? []

  }, [ view, fieldsMap ])
    
  console.log('FILTERS ===?', view?.quick_filters)

  return (
    <div className={styles.filtersBlock} >
      {
        computedFields?.map(filter => (
          <div className={styles.filter} key={filter.id} >

            <Filter field={filter} name={filter.slug} tableSlug={tableSlug} filters={filters} onChange={onChange} />
          </div>
        ))
      }
      

    </div>
  )
}

export default FastFilter
