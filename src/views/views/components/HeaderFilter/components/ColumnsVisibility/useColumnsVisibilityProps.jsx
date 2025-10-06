import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { useUpdateViewMutation } from "@/services/viewsService/views.service";
import { viewsActions } from "@/store/views/view.slice";
import { applyDrag } from "@/utils/applyDrag";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const useColumnsVisibilityProps = () => {

  const viewsList = useSelector((state) => state.groupField.viewsList);

  const dispatch = useDispatch();
  
  const {
    tableSlug,
    isRelationView,
    refetchViews,
    refetchRelationViews = () => {},
    handleUpdateView,
    view,
  } = useViewContext();
  const { fieldsMap } = useFieldsContext();

  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table");

  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const allFields = Object.values(fieldsMap);

  const updateViewMutation = useUpdateViewMutation(tableSlug, {
    onSuccess: (data) => {
      if (isRelationView && viewsList?.length > 1) {
        refetchRelationViews();
        // return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else if (!isRelationView) {
        dispatch(viewsActions.updateView({ view: data, id: view?.id }));
      } else {
        refetchViews();
      }
    },
  });

  // const mutation = useMutation({
  //   mutationFn: async (data) => {
  //     await constructorViewService.update(tableSlug, data);

  //     if (isRelationView && viewsList?.length > 1) {
  //       refetchRelationViews();
  //       // return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
  //     } else if (!isRelationView) {
  //       dispatch(viewsActions.updateView({ view: data, id: view?.id }));
  //     } else {
  //       return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
  //     }
  //   },
  //   onSuccess: (data) => {
  //     // refetchViews();
  //   },
  // });

  const visibleFields =
    view?.columns
      ?.map((id) => fieldsMap[id])
      .filter((el) => {
        return el?.type === "LOOKUP" || el?.type === "LOOKUPS"
          ? el?.relation_id
          : el?.id;
      }) ?? [];

  const invisibleFields =
    allFields.filter((field) => {
      return !view?.columns?.includes(
        field?.type === "LOOKUP" || field?.type === "LOOKUPS"
          ? field.relation_id
          : field.id
      );
    }) ?? [];

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const allColumns = [...visibleFields, ...invisibleFields];
  const renderFields = visibleFields?.filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    const columns = view?.columns ?? [];
    console.log({ column, checked });
    const id =
      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
        ? column.relation_id
        : column.id;

    if (view?.type === "TIMELINE") {
      let visible_field = view?.attributes?.visible_field;
      if (checked) {
        visible_field = visible_field
          ? visible_field + "/" + column?.slug
          : column?.slug;
      } else {
        visible_field = visible_field
          ?.split("/")
          ?.filter((item) => item !== column?.slug)
          ?.join("/");
      }
      handleUpdateView({
        ...view,
        attributes: {
          ...view?.attributes,
          visible_field: visible_field,
        },
      });
      // updateViewMutation.mutate({
      //   ...view,
      //   attributes: {
      //     ...view?.attributes,
      //     visible_field: visible_field,
      //   },
      // });
    } else {
      handleUpdateView({
        ...view,
        columns: checked ? [...columns, id] : columns.filter((c) => c !== id),
      });
      // updateViewMutation.mutate({
      //   ...view,
      //   columns: checked ? [...columns, id] : columns.filter((c) => c !== id),
      // });
    }
  };

  const onShowAllChange = (checked) => {
    updateViewMutation.mutate({
      ...view,
      columns: checked
        ? allColumns?.map((column) =>
            column?.type === "LOOKUP" || column?.type === "LOOKUPS"
              ? column.relation_id
              : column.id
          )
        : [],
    });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(renderFields, dropResult);
    const computedResult = result?.filter((item) => {
      return item?.type === "LOOKUP" || item?.type === "LOOKUPS"
        ? item?.relation_id
        : item?.id;
    });

    if (computedResult) {
      handleUpdateView({
        ...view,
        columns: computedResult?.map((item) =>
          item?.type === "LOOKUP" || item?.type === "LOOKUPS"
            ? item?.relation_id
            : item?.id
        ),
      });
    }
  };

  return {
    updateViewMutation,
    visibleFields,
    invisibleFields,
    getLabel,
    onChange,
    onShowAllChange,
    onDrop,
    renderFields,
    openMenuId,
    setOpenMenuId,
    search,
    setSearch,
    i18n,
    tableSlug,
    tableLan, 
    view,
  };
};
