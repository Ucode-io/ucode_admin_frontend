import useFilters from "@/hooks/useFilters";
import { useViewContext } from "@/providers/ViewProvider";
import { filterActions } from "@/store/filter/filter.slice";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useFieldsContext } from "../../../../providers/FieldsProvider";
import { useGetLang } from "@/hooks/useGetLang";
import { mainActions } from "@/store/main/main.slice";

export const useFiltersListProps = () => {

  const { view, viewId, tableSlug, visibleColumns, refetchViews } =
    useViewContext();

  const { fieldsMap } = useFieldsContext();

  const { new_list } = useSelector((state) => state.filter);
  const [queryParameters] = useSearchParams();
  const { filters } = useFilters(tableSlug, viewId);
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const filtersRef = useRef(null);

  const tableLan = useGetLang("Table")

  const computedFields = useMemo(() => {
    const filter = view?.attributes?.quick_filters ?? [];

    return (
      [
        ...(filter ?? []),
        ...(new_list[tableSlug] ?? [])
          ?.filter(
            (fast) =>
              fast.is_checked &&
              !view?.attributes?.quick_filters?.find(
                (quick) => quick?.id === fast.id
              )
          )
          ?.map((fast) => fast),
      ]
        ?.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return fieldsMap[el?.relation_id];
          } else {
            return fieldsMap[el?.id];
          }
        })
        ?.filter((el) => el) ?? []
    );
  }, [view?.attributes?.quick_filters, fieldsMap, new_list, tableSlug]);

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name: name,
        value,
      })
    );
  };

  useEffect(() => {
    if (filtersRef.current) {
      console.log(filtersRef.current.offsetHeight);
      dispatch(
        mainActions.setViewFilter({
          id: view?.id,
          height: filtersRef.current.offsetHeight,
        }),
      );
    }
  }, [computedFields]);

  useEffect(() => {
    if (queryParameters.get("specialities")?.length) {
      dispatch(
        filterActions.setFilter({
          tableSlug: tableSlug,
          viewId: view?.id,
          name: "specialities_id",
          value: [`${queryParameters.get("specialities")}`],
        })
      );
    }
  }, [queryParameters]);

  return {
    i18n,
    filtersRef,
    computedFields,
    onChange,
    tableSlug,
    visibleColumns,
    refetchViews,
    filters,
    view,
    tableLan,
  }
}
