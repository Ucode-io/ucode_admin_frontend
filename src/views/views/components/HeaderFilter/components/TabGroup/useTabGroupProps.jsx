import { useViewContext } from "@/providers/ViewProvider";
import { useUpdateViewMutation } from "@/services/viewsService/views.service";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useTabGroupProps = () => {

  const { i18n } = useTranslation();
  const [search, setSearch] = useState("");

  const {
    refetchViews,
    tableSlug,
    view,
    visibleRelationColumns,
    handleUpdateView,
    isViewUpdating,
  } = useViewContext();

  const {
    fieldsMap,
  } = useFieldsContext()

  const isBoardView = view?.type === VIEW_TYPES_MAP.BOARD

  // const mutation = useMutation({
  //   mutationFn: async (data) => {
  //     await constructorViewService.update(tableSlug, data);
  //     if (isRelationView) {
  //       return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
  //     } else {
  //       return refetchViews();
  //     }
  //   },
  // });

  const computedColumns =
    view?.type !== "CALENDAR" && view?.type !== "GANTT"
      ? Object.values(fieldsMap)
      : [...Object.values(fieldsMap), ...visibleRelationColumns];
  const columns = (computedColumns ?? []).filter((column) =>
    ["LOOKUP", "PICK_LIST", "LOOKUPS", "MULTISELECT", "STATUS"].includes(
      column.type
    )
  );

  // const computedColumnsFor = useMemo(() => {
  //   if (view.type !== "CALENDAR" && view.type !== "GANTT") {
  //     return visibleColumns;
  //   } else {
  //     return [...visibleColumns, ...visibleRelationColumns];
  //   }
  // }, [visibleColumns, visibleRelationColumns, view.type]);

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const renderFields = columns.filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const [selected, setSelected] = useState(view?.group_fields?.[0] ?? null);
  const onChange = (column, checked) => {
    if (isBoardView && selected === column.id) {
      return;
    } else if (isBoardView && selected !== column.id) {
      setSelected(column.id);
    }
    handleUpdateView({
      ...view,
      group_fields: checked
        ? [
            column?.type === "LOOKUP" || column?.type === "LOOKUPS"
              ? column?.relation_id
              : column?.id,
          ]
        : [],
    });
  };

  return {
    i18n,
    search,
    setSearch,
    renderFields,
    getLabel,
    selected,
    onChange,
    view,
    isBoardView,
    isViewUpdating,
  }

}