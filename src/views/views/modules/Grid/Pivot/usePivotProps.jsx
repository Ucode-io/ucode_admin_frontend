import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import useFilters from "@/hooks/useFilters";
import constructorObjectService from "@/services/constructorObjectService";
import { useViewContext } from "@/providers/ViewProvider";
import { detectStringType } from "@/utils/detectStringType";
import { pageToOffset } from "@/utils/pageToOffset";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { QUERY_KEYS } from "@/utils/constants/queryKeys";
import { useFieldsContext } from "../../../providers/FieldsProvider";
import { useGridParams } from "../hooks/useGridParams";
import { generateGUID } from "@/utils/generateID";
import getColumnEditorParams from "../valueOptionGenerator";
import { HeaderComponent } from "../components/HeaderComponent";
import { useTranslation } from "react-i18next";
import constructorFieldService from "@/services/constructorFieldService";
import useDebounce from "@/hooks/useDebounce";
import { useGetPermission } from "@/components/PermissionWrapper/useGetPermission";

const COLUMN_KEYS = ["aggFunc", "hide", "pinned", "pivot", "rowGroup", "width"];

function getUpdatedColumns(prevState, nextState) {
  const prevMap = new Map();

  for (const col of prevState) {
    prevMap.set(col.colId, col);
  }

  const updated = [];

  for (const nextCol of nextState) {
    const prevCol = prevMap.get(nextCol.colId);

    // если колонки не было раньше — пропускаем
    if (!prevCol) continue;

    let changed = false;

    for (const key of COLUMN_KEYS) {
      if (prevCol[key] !== nextCol[key]) {
        changed = true;
        break;
      }
    }

    if (changed) {
      updated.push(nextCol);
    }
  }

  return updated;
}

const getCleanColumnState = (api) => {
  return api.getColumnState().filter((col) => !col.colId.startsWith("pivot_"));
};

