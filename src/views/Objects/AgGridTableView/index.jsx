import {useQuery} from "react-query";
import style from "./style.module.scss";
import {Box, Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import AggridFooter from "./AggridFooter";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  CheckboxEditorModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  themeQuartz,
} from "ag-grid-community";
import useFilters from "../../../hooks/useFilters";
import {generateGUID} from "../../../utils/generateID";
import {pageToOffset} from "../../../utils/pageToOffset";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import getColumnEditorParams from "./valueOptionGenerator";
import {detectStringType, queryGenerator} from "./Functions/queryGenerator";
import constructorViewService from "../../../services/constructorViewService";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import constructorTableService from "../../../services/constructorTableService";
import constructorObjectService from "../../../services/constructorObjectService";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
} from "ag-grid-community";
import {
  MenuModule,
  ColumnsToolPanelModule,
  ServerSideRowModelModule,
  RowGroupingModule,
  TreeDataModule,
  CellSelectionModule,
  ClipboardModule,
} from "ag-grid-enterprise";
import AggridDefaultComponents, {
  IndexColumn,
  ActionsColumn,
} from "./Functions/AggridDefaultComponents";
import {mergeStringAndState} from "@/utils/jsonPath";
import NoFieldsComponent from "./AggridNewDesignHeader/NoFieldsComponent";
import {Flex, Text} from "@chakra-ui/react";
import {getColumnIcon} from "../../table-redesign/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Button as ChakraButton} from "@chakra-ui/react";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import NewModalDetailPage from "../../../components/NewModalDetailPage";
import DrawerDetailPage from "../DrawerDetailPage";
import layoutService from "../../../services/layoutService";
import {differenceInCalendarDays, parseISO} from "date-fns";
import {useSelector} from "react-redux";

ModuleRegistry.registerModules([
  MenuModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ServerSideRowModelModule,
  ClientSideRowModelModule,
  RowSelectionModule,
  RowGroupingModule,
  TreeDataModule,
  ValidationModule,
  CellSelectionModule,
  TextEditorModule,
  CheckboxEditorModule,
  NumberEditorModule,
]);

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
});

