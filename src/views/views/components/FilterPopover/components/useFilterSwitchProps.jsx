import { useViewContext } from "@/providers/ViewProvider";
import { useUpdateViewMutation } from "@/services/viewsService/views.service";
import { filterActions } from "@/store/filter/filter.slice";
import { quickFiltersActions } from "@/store/filter/quick_filter";
import { mainActions } from "@/store/main/main.slice";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

export const useFilterSwitchProps = ({ search }) => {

  const {i18n} = useTranslation();

  const dispatch = useDispatch();

  const [queryParameters] = useSearchParams();

  const {
    view,
    visibleColumns,
    tableSlug,
    isRelationView,
    refetchViews,
  } = useViewContext();

  const columnsIds = visibleColumns?.map((item) => item?.id);

  const quickFilters = view?.attributes?.quick_filters ?? [];


  const quickFiltersIds = quickFilters?.map(
    (item) => item?.id
  );

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column.label;

  const allColumns = useMemo(() => {
    const cols = visibleColumns?.map(column => (
      {
        ...column,
        is_checked: quickFiltersIds?.includes(column?.id)
      }
    ))
    cols?.sort((item1, item2) => item2?.is_checked - item1?.is_checked)
    return cols
  }, [view, quickFilters]);

  const checkedColumns = useMemo(() => {
    return (
      quickFilters?.filter((checkedField) =>
        search
          ? columnsIds?.includes(checkedField?.id) &&
            getLabel(checkedField)?.toLowerCase().includes(search.toLowerCase())
          : columnsIds?.includes(checkedField?.id)
      ) ?? []
    );
  }, [view, search]);

  const unCheckedColumns = useMemo(() => {
    return (
      (quickFilters?.length === 0 ||
      quickFilters?.length === undefined
        ? search
          ? visibleColumns?.filter((column) =>
              getLabel(column)?.toLowerCase().includes(search.toLowerCase())
            )
          : visibleColumns
        : visibleColumns?.filter((column) =>
            search
              ? !quickFiltersIds?.includes(column?.id) &&
                getLabel(column)?.toLowerCase().includes(search.toLowerCase())
              : !quickFiltersIds?.includes(column?.id)
          )) ?? []
    );
  }, [view, search]);

  const updateViewMutation = useUpdateViewMutation(
    tableSlug,
    {
      onSuccess: () => {
        refetchViews();
      },
      onSettled: (data) => {
        dispatch(quickFiltersActions.setQuickFiltersCount(data?.length));
      },
    }
  );

  const updateView = async (data, checked) => {
    const result = data?.map((item) => ({
      ...item,
      is_checked: true,
    }));

    updateViewMutation.mutate({
      ...view,
      attributes: {...view?.attributes, quick_filters: result},
    });
    if (quickFilters?.length === 0) {
      dispatch(mainActions.setTableViewFiltersOpen(true));
    }
    if (quickFilters?.length === 1 && !checked) {
      dispatch(mainActions.setTableViewFiltersOpen(false));
    }
  };

  const onChange = (column, checked) => {

    !checked
      ? dispatch(
          filterActions.clearFilters({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          })
        )
      : dispatch(
          filterActions.setFilter({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          })
        );

    updateView(
      checked
        ? [...quickFilters, column]
        : quickFilters.filter((c) => c.id !== column.id),
      checked
    );
  };


  return { 
    checkedColumns,
    getLabel,
    onChange,
    unCheckedColumns,
    allColumns,
   }
}