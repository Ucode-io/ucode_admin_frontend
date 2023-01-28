import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
  const { filters, filterChangeHandler } = useFilters(tableSlug, view.id);
  const [searchParams] = useSearchParams();
  const defaultSpecialities = [searchParams.get("specialities")];
  const defaultCategory = [searchParams.get("category")];

  useEffect(() => {
    if (
      !defaultCategory.includes(null) &&
      !defaultSpecialities.includes(null)
    ) {
      filterChangeHandler(defaultCategory, "categories_id");
      filterChangeHandler(
        defaultSpecialities,
        "doctors_id_data.specialities_ids"
      );
    }
  }, []);

  const computedFields = useMemo(() => {
    return (
      [
        ...view?.quick_filters,
        ...(new_list[tableSlug] ?? [])
          ?.filter(
            (fast) =>
              fast.checked &&
              !view.quick_filters.find((quick) => quick.field_id === fast.id)
          )
          ?.map((fast) => ({ field_id: fast.id, default_value: "" })),
      ]
        ?.map((el) => fieldsMap[el?.field_id])
        ?.filter((el) => el) ?? []
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

  return (
    <div
      className={styles.filtersBlock}
      style={{ flexDirection: isVertical ? "column" : "row" }}
    >
      {(getFilteredFilterFields
        ? getFilteredFilterFields
        : computedFields
      )?.map((filter) => (
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
