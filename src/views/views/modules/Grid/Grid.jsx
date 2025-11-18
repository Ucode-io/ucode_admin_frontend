import { Button as ChakraButton, Flex, Text } from "@chakra-ui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button } from "@mui/material";
import {
  CellStyleModule,
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  DateEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  RowSelectionModule,
  TextEditorModule,
  UndoRedoEditModule,
  ValidationModule,
  themeQuartz,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import useFilters from "@/hooks/useFilters";
import constructorObjectService from "@/services/constructorObjectService";
import constructorViewService from "@/services/constructorViewService";
import { generateGUID } from "@/utils/generateID";
import { pageToOffset } from "@/utils/pageToOffset";
import AggridFooter from "./AggridFooter";
import NoFieldsComponent from "./AggridNewDesignHeader/NoFieldsComponent";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import AggridDefaultComponents, {
  ActionsColumn,
  IndexColumn,
} from "./Functions/AggridDefaultComponents";
import { detectStringType } from "./Functions/queryGenerator";
import style from "./style.module.scss";
import getColumnEditorParams from "./valueOptionGenerator";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "../../providers/FieldsProvider";

ModuleRegistry.registerModules([
  MenuModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ClientSideRowModelModule,
  RowSelectionModule,
  RowGroupingModule,
  TreeDataModule,
  ValidationModule,
  CellSelectionModule,
  TextEditorModule,
  CheckboxEditorModule,
  NumberEditorModule,
  ColumnApiModule,
  CellStyleModule,
  DateEditorModule,
  UndoRedoEditModule,
]);

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
});

