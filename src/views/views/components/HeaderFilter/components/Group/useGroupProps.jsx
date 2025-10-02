import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { useUpdateViewMutation } from "@/services/viewsService/views.service";
import { viewsActions } from "@/store/views/view.slice";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export const useGroupProps = () => {

  const dispatch = useDispatch()

  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table");

  const {
    view,
    tableSlug,
    isRelationView,
    refetchViews,
    viewsList,
  } = useViewContext();

  const {
    fieldsMap
  } = useFieldsContext();

  const [search, setSearch] = useState("");

  const updateViewMutation = useUpdateViewMutation(tableSlug, {
    onSuccess: (data) => {
      if (isRelationView && viewsList?.length > 1) {
        // refetchRelationViews();
        // return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else {
        dispatch(viewsActions.updateView({ view: data, id: view?.id }));
        // refetchViews();
      }
    },
  });

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

  const allFields = Object.values(fieldsMap);
  const visibleFields =
    view?.attributes?.group_by_columns?.map((id) => fieldsMap[id]) ?? [];
  const invisibleFields = allFields.filter((field) => {
    return !view?.attributes?.group_by_columns?.includes(
      field?.type === FIELD_TYPES.LOOKUP || field?.type === FIELD_TYPES.LOOKUPS
        ? field.relation_id
        : field.id
    );
  });

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const renderFields = [...visibleFields, ...invisibleFields].filter(
    (column) =>
      search === ""
        ? column
        : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    const columns = view?.attributes?.group_by_columns ?? [];
    const id =
      column?.type === FIELD_TYPES.LOOKUP || column?.type === FIELD_TYPES.LOOKUPS
        ? column.relation_id
        : column.id;

    updateViewMutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        group_by_columns: checked
          ? [...columns, id]
          : columns.filter((c) => c !== id),
      },
    });
  };

  return {
    onChange,
    updateViewMutation,
    tableLan,
    i18n,
    search,
    setSearch,
    renderFields,
    view,
    getLabel,
  }
}