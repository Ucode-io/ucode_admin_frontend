import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import useFilters from "../../../../hooks/useFilters";
import { filterActions } from "../../../../store/filter/filter.slice";
import { Filter } from "../FilterGenerator";
import styles from "./style.module.scss";

const FastFilter = ({
  view,
  fieldsMap,
  isVertical = false,
  getFilteredFilterFields,
}) => {
  const { tableSlug } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const { filters } = useFilters(tableSlug, view.id);

  // const computedFields = useMemo(() => {
  //   return (
  //     [
  //       ...view?.quick_filters,
  //       ...(new_list[tableSlug] ?? [])
  //         ?.filter((fast) => fast.checked && !view.quick_filters.find((quick) => quick.field_id === fast.id))
  //         ?.map((fast) => ({ field_id: fast.id, default_value: "" })),
  //     ]
  //       ?.map((el) => fieldsMap[el?.field_id])
  //       ?.filter((el) => el) ?? []
  //   );
  // }, [view?.quick_filters, fieldsMap, new_list, tableSlug]);

  const computedFields = useMemo(() => {
    const quickFiltersSet = new Set(
      view?.quick_filters?.map((quick) => quick.field_id)
    );
    return (
      (view?.quick_filters ?? [])
        .concat(new_list[tableSlug] ?? [])
        .filter((fast) => fast.checked && !quickFiltersSet.has(fast.id))
        .map((fast) => ({ field_id: fast.id, default_value: "" }))
        .map((el) => fieldsMap[el.field_id])
        .filter((el) => el) || []
    );
  }, [view?.quick_filters, fieldsMap, new_list, tableSlug]);

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name,
        value,
      })
    );
  };

  // useEffect(() => {
  //   if (!defaultSpecialities?.includes(null) || !defaultSpecialities?.includes('')) {
  //     filterChangeHandler(
  //       defaultSpecialities,
  //       "doctors_id_data.specialities_ids"
  //     );
  //   }
  // }, []);

  return (
    <div
      className={styles.filtersBlock}
      style={{ flexDirection: isVertical ? "column" : "row" }}
    >
      {(getFilteredFilterFields ?? computedFields)?.map((filter) => (
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
  );
};

export default FastFilter;