export const Grid = () => {
  const {
    view,
    tableSlug,
    visibleColumns,
    searchText,
    checkedColumns,
    projectInfo,
    menuItem,
    tabs,
    selectedTabIndex,
    navigateToEditPage,
  } = useViewContext();

  const {
    fieldsMap,
    // fields,
  } = useFieldsContext();

  // const initialTableInf = useSelector((state) => state.drawer.tableInfo);
  const gridApi = useRef(null);
  const pinFieldsRef = useRef({});
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { tableSlug: tableSlugFromParams} = useParams();

  // const tableSlug = isRelationView
  //   ? view?.relation_table_slug
  //   : (tableSlugFromParams ?? view?.table_slug);

  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo,
  );

  const { i18n } = useTranslation();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [groupTab, setGroupTab] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // const new_router = localStorage.getItem("new_router") === "true";

  const { filters } = useFilters(tableSlug, view.id);
  const { defaultColDef, autoGroupColumnDef, rowSelection, cellSelection } =
    AggridDefaultComponents({
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

  const pagination = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  const limitPage = useMemo(() => pageToOffset(offset, limit), [limit, offset]);

  const { refetch } = useQuery(
    [
      "GET_OBJECTS_LIST_DATA",
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
                ?.type === "MULTISELECT"
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

  // const {
  //   data: { fields } = {
  //     pageCount: 1,
  //     fieldsArray: [],
  //     custom_events: [],
  //   },
  // } = useQuery({
  //   queryKey: ["GET_TABLE_INFO", tableSlug],
  //   queryFn: () =>
  //     constructorTableService.getTableInfo(tableSlug, { data: {} }),
  //   enabled: Boolean(tableSlug),
  //   select: (res) => {
  //     return {
  //       fields: res?.data?.fields,
  //     };
  //   },
  // });

  // const replaceUrlVariables = (urlTemplate, data) => {
  //   return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
  //     return data[variable] || "";
  //   });
  // };

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

  // const navigateToEditPage = (row) => {
  //   dispatch(detailDrawerActions.setDrawerTabIndex(0));
  //   dispatch(
  //     groupFieldActions.addView({
  //       id: view?.id,
  //       label: view?.table_label || initialTableInf?.label,
  //       table_slug: view?.table_slug,
  //       relation_table_slug: view.relation_table_slug ?? null,
  //       is_relation_view: view?.is_relation_view,
  //       detailId: row?.guid,
  //     })
  //   );
  //   if (Boolean(selectedView?.is_relation_view)) {
  //     setSelectedView(view);
  //     setSelectedRow(row);
  //     dispatch(detailDrawerActions.openDrawer());
  //     updateQueryWithoutRerender("p", row?.guid);
  //   } else {
  //     if (new_router) {
  //       updateQueryWithoutRerender("p", row?.guid);
  //       if (view?.attributes?.url_object) {
  //         navigateToDetailPage(row);
  //       } else if (projectInfo?.new_layout) {
  //         setSelectedRow(row);
  //         dispatch(detailDrawerActions.openDrawer());
  //       } else {
  //         if (layoutType === "PopupLayout") {
  //           setSelectedRow(row);
  //           dispatch(detailDrawerActions.openDrawer());
  //         } else {
  //           navigateToDetailPage(row);
  //         }
  //       }
  //     } else {
  //       if (view?.attributes?.url_object) {
  //         navigateToDetailPage(row);
  //       } else if (projectInfo?.new_layout) {
  //         setSelectedRow(row);
  //         dispatch(detailDrawerActions.openDrawer());
  //       } else {
  //         if (layoutType === "PopupLayout") {
  //           setSelectedRow(row);
  //           dispatch(detailDrawerActions.openDrawer());
  //         } else {
  //           navigateToDetailPage(row);
  //         }
  //       }
  //     }
  //   }
  // };

  // function navigateToDetailPage(row) {
  //   if (
  //     view?.attributes?.navigate?.params?.length ||
  //     view?.attributes?.navigate?.url
  //   ) {
  //     const params = view?.attributes?.navigate?.params
  //       ?.map(
  //         (param) =>
  //           `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
  //             param.value,
  //             row
  //           )}`
  //       )
  //       .join("&");

  //     const urlTemplate = view?.attributes?.navigate?.url;

  //     const matches = replaceUrlVariables(urlTemplate, row);

  //     navigate(`${matches}${params ? "?" + params : ""}`);
  //   } else {
  //     navigate(`/${menuId}/detail?p=${row?.guid}`, {
  //       state: {
  //         viewId,
  //         tableSlug,
  //       },
  //     })
  //   }
  // }

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

  const updateView = (pinnedField, updatedColumns = []) => {
    pinFieldsRef.current = { ...pinFieldsRef.current, ...pinnedField };
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: updatedColumns?.length ? updatedColumns : view?.columns,
        attributes: {
          ...view.attributes,
          pinnedFields: pinFieldsRef.current,
        },
      })
      .catch(() => setLoadings(true));
  };

  const updateObject = (data) => {
    if (!data?.new_field) {
      constructorObjectService.update(tableSlug, { data: { ...data } });
    }
  };

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

  const onColumnPinned = (event) => {
    const { column, pinned } = event;
    const fieldId = column?.colDef?.columnID;
    updateView({
      [fieldId]: { pinned },
    });
  };

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

  const debouncedUpdateView = useCallback(
    useDebounce((ids) => updateView(undefined, ids), 600),
    [],
  );

  const getColumnsUpdated = (event) => {
    const updatedColumns = event.api.getColumnDefs();
    const updatedIds = updatedColumns
      ?.filter((el) => el?.columnID)
      ?.map((item) => item?.columnID);

    debouncedUpdateView(updatedIds);
  };

  useEffect(() => {
    pinFieldsRef.current = view?.attributes?.pinnedFields;
  }, [view?.attributes?.pinnedFields]);

  useEffect(() => {
    if (Boolean(tabs?.length)) {
      setGroupTab(tabs?.[0]);
    } else {
      setGroupTab(null);
    }
  }, [tabs?.length]);

  const tableViewFiltersOpen = useSelector(
    (state) => state.main.tableViewFiltersOpen,
  );

  const tabHeight = document.querySelector("#tabsHeight")?.offsetHeight ?? 0;
  const filterHeight = localStorage.getItem("filtersHeight");

  const isWarning =
    differenceInCalendarDays(parseISO(projectInfo?.expire_date), new Date()) +
    1;

  const isWarningActive =
    projectInfo?.subscription_type === "free_trial"
      ? isWarning <= 16
      : isWarning <= 7;

  const calculatedHeight = useMemo(() => {
    let warningHeight = 0;

    if (isWarningActive || projectInfo?.status === "inactive") {
      warningHeight = 32;
    }
    const filterHeightValue = Number(filterHeight) || 0;
    const tabHeightValue = Number(tabHeight) || 0;

    return tableViewFiltersOpen
      ? filterHeightValue + tabHeightValue + warningHeight
      : tabHeightValue + warningHeight;
  }, [
    tableViewFiltersOpen,
    filterHeight,
    tabHeight,
    projectInfo,
    isWarningActive,
  ]);

  return (
    <Box
      className={style.gridWrapper}
      sx={{
        height: `calc(100vh - ${calculatedHeight + 85}px)`,
        overflow: "scroll",
      }}
    >
      <div className={style.gridTable}>
        <div
          className="ag-theme-quartz"
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              background: "#fff",
              height: `calc(100vh - ${calculatedHeight + 85}px)`,
            }}
          >
            {Boolean(tabs?.length) && (
              <Box
                sx={{
                  display: "flex",
                  padding: "10px 0 0 20px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {tabs?.map((item) => (
                  <Button
                    key={item.value}
                    onClick={() => {
                      setLoadings(true);
                      setGroupTab(item);
                    }}
                    variant="outlined"
                    className={
                      groupTab?.value === item?.value
                        ? style.tabGroupBtnActive
                        : style.tabGroupBtn
                    }
                  >
                    {item?.label}
                  </Button>
                ))}
              </Box>
            )}

            {!columns?.length ? (
              <NoFieldsComponent />
            ) : (
              <>
                <AgGridReact
                  ref={gridApi}
                  rowBuffer={20}
                  theme={myTheme}
                  gridOptions={{
                    suppressCellSelection: true,
                    columnBuffer: 10,
                    rowBuffer: 20,
                  }}
                  suppressRowHoverHighlight={true}
                  suppressAggFuncInHeader={true}
                  onColumnMoved={getColumnsUpdated}
                  rowData={rowData}
                  loading={loadings}
                  columnDefs={columns}
                  suppressRefresh={true}
                  enableClipboard={true}
                  groupDisplayType="single"
                  paginationPageSize={pagination ?? limit}
                  undoRedoCellEditing={true}
                  rowSelection={rowSelection}
                  rowModelType={"clientSide"}
                  undoRedoCellEditingLimit={5}
                  defaultColDef={defaultColDef}
                  cellSelection={cellSelection}
                  onColumnPinned={onColumnPinned}
                  suppressRowVirtualisation={false}
                  suppressColumnVirtualisation={false}
                  suppressColumnMoveAnimation={false}
                  autoGroupColumnDef={autoGroupColumnDef}
                  loadingOverlayComponent={CustomLoadingOverlay}
                  onCellValueChanged={(e) => {
                    updateObject(e.data);
                  }}
                  onSelectionChanged={(e) => {
                    setSelectedRows(e.api.getSelectedRows());
                  }}
                  onCellDoubleClicked={(params) => params.api.stopEditing()}
                />
              </>
            )}
          </Box>
        </div>
      </div>

      <AggridFooter
        view={view}
        limit={pagination ?? limit}
        count={count}
        rowData={rowData}
        refetch={refetch}
        setLimit={setLimit}
        setOffset={setOffset}
        setLoading={setLoadings}
        createChild={createChild}
        selectedRows={selectedRows}
        tableSlug={tableSlug}
      />
    </Box>
  );
};

const HeaderComponent = (props) => {
  const buttonRef = useRef(null);
  const { column } = props;
  const field = column?.colDef?.fieldObj;

  const openFilterMenu = () => {
    if (props.api && props.column && buttonRef.current) {
      props.showColumnMenu(buttonRef.current);
    }
  };

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Flex alignItems={"center"} gap={"10px"}>
        {getColumnIcon({
          column: {
            type: field?.type ?? field?.relation_type,
            table_slug: field?.table_slug ?? field?.slug,
          },
        })}
        <Text>{column?.colDef?.headerName}</Text>
      </Flex>
      <ChakraButton
        ref={buttonRef}
        onClick={openFilterMenu}
        _hover={{ background: "#EDF2F6" }}
        w={"20px"}
        h={"20px"}
        bg={"none"}
      >
        <ExpandMoreIcon
          style={{ fontSize: "24px", color: "#667085", pointerEvents: "none" }}
        />
      </ChakraButton>
    </Flex>
  );
};
