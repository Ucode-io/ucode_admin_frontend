import useFilters from "@/hooks/useFilters";
import constructorObjectService from "@/services/constructorObjectService";
import { quickFiltersActions } from "@/store/filter/quick_filter";
import { pageToOffset } from "@/utils/pageToOffset";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import menuService from "@/services/menuService";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "../../providers/FieldsProvider";
import { useFilterContext } from "../../providers/FilterProvider";
import { useGetLang } from "@/hooks/useGetLang";
import { QUERY_KEYS } from "@/utils/constants/queryKeys";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

function rowToObject(rowArray) {
  const obj = {};

  for (const cell of rowArray) {
    const slug = cell.slug;

    if (cell.type === FIELD_TYPES.LOOKUP || cell.type === FIELD_TYPES.LOOKUPS) {
      obj[slug] =
        typeof cell.value === "object"
          ? (cell.value?.guid ?? null)
          : cell.value;

      if (cell[`${slug}_data`]) {
        obj[`${slug}_data`] = cell[`${slug}_data`];
      }
    } else {
      obj[slug] = cell.value;
    }
  }

  return obj;
}

const combine = (tableData, columns) => {
  return tableData?.map((row) => {
    return columns?.map((col) => ({
      guid: row.guid,
      slug: col.slug,
      value: row[col.slug] ?? null,

      [`${col.slug}_data`]: row[`${col.slug}_data`],

      id: col.id,
      type: col.type,
      enable_multilanguage: col.enable_multilanguage,
      table_slug: col.table_slug,
      table_id: col.table_id,
      relation_type: col.relation_type,
      tabIndex: col.tabIndex,
      required: col.required,
      view_fields: col.view_fields,
      attributes: {
        ...col.attributes,
        required: col.required,
      },
    }));
  });
};

export const useTableProps = ({ tab }) => {
  const {
    view,
    viewId,
    tableSlug,
    menuId,
    viewForm,
    currentPage,
    setCurrentPage,
    searchText,
    checkedColumns,
    navigateToEditPage,
    isRelationView,
  } = useViewContext();

  const { fieldsMap, fieldsForm, fields } = useFieldsContext();

  const [viewsLoader, setViewsLoader] = useState(true);

  const {
    reset,
    setValue: setFormValue,
    control,
    watch,
    getValues,
  } = fieldsForm;

  const { orderBy, setSortedDatas, sortedDatas } = useFilterContext();

  const tableLan = useGetLang("Table");

  const viewsList = useSelector((state) => state.groupField.viewsList);
  const selectedV = viewsList?.[viewsList?.length - 1];

  const sortValues = useSelector((state) => state.pagination.sortValues);

  const { filters } = useFilters(tableSlug, view?.id);

  const dispatch = useDispatch();

  const [limit, setLimit] = useState(20);
  const [, setDrawerStateField] = useState(null);

  const [rows, setRows] = useState(null);

  const [, setDrawerState] = useState(null);

  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);

  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo,
  );

  const { mutate: updateObject } = useMutation(({ data, rowId }) => {
    return constructorObjectService
      .update(tableSlug, {
        data: { ...data, guid: rowId },
      })
      .then(() => refetch());
  });

  const rowsMapRef = useRef(new Map());
  const cellMapRef = useRef(new Map());

  const rowsMap = rowsMapRef.current;
  const cellMap = cellMapRef.current;

  const handleChangeInput = ({ name, value, rowId }) => {
    const key = rowId + ":" + name;

    const cell = cellMap.get(key);

    if (!cell) return;

    cell.value = value;

    const updatedRow = [...rowsMap.get(rowId)];
    rowsMap.set(rowId, updatedRow);

    setRows((prev) => {
      const newRows = prev?.map((row) =>
        row[0].guid === rowId ? updatedRow : row,
      );
      return newRows;
    });

    const data = rowToObject(updatedRow);

    updateObject({ data, rowId });
  };

  const pagination = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const onRowClick = (row) => {
    const rowId = row[0]?.guid;

    if (navigateToEditPage) {
      navigateToEditPage({
        ...rowToObject(row),
        guid: rowId,
      });
    }
  };

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
      result?.map((el) => el.id),
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [fieldsMap, view?.attributes.fixedColumns, view?.columns]);

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
  } = useQuery({
    queryKey: [
      QUERY_KEYS.TABLE_DATA_KEY,
      isRelationView,
      {
        // tableSlug,
        searchText,
        sortedDatas,
        currentPage,
        limit,
        filters,
        tabValue: tab?.value,
        pagination,
        orderBy,
        // viewId,
        computedSortColumns,
        checkedColumns,
        // menuId,
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
          [`${selectedV?.table_slug}_id`]: isRelationView
            ? selectedV?.detailId
            : undefined,
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
    enabled: false,
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
      if (columns?.length > 0) {
        setRows(combine(data.tableData ?? [], columns ?? []));
        setViewsLoader(false);
      } else {
        setRows([]);
        setViewsLoader(false);
      }
    },
    onError: () => {
      setRows([]);
      setViewsLoader(false);
    },
    staleTime: 0,
    cacheTime: 0,
    keepPreviousData: false,
  });

  const deleteHandler = async (rowId) => {
    // setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, rowId);
      setRows((prev) => prev?.filter((row) => row?.[0]?.guid !== rowId));
    } catch (error) {
      console.error(error);
    }
  };

  const multipleDelete = async () => {
    try {
      await constructorObjectService.deleteMultiple(tableSlug, {
        ids: selectedObjectsForDelete,
      });
      setSelectedObjectsForDelete([]);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isNaN(parseInt(view?.default_limit))) setLimit(20);
    else setLimit(parseInt(view?.default_limit));
  }, [view?.default_limit]);

  useEffect(() => {
    if (tableData?.length > 0) {
      reset({
        multi: tableData?.map((i) => i),
      });
    }
  }, [reset, tableData]);

  useEffect(() => {
    if (tableSlug && menuId && viewId && columns?.length > 0) {
      refetch();
    }
    dispatch(
      quickFiltersActions.setQuickFiltersCount(
        view?.attributes?.quick_filters?.length ?? 0,
      ),
    );
  }, [view?.attributes?.quick_filters?.length, filters, columns]);

  const prevViewId = useRef(viewId);

  useEffect(() => {
    if (rows == null && columns?.length) refetch();
    else if (prevViewId.current !== viewId) {
      prevViewId.current = viewId;
      refetch();
    }
  }, [viewId, columns]);

  useEffect(() => {
    if (!tableData || tableData.length === 0 || viewsLoader || !columns?.length)
      return;

    const newCombined = combine(tableData, columns);

    rowsMap.clear();
    cellMap.clear();

    newCombined.forEach((row) => {
      const rowId = row?.[0]?.guid;
      rowsMap.set(rowId, row);
      row.forEach((cell) => {
        cellMap.set(rowId + ":" + cell.slug, cell);
      });
    });

    setRows(newCombined);
  }, [columns, tableData]);

  useEffect(() => {
    if (!viewsLoader) setViewsLoader(true);
  }, [menuId]);

  useEffect(() => {
    if (viewsLoader && view.id && !view?.columns?.length) {
      setRows([]);
      setViewsLoader(false);
    }
  }, [view]);

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
    tableLoading: viewsLoader,
    setSortedDatas,
    sortedDatas,
    setFormValue,
    getValues,
    watch,
    currentPage,
    rows,
    // rows: [staticRow],
    handleChange: handleChangeInput,
    onRowClick,
    updateObject,
  };
};
