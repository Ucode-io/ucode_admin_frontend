import {Button as ChakraButton, Flex, Text, grid} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Box, Button, Drawer} from "@mui/material";
import {
  CellStyleModule,
  CheckboxEditorModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  DateEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  RenderApiModule,
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
  MasterDetailModule,
  MenuModule,
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import {AgGridReact} from "ag-grid-react";
import {differenceInCalendarDays, parseISO} from "date-fns";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import useFilters from "../../../hooks/useFilters";
import useTabRouter from "../../../hooks/useTabRouter";
import {
  useFieldCreateMutation,
  useFieldUpdateMutation,
} from "../../../services/constructorFieldService";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorTableService from "../../../services/constructorTableService";
import constructorViewService from "../../../services/constructorViewService";
import layoutService from "../../../services/layoutService";
import {
  useRelationFieldUpdateMutation,
  useRelationsCreateMutation,
} from "../../../services/relationService";
import {showAlert} from "../../../store/alert/alert.thunk";
import {generateGUID} from "../../../utils/generateID";
import {pageToOffset} from "../../../utils/pageToOffset";
import {transliterate} from "../../../utils/textTranslater";
import {getColumnIcon} from "../../table-redesign/icons";
import AggridFooter from "./AggridFooter";
import NoFieldsComponent from "./AggridNewDesignHeader/NoFieldsComponent";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import AggridDefaultComponents, {
  ActionsColumn,
  IndexColumn,
} from "./Functions/AggridDefaultComponents";
import {detectStringType, queryGenerator} from "./Functions/queryGenerator";
import style from "./style.module.scss";
import getColumnEditorParams from "./valueOptionGenerator";
import DeleteColumnModal from "./DeleteColumnModal";
import FieldCreateModal from "../../../components/DataTable/FieldCreateModal";
import DrawerDetailPage from "../DrawerDetailPage";
import NewModalDetailPage from "../../../components/NewModalDetailPage";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import RelationSettings from "../../Constructor/Tables/Form/Relations/RelationSettings";

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
  ColumnApiModule,
  CellStyleModule,
  DateEditorModule,
  UndoRedoEditModule,
  RenderApiModule,
  MasterDetailModule,
  ServerSideRowModelApiModule,
]);

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
});

