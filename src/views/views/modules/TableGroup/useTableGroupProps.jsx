import { useViewContext } from "@/providers/ViewProvider"
import { useFilterContext } from "../../providers/FilterProvider";
import { useFieldsContext } from "../../providers/FieldsProvider";
import useTabRouter from "@/hooks/useTabRouter";
import { useDispatch, useSelector } from "react-redux";
import useFilters from "@/hooks/useFilters";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray} from "react-hook-form";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import constructorObjectService from "@/services/constructorObjectService";
import layoutService from "@/services/layoutService";
import {mergeStringAndState} from "@/utils/jsonPath";
import {pageToOffset} from "@/utils/pageToOffset";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";

export const useTableGroupProps = () => {
  const isFilterOpen = useSelector((state) => state.main?.tableViewFiltersOpen);
  const filterHeight = localStorage.getItem("filtersHeight");

  const initialTableInfo = useSelector((state) => state.drawer.tableInfo);

  const { navigateToForm } = useTabRouter();
  const navigate = useNavigate();
  // const { id, slug } = useParams();
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(20);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);

  const {
    view,
    tableSlug,
    menuId,
    searchText,
    checkedColumns,
    menuItem,
    currentPage,
    setCurrentPage,
    layoutType,
    setLayoutType,
    selectedView,
    selectedTabIndex,
    viewForm,
    setSelectedView,
    setSelectedRow,
    projectInfo,
  } = useViewContext();

  const { setSortedDatas, sortedDatas } = useFilterContext();

  const { fieldsMap, fieldsForm } = useFieldsContext();

  const { filters, filterChangeHandler } = useFilters(tableSlug, view.id);

  const { update } = useFieldArray({
    control: viewForm.control,
    name: "fields",
    keyName: "key",
  });

  // const getRelationFields = async () => {
  //   return new Promise(async (resolve) => {
  //     const getFieldsData = constructorFieldService.getList({
  //       table_id: id ?? menuItem?.table_id,
  //     });

  //     const getRelations = constructorRelationService.getList(
  //       {
  //         table_slug: slug,
  //         relation_table_slug: slug,
  //       },
  //       {},
  //       slug,
  //     );
  //     const [{ relations = [] }, { fields = [] }] = await Promise.all([
  //       getRelations,
  //       getFieldsData,
  //     ]);
  //     mainForm.setValue("fields", fields);
  //     const relationsWithRelatedTableSlug = relations?.map((relation) => ({
  //       ...relation,
  //       relatedTableSlug:
  //         relation.table_to?.slug === slug ? "table_from" : "table_to",
  //     }));

  //     const layoutRelations = [];
  //     const tableRelations = [];

  //     relationsWithRelatedTableSlug?.forEach((relation) => {
  //       if (
  //         (relation.type === "Many2One" &&
  //           relation.table_from?.slug === slug) ||
  //         (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
  //         relation.type === "Recursive" ||
  //         (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
  //         (relation.type === "Many2Dynamic" &&
  //           relation.table_from?.slug === slug)
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

  //     mainForm.setValue("relations", relations);
  //     mainForm.setValue("relationsMap", listToMap(relations));
  //     mainForm.setValue("layoutRelations", layoutRelationsFields);
  //     mainForm.setValue("tableRelations", tableRelations);
  //     resolve();
  //   });
  // };

  // OLD CODE

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const columns = useMemo(() => {
    const result = [];
    for (const key in view.attributes.fixedColumns) {
      if (
        Object.prototype.hasOwnProperty.call(view.attributes.fixedColumns, key)
      ) {
        if (view.attributes.fixedColumns[key])
          result.push({ id: key, value: view.attributes.fixedColumns[key] });
      }
    }
    return customSortArray(
      view?.columns,
      result.map((el) => {
        if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
          return el?.relation_id;
        } else {
          return el?.id;
        }
      }),
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  const computedSortColumns = useMemo(() => {
    const resultObject = {};

    let a = sortedDatas?.map((el) => {
      if (el.field) {
        return {
          [fieldsMap[el?.field].slug]: el.order === "ASC" ? 1 : -1,
        };
      }
    });

    a.forEach((obj) => {
      for (const key in obj) {
        resultObject[key] = obj[key];
      }
    });

    return resultObject;
  }, [sortedDatas, fieldsMap]);

  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };
  const [combinedTableData, setCombinedTableData] = useState([]);

  const {
    data: { tableData, pageCount } = {
      tableData: [],
      pageCount: 1,
    },
    refetch,
    isLoading: tableLoader,
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST_TEST",
      {
        tableSlug,
        searchText,
        sortedDatas,
        currentPage,
        checkedColumns,
        limit,
        filters,
        view,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          view_type: "TABLE",
          offset: pageToOffset(currentPage, limit),
          app_id: menuId,
          order: computedSortColumns,
          view_fields: checkedColumns,
          builder_service_view_id: view.id,
          search:
            detectStringType(searchText) === "number"
              ? parseInt(searchText)
              : searchText,
          limit,
          ...filters,
          // [tab?.slug]: tab
          //   ? Object.values(fieldsMap).find((el) => el.slug === tab?.slug)
          //       ?.type === "MULTISELECT"
          //     ? [`${tab?.value}`]
          //     : tab?.value
          //   : undefined,
        },
      });
    },
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count)
          ? 1
          : Math.ceil(res.data?.count / limit),
      };
    },
    onSuccess: (data) => {
      const checkDuplicate = combinedTableData?.filter((item) => {
        return data?.tableData?.find((el) => el.guid === item.guid);
      });
      const result = data?.tableData?.filter((item) => {
        return !checkDuplicate?.find((el) => el.guid === item.guid);
      });
      setCombinedTableData((prev) => [...prev, ...result]);
    },
  });

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
        label: view?.table_label || initialTableInfo?.label,
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
    }
  };

  const navigateToDetailPage = (row) => {
    if (view?.navigate?.params?.length || view?.navigate?.url) {
      const params = view.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row,
            )}`,
        )
        .join("&&");
      const result = `${view?.navigate?.url}${params ? "?" + params : ""}`;
      navigate(result);
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? menuId);
    }
  };

  const openFieldSettings = () => {
    setDrawerState("CREATE");
  };

  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);

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

  const [elementHeight, setElementHeight] = useState(null);

  useEffect(() => {
    if (isNaN(parseInt(view?.default_limit))) setLimit(20);
    else setLimit(parseInt(view?.default_limit));
  }, [view?.default_limit]);

  useEffect(() => {
    if (tableData?.length > 0) {
      fieldsForm.reset({
        multi: tableData.map((i) => i),
      });
    }
  }, [tableData, fieldsForm]);

  useEffect(() => {
    layoutService
      .getList(
        {
          "table-slug": tableSlug,
        },
        tableSlug,
      )
      .then((res) => {
        res?.layouts?.find((layout) => {
          layout.type === "PopupLayout"
            ? setLayoutType("PopupLayout")
            : setLayoutType("SimpleLayout");
        });
      });
  }, [menuItem?.id, tableSlug]);

  useEffect(() => {
    refetch();
  }, [view?.quick_filters?.length, refetch]);

  useEffect(() => {
    const element = document.querySelector("#data-table");
    if (element) {
      const height = element.getBoundingClientRect().height;
      setElementHeight(height);
    }
  }, []);

  return {
    view,
    tableSlug,
    currentPage,
    setCurrentPage,
    selectedView,
    setSortedDatas,
    sortedDatas,
    fieldsForm,
    selectedTabIndex,
    filters,
    filterChangeHandler,
    limit,
    setLimit,
    deleteLoader,
    drawerState,
    setDrawerState,
    viewForm,
    update,
    columns,
    pageCount,
    tableLoader,
    deleteHandler,
    navigateToEditPage,
    openFieldSettings,
    setSelectedObjectsForDelete,
    multipleDelete,
    elementHeight,
    tableData,
    selectedObjectsForDelete,
    isFilterOpen,
    filterHeight: Number(filterHeight),
  };
};