import useFilters from "@/hooks/useFilters";
import useTabRouter from "@/hooks/useTabRouter";
// import constructorFieldService from "@/services/constructorFieldService";
import constructorObjectService from "@/services/constructorObjectService";
// import constructorRelationService from "@/services/constructorRelationService";
// import layoutService from "@/services/layoutService";
import {quickFiltersActions} from "@/store/filter/quick_filter";
import {mergeStringAndState} from "@/utils/jsonPath";
// import {listToMap} from "@/utils/listToMap";
import {pageToOffset} from "@/utils/pageToOffset";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
// import {useTranslation} from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import useSearchParams from "@/hooks/useSearchParams";
import menuService from "@/services/menuService";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "../../providers/FieldsProvider";
import { useFilterContext } from "../../providers/FilterProvider";
import { useGetLang } from "@/hooks/useGetLang";

export const useTableProps = ({ tab }) => {
  const { navigateToForm } = useTabRouter();
  const navigate = useNavigate();

  const {
    // id,
    // menuId: menuid,
    // tableSlug: tableSlugFromParams,
    appId,
  } = useParams();

  const {
    views,
    view,
    viewId,
    tableSlug,
    menuItem,
    menuId,
    viewForm,
    isRelationView,
    currentPage,
    setCurrentPage,
    searchText,
    checkedColumns,
    setLayoutType,
    layoutType,
    setSelectedView,
    selectedView,
    setSelectedRow,
    projectInfo,
  } = useViewContext();

  const { fieldsMap } = useFieldsContext();

  const { orderBy, setSortedDatas, sortedDatas } = useFilterContext();

  const new_router = localStorage.getItem("new_router") === "true";
  // const viewId = searchParams.get("v") ?? viewProp?.id;
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const fieldSlug = urlSearchParams.get("field_slug");

  const tableLan = useGetLang("Table");

  // const view = viewFromStore?.find((view) => view?.id === viewId);

  // const tableSlug =
  //   fieldSlug ||
  //   view?.relation_table_slug ||
  //   tableSlugFromParams ||
  //   view?.table_slug;
  const sortValues = useSelector((state) => state.pagination.sortValues);

  const { filters } = useFilters(tableSlug, view?.id);

  const dispatch = useDispatch();

  const [limit, setLimit] = useState(20);
  const [drawerStateField, setDrawerStateField] = useState(null);

  const [rows, setRows] = useState([]);

  const [deleteLoader, setDeleteLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);

  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const [combinedTableData, setCombinedTableData] = useState([]);
  // const [selectedViewType, setSelectedViewType] = useState(
  //   localStorage?.getItem("detailPage"),
  // );

  // const menuId = menuid ?? searchParams.get("menuId");
  const mainTabIndex = useSelector((state) => state.drawer.mainTabIndex);
  const drawerTabIndex = useSelector((state) => state.drawer.drawerTabIndex);
  const initialTableInf = useSelector((state) => state.drawer.tableInfo);
  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo,
  );
  const selectedTabIndex = isRelationView ? drawerTabIndex : mainTabIndex;

  const { mutate: updateObject } = useMutation(({ data, rowId }) => {
    return constructorObjectService.update(tableSlug, {
      data: { ...data, guid: rowId },
    });
  });

  const handleChangeInput = useCallback(({ name, value, rowId }) => {
    if (name && rowId) {
      let row = {};
      setRows((prev) => {
        return prev.map((item) => {
          if (item.guid === rowId) {
            row = { ...item, [name]: value };
            return row;
          }
          return item;
        });
      });
      updateObject({ data: row, rowId });
    }
  }, []);

  const {
    control,
    reset,
    setValue: setFormValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      multi: [],
    },
    shouldUnregister: true,
  });

  const { fields } = useFieldArray({
    control,
    name: "multi",
  });

  // const mainForm = useForm({
  //   defaultValues: {
  //     show_in_menu: true,
  //     fields: [],
  //     app_id: menuId,
  //     summary_section: {
  //       id: generateGUID(),
  //       label: "Summary",
  //       fields: [],
  //       icon: "",
  //       order: 1,
  //       column: "SINGLE",
  //       is_summary_section: true,
  //     },
  //     label: "",
  //     description: "",
  //     slug: "",
  //     icon: "",
  //   },
  //   mode: "all",
  // });

  // const { update } = useFieldArray({
  //   control: viewForm.control,
  //   name: "fields",
  //   keyName: "key",
  // });

  const pagination = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  // const getRelationFields = async () => {
  //   return new Promise(async (resolve) => {
  //     const getFieldsData = constructorFieldService.getList({
  //       table_id: id ?? menuItem?.table_id ?? initialTableInf?.id,
  //     });

  //     const getRelations = constructorRelationService.getList(
  //       {
  //         table_slug: tableSlug,
  //         relation_table_slug: tableSlug,
  //       },
  //       {},
  //       tableSlug
  //     );
  //     const [{ relations = [] }, { fields = [] }] = await Promise.all([
  //       getRelations,
  //       getFieldsData,
  //     ]);
  //     viewForm.setValue("fields", fields);
  //     const relationsWithRelatedTableSlug = relations?.map((relation) => ({
  //       ...relation,
  //       relatedTableSlug:
  //         relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
  //     }));

  //     const layoutRelations = [];
  //     const tableRelations = [];

  //     relationsWithRelatedTableSlug?.forEach((relation) => {
  //       if (
  //         (relation.type === "Many2One" &&
  //           relation.table_from?.slug === tableSlug) ||
  //         (relation.type === "One2Many" &&
  //           relation.table_to?.slug === tableSlug) ||
  //         relation.type === "Recursive" ||
  //         (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
  //         (relation.type === "Many2Dynamic" &&
  //           relation.table_from?.slug === tableSlug)
  //       ) {
  //         layoutRelations.push(relation);
  //       } else {
  //         tableRelations.push(relation);
  //       }
  //     });

  //     const layoutRelationsFields = layoutRelations.map((relation) => ({
  //       ...relation,
  //       id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
  //       attributes: {
  //         fields: relation.view_fields ?? [],
  //       },
  //       label:
  //         (relation?.label ?? relation[relation.relatedTableSlug]?.label)
  //           ? relation[relation.relatedTableSlug]?.label
  //           : relation?.title,
  //     }));

  //     viewForm.setValue("relations", relations);
  //     viewForm.setValue("relationsMap", listToMap(relations));
  //     viewForm.setValue("layoutRelations", layoutRelationsFields);
  //     viewForm.setValue("tableRelations", tableRelations);
  //     resolve();
  //     queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
  //   });
  // };

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const columns = useMemo(() => {
    const result = [];
    for (const key in view?.attributes.fixedColumns) {
      if (
        Object.prototype.hasOwnProperty.call(view?.attributes.fixedColumns, key)
      ) {
        if (view?.attributes.fixedColumns[key]) {
          result.push({ id: key, value: view?.attributes.fixedColumns[key] });
        }
      }
    }

    const uniqueIdsSet = new Set();
    const uniqueColumns = view?.columns?.filter((column) => {
      if (!uniqueIdsSet.has(column)) {
        uniqueIdsSet.add(column);
        return true;
      }
      return false;
    });

    return customSortArray(
      uniqueColumns,
      result.map((el) => el.id),
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap, views, viewId]);

  const computedSortColumns = useMemo(() => {
    const resultObject = {};

    let a = sortedDatas
      ?.map((el) => {
        if (el?.field && el?.order === "ASC") {
          return {
            [fieldsMap[el?.field]?.slug]: 1,
          };
        } else if (el?.order === "DESC") {
          return undefined;
        }
      })
      .filter(Boolean);

    a.forEach((obj) => {
      for (const key in obj) {
        if (key) {
          resultObject[key] = obj[key];
        }
      }
    });

    if (sortValues && sortValues.length > 0) {
      const matchingSort = sortValues.find(
        (entry) => entry.tableSlug === tableSlug,
      );

      if (matchingSort) {
        const { field, order } = matchingSort;
        const sortKey = fieldsMap[field]?.slug;
        if (sortKey) {
          resultObject[sortKey] = order === "ASC" ? 1 : -1;
        }
      }
    }

    return resultObject;
  }, [sortedDatas, fieldsMap]);

  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };

  useEffect(() => {
    if (
      Object.values(filters).length > 0 &&
      Object.values(filters)?.find((el) => el !== undefined)
    ) {
      setCurrentPage(1);
    }
  }, [filters]);

  const tableSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

  const {
    data: { tableData, dataCount } = {
      tableData: [],
      pageCount: 1,
      fieldView: [],
      fiedlsarray: [],
      dataCount: 0,
    },
    refetch,
    isLoading: tableLoader,
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        tableSlug,
        searchText,
        sortedDatas,
        currentPage,
        limit,
        filters: { ...filters, [tab?.slug]: tab?.value },
        pagination,
        orderBy,
      },
    ],

    queryFn: () => {
      return menuService.getFieldsTableData(menuId, viewId, tableSlug, {
        data: {
          row_view_id: view?.id,
          offset: pageToOffset(currentPage, pagination),
          order: computedSortColumns,
          view_fields: checkedColumns,
          search: tableSearch,
          limit: pagination ?? limit,
          ...filters,
          [tab?.slug]: tab
            ? Object.values(fieldsMap).find((el) => el.slug === tab?.slug)
                ?.type === "MULTISELECT"
              ? [`${tab?.value}`]
              : tab?.value
            : "",
        },
      });
    },
    enabled: Boolean(tableSlug && menuId && viewId),
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count)
          ? 1
          : Math.ceil(res.data?.count / (pagination ?? limit)),
        dataCount: res?.data?.count,
      };
    },
    onSuccess: (data) => {
      setRows(data?.tableData);
      // const checkdublicate =
      //   combinedTableData?.filter((item) => {
      //     return data?.tableData?.find((el) => el.guid === item.guid);
      //   }) ?? [];
      // const result =
      //   data?.tableData?.filter((item) => {
      //     return !checkdublicate?.find((el) => el.guid === item.guid);
      //   }) ?? [];
      // setCombinedTableData((prev) => [...prev, ...result]);
    },
  });

  // const {
  //   data: { layout } = {
  //     layout: [],
  //   },
  // } = useQuery({
  //   queryKey: [
  //     "GET_LAYOUT",
  //     {
  //       tableSlug,
  //     },
  //   ],
  //   enabled: Boolean(tableSlug && menuId),
  //   queryFn: () => {
  //     return layoutService.getLayout(tableSlug, menuId);
  //   },
  //   select: (data) => {
  //     return {
  //       layout: data ?? {},
  //     };
  //   },
  //   onSuccess: (data) => {
  //     if (data?.layout?.type === "PopupLayout") {
  //       setLayoutType("PopupLayout");
  //     } else {
  //       setLayoutType("SimpleLayout");
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error", error);
  //   },
  // });

  const deleteHandler = async (row) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const navigateToEditPage = (row) => {
    dispatch(
      groupFieldActions.addView({
        id: view?.id,
        label: view?.table_label || initialTableInf?.label,
        table_slug: view?.table_slug,
        relation_table_slug: view.relation_table_slug ?? null,
        is_relation_view: view?.is_relation_view,
        detailId: row?.guid,
      }),
    );
    if (Boolean(selectedView?.is_relation_view)) {
      setSelectedView(view);
      setSelectedRow(row);
      dispatch(detailDrawerActions.openDrawer());
      updateQueryWithoutRerender("p", row?.guid);
    } else {
      updateQueryWithoutRerender("p", row?.guid);
      if (view?.attributes?.navigate?.url) {
        navigateToDetailPage(row);
      } else if (projectInfo?.new_layout) {
        setSelectedRow(row);
        dispatch(detailDrawerActions.openDrawer());
      } else {
        if (layoutType === "PopupLayout") {
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          navigateToDetailPage(row);
        }
      }
      // if (new_router) {
      //   updateQueryWithoutRerender("p", row?.guid);
      //   if (view?.attributes?.url_object) {
      //     navigateToDetailPage(row);
      //   } else if (projectInfo?.new_layout) {
      //     setSelectedRow(row);
      //     dispatch(detailDrawerActions.openDrawer());
      //   } else {
      //     if (layoutType === "PopupLayout") {
      //       setSelectedRow(row);
      //       dispatch(detailDrawerActions.openDrawer());
      //     } else {
      //       navigateToDetailPage(row);
      //     }
      //   }
      // } else {
      //   if (view?.attributes?.url_object) {
      //     navigateToDetailPage(row);
      //   } else if (projectInfo?.new_layout) {
      //     setSelectedRow(row);
      //     dispatch(detailDrawerActions.openDrawer());
      //   } else {
      //     if (layoutType === "PopupLayout") {
      //       setSelectedRow(row);
      //       dispatch(detailDrawerActions.openDrawer());
      //     } else {
      //       navigateToDetailPage(row);
      //     }
      //   }
      // }
    }
  };

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row,
            )}`,
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      if (new_router)
        navigate(`/${menuId}/detail?p=${row?.guid}`, {
          state: {
            viewId,
            tableSlug,
          },
        });
      else navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  const multipleDelete = async () => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.deleteMultiple(tableSlug, {
        ids: selectedObjectsForDelete.map((i) => i.guid),
      });
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const openFieldSettings = () => {
    setDrawerState("CREATE");
  };

  useEffect(() => {
    if (isNaN(parseInt(view?.default_limit))) setLimit(20);
    else setLimit(parseInt(view?.default_limit));
  }, [view?.default_limit]);

  useEffect(() => {
    if (tableData?.length > 0) {
      reset({
        multi: tableData.map((i) => i),
      });
    }
  }, [reset, tableData]);

  useEffect(() => {
    if (tableSlug) {
      refetch();
    }
    dispatch(
      quickFiltersActions.setQuickFiltersCount(
        view?.attributes?.quick_filters?.length ?? 0,
      ),
    );
  }, [view?.attributes?.quick_filters?.length, refetch]);

  // useEffect(() => {
  //   if (localStorage.getItem("detailPage") === "undefined") {
  //     setSelectedViewType("SidePeek");
  //     localStorage.setItem("detailPage", "SidePeek");
  //   }
  // }, [localStorage.getItem("detailPage")]);

  const loader = tableLoader || deleteLoader;

  return {
    tableLan,
    dataCount,
    tableData,
    setDrawerState,
    setDrawerStateField,
    viewForm,
    multipleDelete,
    fields,
    setCurrentPage,
    columns,
    control,
    deleteHandler,
    navigateToEditPage,
    selectedObjectsForDelete,
    setSelectedObjectsForDelete,
    limit,
    setLimit,
    view,
    refetch,
    loader,
    setSortedDatas,
    sortedDatas,
    setFormValue,
    getValues,
    watch,
    currentPage,
    rows,
    handleChange: handleChangeInput,
  };
};