function AgGridTableView(props) {
  const {
    open,
    view,
    menuItem,
    fieldsMap,
    selectedRow,
    projectInfo,
    visibleColumns,
    checkedColumns,
    selectedTabIndex,
    computedVisibleFields,
    setOpen = () => {},
    setLayoutType = () => {},
    navigateToEditPage = () => {},
  } = props;
  const gridApi = useRef(null);
  const pinFieldsRef = useRef({});
  const {tableSlug, appId} = useParams();
  const {i18n, t} = useTranslation();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupTab, setGroupTab] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedViewType, setSelectedViewType] = useState({
    label: "Side peek",
    icon: "SidePeek",
  });

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];
  const {filters, filterChangeHandler} = useFilters(tableSlug, view.id);
  const {defaultColDef, autoGroupColumnDef, rowSelection, cellSelection} =
    AggridDefaultComponents({
      customAutoGroupColumnDef: {
        suppressCount: true,
        fields: visibleColumns,
        view,
      },
    });

  const tableSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

  const limitPage = useMemo(() => pageToOffset(offset, limit), [limit, offset]);
  const {data: tabs} = useQuery(queryGenerator(groupField, filters));

  const visibleFields = useMemo(() => {
    return visibleColumns
      ?.filter((el) => computedVisibleFields?.includes(el?.id))
      .map((item) => item?.slug);
  }, [visibleColumns, computedVisibleFields]);

  const {isLoading, refetch} = useQuery(
    [
      "GET_OBJECTS_LIST_DATA",
      {
        tableSlug,
        filters: {
          offset,
          limit,
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
          limit,
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
      enabled: !!tableSlug && !view?.attributes?.treeData,
      onSuccess: (data) => {
        setCount(data?.data?.count);
        setRowData([...(data?.data?.response ?? [])] ?? []);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  const {isLoading: isLoadingTree, refetch: updateTreeData} = useQuery(
    ["GET_OBJECTS_TREEDATA", filters, {[groupTab?.slug]: groupTab}],
    () =>
      constructorObjectService.getListTreeData(tableSlug, {
        fields: [...visibleFields, "guid"],
        [groupTab?.slug]: [groupTab?.value],
        ...filters,
      }),
    {
      enabled: Boolean(tableSlug && view?.attributes?.treeData),
      onSuccess: (data) => {
        setRowData([...(data?.data?.response ?? [])]);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  const {
    data: {fiedlsarray} = {
      pageCount: 1,
      fiedlsarray: [],
      custom_events: [],
    },
  } = useQuery({
    queryKey: ["GET_TABLE_INFO", tableSlug, view],
    queryFn: () => constructorTableService.getTableInfo(tableSlug, {data: {}}),
    enabled: Boolean(tableSlug),
    select: (res) => {
      return {
        fiedlsarray: res?.data?.fields?.map((item, index) => {
          const columnDef = {
            view,
            flex: 1,
            minWidth: 250,
            editable: true,
            enableRowGroup: true,
            fieldObj: item,
            field: item?.slug,
            rowGroup: view?.attributes?.group_by_columns?.includes(item?.id)
              ? true
              : false,
            cellClass:
              item?.type === "LOOKUP" ? "customFieldsRelation" : "customFields",
            gridApi: gridApi,
            columnID:
              item?.type === "LOOKUP"
                ? item?.relation_id
                : item?.id || generateGUID(),
            headerName:
              item?.attributes?.[`label_${i18n?.language}`] || item?.label,
            headerComponent: HeaderComponent,
            pinned: view?.attributes?.pinnedFields?.[item?.id]?.pinned ?? "",
          };
          getColumnEditorParams(item, columnDef);
          return columnDef;
        }),
      };
    },
  });

  const {
    data: {layout} = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onSuccess: (data) => {
      if (data?.layout?.type === "PopupLayout") {
        setLayoutType("PopupLayout");
      } else {
        setLayoutType("SimpleLayout");
      }
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const columns = useMemo(() => {
    if (fiedlsarray?.length) {
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
        ...fiedlsarray
          ?.filter((item) => view?.columns?.includes(item?.columnID))
          .map((el, index) => ({
            ...el,
            colIndex: index,
            onRowClick: navigateToEditPage,
          })),
        {
          ...ActionsColumn,
          view,
          selectedTabIndex,
          menuItem,
          removeRow,
          addRow,
          deleteFunction: deleteHandler,
          updateTreeData: updateTreeData,
          cellClass: Boolean(view?.columns?.length)
            ? "actionBtn"
            : "actionBtnNoBorder",
        },
      ];
    }
  }, [fiedlsarray, view]);

  function addRow(data) {
    setLoading(true);
    constructorObjectService
      .create(tableSlug, {
        data: data,
      })
      .then((res) => {
        delete data?.new_field;
        view?.attributes?.treeData ? updateTreeData() : refetch();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function appendNewRow() {
    console.log("append Worked");
    const newRow = {new_field: true, guid: generateGUID()};
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

  const updateView = (pinnedField) => {
    pinFieldsRef.current = {...pinFieldsRef.current, ...pinnedField};

    constructorViewService
      .update(tableSlug, {
        ...view,
        attributes: {
          ...view.attributes,
          pinnedFields: pinFieldsRef.current,
        },
      })
      .catch((err) => setLoading(true));
  };

  const updateObject = (data) => {
    if (!data?.new_field) {
      constructorObjectService.update(tableSlug, {data: {...data}});
    }
  };

  function deleteHandler(row) {
    constructorObjectService.delete(tableSlug, row.guid).then(() => {
      view?.attributes?.treeData ? updateTreeData() : refetch();
    });
  }

  const onColumnPinned = (event) => {
    const {column, pinned} = event;
    const fieldId = column?.colDef?.columnID;
    updateView({
      [fieldId]: {pinned},
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

  const getDataPath = useCallback((data) => data.path, []);

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
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;
      let query = urlTemplate;

      const variablePattern = /\{\{\$\.(.*?)\}\}/g;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
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
    (state) => state.main.tableViewFiltersOpen
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
      sx={{
        height: `calc(100vh - ${calculatedHeight + 85}px)`,
        overflow: "scroll",
      }}>
      <div className={style.gridTable}>
        <div
          className="ag-theme-quartz"
          style={{
            minHeight: `calc(100vh - ${Boolean(tabs?.length) ? 154 : 95}px)`,
            display: "flex",
            width: "100%",
          }}>
          <Box sx={{width: "100%", background: "#fff"}}>
            {Boolean(tabs?.length) && (
              <Box
                sx={{
                  display: "flex",
                  padding: "10px 0 0 20px",
                  borderBottom: "1px solid #eee",
                }}>
                {tabs?.map((item) => (
                  <Button
                    key={item.value}
                    onClick={() => {
                      setLoading(true);
                      setGroupTab(item);
                    }}
                    variant="outlined"
                    className={
                      groupTab?.value === item?.value
                        ? style.tabGroupBtnActive
                        : style.tabGroupBtn
                    }>
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
                  rowBuffer={45}
                  theme={myTheme}
                  gridOptions={{
                    rowBuffer: 50,
                    cacheBlockSize: 100,
                    maxBlocksInCache: 100,
                  }}
                  rowData={rowData}
                  loading={loading}
                  columnDefs={columns}
                  suppressRefresh={true}
                  enableClipboard={true}
                  groupDisplayType="single"
                  paginationPageSize={limit}
                  undoRedoCellEditing={true}
                  rowSelection={rowSelection}
                  rowModelType={"clientSide"}
                  undoRedoCellEditingLimit={5}
                  defaultColDef={defaultColDef}
                  cellSelection={cellSelection}
                  onColumnPinned={onColumnPinned}
                  suppressColumnVirtualisation={false}
                  treeData={view?.attributes?.treeData}
                  autoGroupColumnDef={autoGroupColumnDef}
                  suppressServerSideFullWidthLoadingRow={true}
                  loadingOverlayComponent={CustomLoadingOverlay}
                  getDataPath={
                    view?.attributes?.treeData ? getDataPath : undefined
                  }
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
        limit={limit}
        count={count}
        rowData={rowData}
        refetch={refetch}
        setLimit={setLimit}
        setOffset={setOffset}
        setLoading={setLoading}
        createChild={createChild}
        selectedRows={selectedRows}
        updateTreeData={updateTreeData}
      />

      {Boolean(open && projectInfo?.new_layout) &&
      selectedViewType?.icon === "SidePeek" ? (
        <DrawerDetailPage
          open={open}
          setOpen={setOpen}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToDetailPage}
        />
      ) : selectedViewType?.icon === "CenterPeek" ? (
        <NewModalDetailPage
          open={open}
          setOpen={setOpen}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToDetailPage}
        />
      ) : null}

      {Boolean(open && !projectInfo?.new_layout) && (
        <ModalDetailPage
          open={open}
          setOpen={setOpen}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToDetailPage}
        />
      )}
    </Box>
  );
}

const HeaderComponent = (props) => {
  const buttonRef = useRef(null);
  const {column} = props;
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
        _hover={{background: "#EDF2F6"}}
        w={"20px"}
        h={"20px"}
        bg={"none"}>
        <ExpandMoreIcon
          style={{fontSize: "24px", color: "#667085", pointerEvents: "none"}}
        />
      </ChakraButton>
    </Flex>
  );
};

export default AgGridTableView;
