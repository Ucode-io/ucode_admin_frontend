import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import useFilters from "../../../../hooks/useFilters"
import { filterActions } from "../../../../store/filter/filter.slice"
import { Filter } from "../FilterGenerator"
import styles from "./style.module.scss"

const FastFilter = ({ view, fieldsMap, isVertical = false }) => {
  const { tableSlug } = useParams()
  const { new_list } = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const { filters } = useFilters(tableSlug, view.id)

  const computedFields = useMemo(() => {
    new_list[tableSlug]
      ?.filter((i) => i.checked)
      .forEach((i) => {
        if (!view.quick_filters.find((j) => j.field_id === i.id)) {
          view.quick_filters.push({ field_id: i.id, defaultValue: "" })
        }
      })
    return (
      view?.quick_filters
        ?.map((el) => fieldsMap[el?.field_id])
        ?.filter((el) => el) ?? []
    )
  }, [view?.quick_filters, fieldsMap, new_list])

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name,
        value,
      })
    )
  }

  return (
    <div
      className={styles.filtersBlock}
      style={{ flexDirection: isVertical ? "column" : "row" }}
    >
      {computedFields?.map((filter) => (
        <div className={styles.filter} key={filter.id}>
          <Filter
            field={filter}
            name={filter?.path_slug ?? filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  )
}

export default FastFilter
