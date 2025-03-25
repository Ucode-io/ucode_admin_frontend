import {useQuery} from "react-query";
import style from "./style.module.scss";
import {Box, Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import AggridFooter from "./AggridFooter";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {ValidationModule, themeQuartz} from "ag-grid-community";
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
} from "ag-grid-enterprise";
import AggridDefaultComponents, {
  IndexColumn,
  ActionsColumn,
} from "./Functions/AggridDefaultComponents";
import NoFieldsComponent from "./AggridNewDesignHeader/NoFieldsComponent";
import {Flex, Text} from "@chakra-ui/react";
import {getColumnIcon} from "../../table-redesign/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Button as ChakraButton} from "@chakra-ui/react";

ModuleRegistry.registerModules([
  MenuModule,
  // ClipboardModule,
  ColumnsToolPanelModule,
  ServerSideRowModelModule,
  ClientSideRowModelModule,
  RowSelectionModule,
  RowGroupingModule,
  TreeDataModule,
  ValidationModule,
  CellSelectionModule,
]);

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
});

function AgGridTableView(props) {
  const {
    view,
    views,
    menuItem,
    fieldsMap,
    updateField,
    visibleForm,
    visibleColumns,
    checkedColumns,
    selectedTabIndex,
    columnsForSearch,
    setCheckedColumns,
    computedVisibleFields,
    visibleRelationColumns,
  } = props;
  const gridApi = useRef(null);
  const pinFieldsRef = useRef({});
  const {tableSlug} = useParams();
  const {i18n, t} = useTranslation();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupTab, setGroupTab] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

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
        setRowData([...data?.data?.response] ?? []);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  const {isLoading: isLoadingTree, refetch: updateTreeData} = useQuery(
    ["GET_OBJECTS_TREEDATA", filters],
    () =>
      constructorObjectService.getListTreeData(tableSlug, {
        fields: [...visibleFields, "guid"],
        ...filters,
      }),
    {
      enabled: !!tableSlug && view?.attributes?.treeData,
      onSuccess: (data) => {
        setRowData([
          ...data?.data?.response,
          {
            field: "actions",
            headerName: "Actions",
            cellRenderer: ButtonCellRenderer,
          },
        ]);
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
            checkboxSelection: false,
            headerCheckboxSelection: false,
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

  // const getFilteredFilterFields = useMemo(() => {
  //   const filteredFieldsView =
  //     views &&
  //     views?.find((item) => {
  //       return item?.type === "TABLE" && item?.attributes?.quick_filters;
  //     });

  //   const quickFilters = filteredFieldsView?.attributes?.quick_filters?.map(
  //     (el) => {
  //       return el?.field_id;
  //     }
  //   );
  //   const filteredFields = fiedlsarray?.filter((item) => {
  //     return quickFilters?.includes(item?.columnID);
  //   });

  //   return filteredFields;
  // }, [views, fiedlsarray]);

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
    const emptyRow = {
      new_field: true,
    };

    const newRow = {...emptyRow, guid: generateGUID()};
    gridApi.current.api.applyTransaction({
      add: [newRow],
      addIndex: 0,
    });
  }

  const ButtonCellRenderer = (params) => {
    if (params.node.rowPinned) {
      return (
        <button
        // onClick={addNewRow}
        >
          ➕ Add Row
        </button>
      );
    }
    return null;
  };

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

  return (
    <Box sx={{height: "calc(100vh - 90px)", overflow: "scroll"}}>
      <div className={style.gridTable}>
        <div
          className="ag-theme-quartz"
          style={{
            height: `calc(100vh - ${Boolean(tabs?.length) ? 154 : 95}px)`,
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
                  rowBuffer={6}
                  theme={myTheme}
                  rowData={rowData}
                  loading={loading}
                  columnDefs={columns}
                  suppressRefresh={true}
                  enableClipboard={true}
                  showOpenedGroup={true}
                  groupDisplayType="single"
                  suppressAutoColumn={true}
                  paginationPageSize={limit}
                  undoRedoCellEditing={true}
                  rowSelection={rowSelection}
                  rowModelType={"clientSide"}
                  undoRedoCellEditingLimit={5}
                  defaultColDef={defaultColDef}
                  cellSelection={cellSelection}
                  onColumnPinned={onColumnPinned}
                  suppressColumnVirtualisation={true}
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