export const usePivotProps = () => {
  const {
    tableSlug,
    view,
    searchText,
    checkedColumns,
    visibleColumns,
    navigateToEditPage,
    refetchTableInfo,
    tabs,
  } = useViewContext();

  const settingsPermission = useGetPermission({
    tableSlug,
    type: "settings",
  })

  const { fieldsMap } = useFieldsContext();

  const { i18n } = useTranslation();

  const gridApi = useRef(null);
  const pivotUpdatedRef = useRef(false);
  const prevStateRef = useRef(null);

  const [rowData, setRowData] = useState([]);
  const [loadings, setLoadings] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [count, setCount] = useState(0);
  const [groupTab, setGroupTab] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const { filters } = useFilters(tableSlug, view.id);
  const { defaultColDef, autoGroupColumnDef, rowSelection, cellSelection } =
    useGridParams({
      customAutoGroupColumnDef: {
        suppressCount: true,
        fields: visibleColumns,
        view,
        tableSlug,
      },
    });

  const tableSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

  // function addRow(data) {
  //   setLoadings(true);
  //   constructorObjectService
  //     .create(tableSlug, {
  //       data: data,
  //     })
  //     .then(() => {
  //       refetch();
  //       delete data?.new_field;
  //       setLoadings(false);
  //     })
  //     .catch(() => setLoadings(false));
  // }

  // function appendNewRow() {
  //   const newRow = { new_field: true, guid: generateGUID() };
  //   gridApi.current.api.applyTransaction({
  //     add: [newRow],
  //     addIndex: 0,
  //   });
  // }

  const createChild = () => {
    if (!selectedRows?.length) {
      return;
    }

    const parentRow = selectedRows[0];
    const newChild = {
      guid: generateGUID(),
      [`${tableSlug}_id`]: parentRow.guid,
      path: [...parentRow.path, generateGUID()],
    };
    gridApi.current.api.applyTransaction({
      add: [newChild],
    });

    constructorObjectService.create(tableSlug, {
      data: newChild,
    });
  };

  // function removeRow(guid) {
  //   const allRows = [];
  //   gridApi.current.api.forEachNode((node) => allRows.push(node.data));
  //   const rowToRemove = allRows.find((row) => row.guid === guid);

  //   if (rowToRemove) {
  //     gridApi.current.api.applyTransaction({
  //       remove: [rowToRemove],
  //     });
  //   } else {
  //     console.error("Row not found for removal");
  //   }
  // }

  const fieldsArray = useMemo(() => {
    return visibleColumns?.map((item) => {
      const columnDef = {
        field: item?.slug,
        fieldObj: item,
        disabled: item?.disabled || item?.attributes?.disabled,
        editPermission: item?.attributes?.field_permission?.edit_permission,
        formula: item?.attributes?.formula || "",
        label: item?.label,

        headerName:
          item?.attributes?.[`label_${i18n?.language}`] || item?.label,
        editable: true,
        enableRowGroup: true,
        flex: 1,
        minWidth: 250,
        rowGroup: view?.attributes?.group_by_columns?.includes(item?.id),
        cellClass:
          item?.type === "LOOKUP" ? "customFieldsRelation" : "customFields",
        columnID: item?.type === "LOOKUP" ? item?.relation_id : item?.id || "",
        pinned: view?.attributes?.pinnedFields?.[item?.id]?.pinned ?? "",
        headerComponent: HeaderComponent,
      };

      getColumnEditorParams(item, columnDef);

      return columnDef;
    });
  }, [visibleColumns]);

  // function deleteHandler(rowToDelete) {
  //   const allRows = [];
  //   gridApi.current.api.forEachNode((node) => allRows.push(node.data));
  //   const rowToRemove = allRows.find((row) => row.guid === rowToDelete?.guid);

  //   gridApi.current.api.applyTransaction({
  //     remove: [rowToRemove],
  //   });

  //   constructorObjectService.delete(tableSlug, rowToDelete.guid).then(() => {
  //     refetch();
  //   });
  // }

  const columns = useMemo(() => {
    if (
      Array.isArray(fieldsArray) &&
      Array.isArray(
        view?.columns?.length ? view?.columns : view?.attributes?.columns,
      )
    ) {
      return [
        ...(view.columns ?? [])
          .map((columnID, index) => {
            const field = fieldsArray.find(
              (item) => item.columnID === columnID,
            );
            if (field) {
              return {
                ...field,
                colIndex: index,
                colId: field.columnID,
                ...field?.cellRendererParams?.field?.attributes?.pivotParams,
                onRowClick: () => {},
                onCellClicked: (params) => {
                  if (!params.node || !params.node.group) return;

                  const rows = params.node.allLeafChildren?.map(
                    (child) => child.data,
                  );

                  if (!!params.event.target.closest(".rowClickButton")) {
                    navigateToEditPage(rows[params.rowIndex]);
                  }
                },
              };
            }
            return null;
          })
          .filter(Boolean),
      ];
    }
    return [];
  }, [fieldsArray, view?.columns]);

  const onGridReady = (params) => {
    params.api.setGridOption("pivotMode", true);
  };

  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo,
  );

  const pagination = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  const limitPage = useMemo(() => pageToOffset(offset, limit), [limit, offset]);

  const { refetch } = useQuery(
    [
      QUERY_KEYS.GRID_DATA_KEY,
      {
        tableSlug,
        filters: {
          offset,
          pagination,
          ...filters,
          searchText,
          [groupTab?.slug]: groupTab?.value,
        },
      },
    ],
    () =>
      constructorObjectService.getListV2(tableSlug, {
        data: {
          ...filters,
          limit: pagination ?? limit,
          search: tableSearch,
          view_fields: checkedColumns,
          [groupTab?.slug]: groupTab
            ? Object.values(fieldsMap).find((el) => el.slug === groupTab?.slug)
                ?.type === FIELD_TYPES.MULTISELECT
              ? [`${groupTab?.value}`]
              : groupTab?.value
            : "",
          offset: Boolean(searchText) || Boolean(limitPage < 0) ? 0 : limitPage,
        },
      }),
    {
      enabled: !!tableSlug,
      onSuccess: (data) => {
        setCount(data?.data?.count);
        setRowData([...(data?.data?.response ?? [])] ?? []);
        setLoadings(false);
      },
      onError: () => {
        setLoadings(false);
      },
    },
  );

  const updateObject = (data) => {
    if (!data?.new_field) {
      constructorObjectService.update(tableSlug, { data: { ...data } });
    }
  };

  const saveGridState = (changes = []) => {
    if (!prevStateRef.current) {
      prevStateRef.current = changes;
    }

    const result = getUpdatedColumns(prevStateRef.current, changes);

    const updatedFields = [];

    result.forEach((change) => {
      const foundColumn = visibleColumns?.find(
        (col) => col.id === change.colId,
      );
      updatedFields.push({
        ...foundColumn,
        attributes: {
          ...foundColumn?.attributes,
          pivotParams: {
            ...foundColumn?.attributes?.pivotParams,
            ...change,
          },
        },
      });
    });

    updatedFields.forEach((field) => {
      if (field.id) {
        constructorFieldService.update({ data: field, tableSlug }).then(() => {
          pivotUpdatedRef.current = true;
        });
      }
    });

    prevStateRef.current = changes;
  };

  const onColumnStateChanged = useDebounce((params) => {
    const cols = getCleanColumnState(params.api);

    saveGridState(cols);
  }, 300);

  useEffect(() => {
    return () => {
      if (pivotUpdatedRef.current) {
        refetchTableInfo();
      }
    };
  }, []);

  useEffect(() => {
    if (Boolean(tabs?.length)) {
      setGroupTab(tabs?.[0]);
    } else {
      setGroupTab(null);
    }
  }, [tabs?.length]);

  return {
    rowData,
    columns,
    onGridReady,
    defaultColDef,
    autoGroupColumnDef,
    rowSelection,
    cellSelection,
    gridApi,
    onColumnStateChanged,
    limit,
    setLimit,
    setOffset,
    count,
    refetch,
    view,
    loadings,
    setLoadings,
    tableSlug,
    pagination,
    selectedRows,
    setSelectedRows,
    createChild,
    updateObject,
    settingsPermission,
  };
};
