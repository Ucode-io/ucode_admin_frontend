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
    ));

    cols?.sort((item1, item2) => item2?.is_checked - item1?.is_checked)

    if(search) {
      return cols?.filter((item) => getLabel(item)?.toLowerCase().includes(search.toLowerCase()))
    }

    return cols
  }, [view, quickFilters, search, visibleColumns]);

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
          }),
        )
      : dispatch(
          filterActions.setFilter({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          }),
        );

    updateView(
      checked
        ? [...quickFilters, column]
        : quickFilters.filter((c) => c.id !== column.id),
      checked,
    );
  };


  return { 
    getLabel,
    onChange,
    allColumns,
   }
}