import { useMemo, useRef, useState } from "react";
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
import { ActionsColumn, IndexColumn, useGridParams } from "../hooks/useGridParams";
import { generateGUID } from "@/utils/generateID";
import getColumnEditorParams from "../valueOptionGenerator";
import { HeaderComponent } from "../components/HeaderComponent";
import { useTranslation } from "react-i18next";

export const usePivotProps = () => {

  const {
    tableSlug,
    view,
    searchText,
    checkedColumns,
    visibleColumns,
    menuItem,
    navigateToEditPage,
    selectedTabIndex,
  } = useViewContext();

  const {
    fieldsMap,
  } = useFieldsContext();

  const { i18n } = useTranslation();

  const gridApi = useRef(null);

  const [rowData, setRowData] = useState([]);
  const [loadings, setLoadings] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [count, setCount] = useState(0);
  const [groupTab, setGroupTab] = useState(null);

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

  function addRow(data) {
    setLoadings(true);
    constructorObjectService
      .create(tableSlug, {
        data: data,
      })
      .then(() => {
        refetch();
        delete data?.new_field;
        setLoadings(false);
      })
      .catch(() => setLoadings(false));
  }

  function appendNewRow() {
    const newRow = { new_field: true, guid: generateGUID() };
    gridApi.current.api.applyTransaction({
      add: [newRow],
      addIndex: 0,
    });
  }

  function removeRow(guid) {
    const allRows = [];
    gridApi.current.api.forEachNode((node) => allRows.push(node.data));
    const rowToRemove = allRows.find((row) => row.guid === guid);

    if (rowToRemove) {
      gridApi.current.api.applyTransaction({
        remove: [rowToRemove],
      });
    } else {
      console.error("Row not found for removal");
    }
  }

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

  function deleteHandler(rowToDelete) {
    const allRows = [];
    gridApi.current.api.forEachNode((node) => allRows.push(node.data));
    const rowToRemove = allRows.find((row) => row.guid === rowToDelete?.guid);

    gridApi.current.api.applyTransaction({
      remove: [rowToRemove],
    });

    constructorObjectService.delete(tableSlug, rowToDelete.guid).then(() => {
      refetch();
    });
  }

  const columnDefs = [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", pivot: true, hide: true },
    { field: "sales", enableValue: true, aggFunc: "sum" },
  ];

  const columns = useMemo(() => {
    if (
      Array.isArray(fieldsArray) &&
      Array.isArray(
        view?.columns?.length ? view?.columns : view?.attributes?.columns,
      )
    ) {
      return [
        {
          ...IndexColumn,
          colId: "__index__",
          enableRowGroup: false,
          enablePivot: false,
          enableValue: false,
          suppressColumnsToolPanel: true,
          menuItem,
          view,
          addRow,
          appendNewRow,
          valueGetter: (params) => {
            return (
              (Boolean(limitPage > 0) ? limitPage : 0) +
              params.node.rowIndex +
              1
            );
          },
        },
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
                onRowClick: (e) => {
                  navigateToEditPage(e);
                },
              };
            }
            return null;
          })
          .filter(Boolean),
        {
          ...ActionsColumn,
          colId: "__actions__",
          enableRowGroup: false,
          enablePivot: false,
          enableValue: false,
          suppressColumnsToolPanel: true,
          view,
          selectedTabIndex,
          menuItem,
          removeRow,
          addRow,
          deleteFunction: deleteHandler,
          cellClass: view.columns.length ? "actionBtn" : "actionBtnNoBorder",
        },
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

  const saveGridState = (api) => {
    const columnState = api.getColumnState();
  
    const pivotMode = api.isPivotMode();
  
    const payload = {
      pivotMode,
      columnState,
    };
  
    console.log("SAVE TO BACKEND:", payload);

  };

  const onColumnStateChanged = (params) => {
    console.log("onColumnStateChanged");
    saveGridState(params.api);
  };

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
  }
}