function AggridTreeView(props) {
  const {
    open,
    view,
    mainForm,
    menuItem,
    fieldsMap,
    searchText,
    projectInfo,
    visibleColumns,
    checkedColumns,
    selectedTabIndex,
    computedVisibleFields,
    getRelationFields = () => {},
    setLayoutType = () => {},
    navigateToEditPage = () => {},
    navigateCreatePage,
    setOpen,
    selectedRow,
    navigateToDetailPage,
  } = props;
  const gridApi = useRef(null);
  const dispatch = useDispatch();
  const pinFieldsRef = useRef({});
  const queryClient = useQueryClient();
  const addClickedRef = useRef(false);
  const {tableSlug, appId} = useParams();
  const {i18n, t} = useTranslation();
  const [columnId, setColumnId] = useState();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [groupTab, setGroupTab] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [drawerStateField, setDrawerStateField] = useState(null);
  const [drawerState, setDrawerState] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const languages = useSelector((state) => state.languages.list);
  const [fieldOptionAnchor, setFieldOptionAnchor] = useState(null);
  const {control, watch, setValue, reset, handleSubmit} = useForm();
  const slug = transliterate(watch(`attributes.label_${languages[0]?.slug}`));

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];
  const recursiveField = visibleColumns?.find(
    (el) => el?.table_slug === tableSlug
  );

  const {filters, filterChangeHandler} = useFilters(tableSlug, view.id);
  const {defaultColDef, autoGroupColumnDef, rowSelection, cellSelection} =
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

  const handleOpenFieldDrawer = (column) => {
    if (column?.attributes?.relation_data) {
      setDrawerStateField(column);
    } else {
      setDrawerState(column);
    }
  };

  const limitPage = useMemo(() => pageToOffset(offset, limit), [limit, offset]);
  const {data: tabs} = useQuery(queryGenerator(groupField, filters));

  const visibleFields = useMemo(() => {
    return visibleColumns
      ?.filter((el) => computedVisibleFields?.includes(el?.id))
      .map((item) => item?.slug);
  }, [visibleColumns, computedVisibleFields]);

  const {isLoading: isLoadingTree, refetch} = useQuery(
    ["GET_OBJECTS_TREEDATA", filters, {[groupTab?.slug]: groupTab}, searchText],
    () =>
      constructorObjectService.getListTreeData(tableSlug, {
        fields: [...visibleFields, "guid"],

        [recursiveField?.slug]: [null],
        ...filters,
      }),
    {
      onSuccess: (data) => {
        const computedRow = data?.data?.response?.map((item) => ({
          ...item,
        }));

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
        fiedlsarray: res?.data?.fields
          ?.filter((el) => el?.attributes?.field_permission?.view_permission)
          ?.map((item, index) => {
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
                item?.type === "LOOKUP"
                  ? "customFieldsRelation"
                  : "customFields",
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
          createChildTree,
          appendNewRow,
          valueGetter: (params) => {
            return (
              (Boolean(limitPage > 0) ? limitPage : 0) +
              params.node.rowIndex +
              1
            );
          },
        },
        ...view?.columns
          ?.map((columnID, index) => {
            const field = fiedlsarray?.find(
              (item) => item.columnID === columnID
            );
            if (field) {
              return {
                ...field,
                colIndex: index,
                onRowClick: navigateToEditPage,
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
          createChildTree,
          addRowTree,
          addRow,
          deleteFunction: deleteHandler,
          updateTreeData: refetch,
          cellClass: Boolean(view?.columns?.length)
            ? "actionBtn"
            : "actionBtnNoBorder",
        },
      ];
    }
  }, [fiedlsarray, view?.columns]);

  const handleOpenModal = () => setOpenDeleteModal(true);
  const handleCloseModal = () => setOpenDeleteModal(false);

  function addRow(data) {
    setLoading(true);
    constructorObjectService
      .create(tableSlug, {
        data: data,
      })
      .then((res) => {
        delete data?.new_field;
        refetch();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function addRowTree(data, params) {
    constructorObjectService
      .create(tableSlug, {
        data: data,
      })
      .then((res) => {
        const node = params?.node;

        if (!node || !node.data) return;

        const updatedData = {
          ...data,
          ...res?.data,
          new_field: false,
        };

        node.setData(updatedData);
        params.api.refreshCells({rowNodes: [node]});

        if (!node.expanded) {
          node.setExpanded(true);
        }
      })
      .catch(() => setLoading(false));
  }

  function appendNewRow() {
    const newRow = {new_field: true, guid: generateGUID()};
    gridApi.current.api.applyTransaction({
      add: [newRow],
      addIndex: 0,
    });
  }

  function removeRow(params, guid) {
    const node = params.node;
    if (!node || !node.data) return;

    if (node.data?.new_field && node.data?.guid === guid) {
      const parentNode = node.parent;

      if (!parentNode || !parentNode.data) {
        params.api.applyServerSideTransaction({
          route: [],
          remove: [node.data],
        });
        return;
      }

      const parentRoute = parentNode.data.path || [];

      params?.api?.applyServerSideTransaction({
        route: parentRoute,
        remove: [node.data],
      });
    }
  }

  const updateView = (pinnedField, updatedColumns = []) => {
    pinFieldsRef.current = {...pinFieldsRef.current, ...pinnedField};
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: updatedColumns?.length ? updatedColumns : view?.columns,
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

  function deleteHandler(rowToDelete, params) {
    constructorObjectService.delete(tableSlug, rowToDelete.guid).then(() => {
      const node = params.node;
      if (!node || !node.data) return;

      const parentNode = node.parent;

      if (!parentNode || !parentNode.data) {
        params.api.applyServerSideTransaction({
          route: [],
          remove: [node.data],
        });
        return;
      }
      const parentRoute = parentNode.data.path || [];

      params?.api?.applyServerSideTransaction({
        route: parentRoute,
        remove: [node.data],
      });
    });
  }

  const onColumnPinned = (event) => {
    const {column, pinned} = event;
    const fieldId = column?.colDef?.columnID;
    updateView({
      [fieldId]: {pinned},
    });
  };

  const sanitizeRowForGrid = (d) => {
    return {
      ...d,
      has_child: true,
      group: true,
    };
  };

  const waitUntilStoreReady = (parentNode) => {
    const parentData = parentNode?.node?.data;
    const route = parentData?.path || [];

    const newChildGUID = generateGUID();

    const child = {
      guid: newChildGUID,
      [`${tableSlug}_id`]: parentData?.guid,
      path: [...route, newChildGUID],
      has_child: false,
      group: false,
      new_field: true,
      ...visibleFields.reduce((acc, slug) => {
        acc[slug] = null;
        return acc;
      }, {}),
    };

    if (!parentData.has_child) {
      parentNode.node.data.has_child = true;

      if (parentNode?.node?.expanded) {
        parentNode.api.applyServerSideTransaction({
          route: route.slice(0, -1),
          update: [sanitizeRowForGrid(parentNode.node.data)],
        });
      }

      // setTimeout(() => {
      //   waitUntilStoreReady(parentNode);
      // }, 800);

      return;
    } else {
      parentNode?.api?.applyServerSideTransaction({
        route: route,
        add: [child],
      });
      addClickedRef.current = false;
    }
  };

  function createChildTree(parentNode) {
    !parentNode?.data?.group && parentNode.node.setExpanded(true);
    addClickedRef.current = true;
    if (parentNode?.node?.expanded && addClickedRef.current === true) {
      waitUntilStoreReady(parentNode);
    }
    if (!parentNode?.node?.data) {
      console.warn("Invalid parent node or missing data.");
      return;
    }

    parentNode?.data?.group && parentNode.node.setExpanded(true);
  }

  const getDataPath = useCallback((data) => data.path, []);
  const debouncedUpdateView = useCallback(
    useDebounce((ids) => updateView(undefined, ids), 600),
    []
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
        : projectInfo?.status === "insufficient_funds" &&
            projectInfo?.subscription_type === "paid"
          ? isWarning <= 5
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

  const getMainMenuItems = (params) => {
    const defaultItems = params.defaultItems;

    return [
      {
        name: "<span>Edit</span>",
        action: (action) => {
          setFieldCreateAnchor(true);
          setFieldData(action.column?.colDef?.fieldObj);
        },
        icon: <DeleteIcon />,
      },
      ...defaultItems,
      {
        name: '<span style="color: #FE4842;">Delete field</span>',
        action: (action) => {
          setColumnId(action?.column?.colDef?.columnID);
          handleOpenModal();
        },
        icon: <DeleteIcon />,
      },
    ];
  };

  useEffect(() => {
    if (fieldData) {
      reset({
        ...fieldData,
        attributes: {
          ...fieldData.attributes,
          format: fieldData?.type,
        },
      });
    } else {
      reset({
        attributes: {
          math: {label: "plus", value: "+"},
        },
      });
    }
  }, [fieldData]);

  const {mutate: createField} = useFieldCreateMutation({
    onSuccess: (res) => {
      reset({});
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful created", "success"));
      updateView(res?.id);
    },
  });

  const {mutate: updateField} = useFieldUpdateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["GET_TABLE_INFO"]);
      reset({});
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const {mutate: createRelation} = useRelationsCreateMutation({
    onSuccess: (res) => {
      reset({});
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const {mutate: updateRelation} = useRelationFieldUpdateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["GET_TABLE_INFO"]);
      reset({});
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const onSubmit = (values) => {
    const data = {
      ...values,
      slug: slug,
      table_id: menuItem?.table_id,
      label: slug,
      index: "string",
      required: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
      attributes: {
        ...values.attributes,
        formula: values?.attributes?.advanced_type
          ? values?.attributes?.formula
          : values?.attributes?.from_formula +
            " " +
            values?.attributes?.math?.value +
            " " +
            values?.attributes?.to_formula,
      },
    };

    const relationData = {
      ...values,
      attributes: {
        ...values.attributes,
        label: values?.table_to?.split("/")?.[0],
        ...Object.fromEntries(
          languages.map((lang) => [
            `label_${lang.slug}`,
            values?.table_to?.split("/")?.[0],
          ])
        ),
        ...Object.fromEntries(
          languages.map((lang) => [`label_to_${lang.slug}`, values?.table_from])
        ),
      },
      table_to: values?.table_to?.split("/")?.[1],
      relation_table_slug: tableSlug,
      label: values?.table_from,
      type: values?.relation_type,
      required: false,
      multiple_insert: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
    };

    if (!fieldData) {
      if (values?.type !== "RELATION") {
        createField({data, tableSlug});
      }
      if (values?.type === "RELATION") {
        createRelation({data: relationData, tableSlug});
      }
    }
    if (fieldData) {
      if (values?.view_fields) {
        updateRelation({data: values, tableSlug});
      } else {
        updateField({data, tableSlug});
      }
    }
  };

  const {update} = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const isServerSideGroup = (dataItem) => {
    return dataItem.has_child;
  };

  const getServerSideGroupKey = (dataItem) => {
    return dataItem.guid;
  };

  const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (Array.isArray(value) && value.length > 0 && value[0] !== "null") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const createServerSideDatasource = (parentId, updatedFilters, searchtext) => {
    return {
      getRows: async (params) => {
        const {startRow, endRow} = params.request;

        const limit = endRow - startRow;
        const offset = startRow;

        const parentGuid = [params?.parentNode?.data?.guid] ?? parentId;

        try {
          const resp = await constructorObjectService.getListTreeData(
            tableSlug,
            {
              fields: [...visibleFields, "guid"],
              [recursiveField?.slug]: parentGuid,
              limit,
              offset,
              ...updatedFilters,
            }
          );

          const items = resp?.data?.response || [];

          const rowData = items.map((item) => ({
            ...item,
            group: item.has_child,
          }));

          params.success({
            rowData,
            rowCount: undefined,
          });
        } catch (error) {
          console.error("Error loading tree data:", error);
          params.fail();
        }
      },
    };
  };

  const onGridReady = useCallback(
    (params) => {
      const parentGuid = [params?.parentNode?.data?.guid] ?? [null];
      const datasource = createServerSideDatasource(parentGuid, cleanedFilters);
      params.api?.setGridOption("serverSideDatasource", datasource);
    },
    [tableSlug, cleanedFilters]
  );

  useEffect(() => {
    if (gridApi?.current) {
      const newDatasource = createServerSideDatasource(null, cleanedFilters);
      gridApi?.current?.api?.setGridOption(
        "serverSideDatasource",
        newDatasource
      );
    }
  }, [cleanedFilters]);

  return (
    <Box
      sx={{
        height: `calc(100vh - ${calculatedHeight + 85}px)`,
        overflow: "scroll",
      }}>
      <div className={style.gridTableTree}>
        <div
          className="ag-theme-quartz"
          style={{
            display: "flex",
            width: "100%",
          }}>
          <Box
            className="scrollbarNone"
            sx={{width: "100%", background: "#fff"}}>
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

            <Box
              className="scrollbarNone"
              sx={{
                height: "100%",
              }}>
              {!columns?.length ? (
                <NoFieldsComponent />
              ) : (
                <>
                  <AgGridReact
                    ref={gridApi}
                    theme={myTheme}
                    gridOptions={{
                      rowBuffer: 10,
                      cacheBlockSize: 100,
                      maxBlocksInCache: 10,
                    }}
                    serverSideStoreType="serverSide"
                    serverSideTransaction={true}
                    onColumnMoved={getColumnsUpdated}
                    columnDefs={columns}
                    enableClipboard={true}
                    groupDisplayType="single"
                    paginationPageSize={limit}
                    undoRedoCellEditing={true}
                    rowSelection={rowSelection}
                    isServerSideGroup={isServerSideGroup}
                    getServerSideGroupKey={getServerSideGroupKey}
                    rowModelType={"serverSide"}
                    undoRedoCellEditingLimit={5}
                    defaultColDef={defaultColDef}
                    cellSelection={cellSelection}
                    onColumnPinned={onColumnPinned}
                    getMainMenuItems={getMainMenuItems}
                    treeData={true}
                    onRowGroupOpened={(params) => {
                      addClickedRef.current === true &&
                        setTimeout(() => {
                          waitUntilStoreReady(params);
                          addClickedRef.current = false;
                        }, 1100);
                    }}
                    getRowId={(params) => params?.data?.guid}
                    autoGroupColumnDef={autoGroupColumnDef}
                    suppressServerSideFullWidthLoadingRow={true}
                    loadingOverlayComponent={CustomLoadingOverlay}
                    onGridReady={onGridReady}
                    getDataPath={getDataPath}
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
          </Box>
        </div>
      </div>

      <DeleteColumnModal
        view={view}
        columnId={columnId}
        tableSlug={tableSlug}
        handleCloseModal={handleCloseModal}
        openDeleteModal={openDeleteModal}
      />

      <FieldCreateModal
        mainForm={mainForm}
        // tableLan={tableLan}
        anchorEl={fieldCreateAnchor}
        setAnchorEl={setFieldCreateAnchor}
        watch={watch}
        control={control}
        setValue={setValue}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        // target={target}
        fields={visibleColumns}
        setFieldOptionAnchor={setFieldOptionAnchor}
        reset={reset}
        menuItem={menuItem}
        fieldData={fieldData}
        handleOpenFieldDrawer={handleOpenFieldDrawer}
      />

      {Boolean(open && projectInfo?.new_layout) &&
      selectedViewType === "SidePeek" ? (
        <DrawerDetailPage
          projectInfo={projectInfo}
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
          navigateCreatePage={navigateCreatePage}
        />
      ) : selectedViewType === "CenterPeek" ? (
        <NewModalDetailPage
          modal={true}
          projectInfo={projectInfo}
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
          navigateCreatePage={navigateCreatePage}
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

      <Drawer
        open={drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal">
        <FieldSettings
          closeSettingsBlock={() => setDrawerState(null)}
          isTableView={true}
          onSubmit={(index, field) => update(index, field)}
          field={drawerState}
          formType={drawerState}
          mainForm={mainForm}
          selectedTabIndex={selectedTabIndex}
          height={`calc(100vh - 48px)`}
          getRelationFields={getRelationFields}
          menuItem={menuItem}
        />
      </Drawer>

      <Drawer
        open={drawerStateField}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal">
        <RelationSettings
          relation={drawerStateField}
          closeSettingsBlock={() => setDrawerStateField(null)}
          getRelationFields={getRelationFields}
          formType={drawerStateField}
          height={`calc(100vh - 48px)`}
        />
      </Drawer>
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

export default AggridTreeView;
