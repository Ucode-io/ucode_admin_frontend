import {useQuery, useQueryClient} from "react-query";
import style from "./style.module.scss";
import {Box, Button, Drawer} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import AggridFooter from "./AggridFooter";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
  CellStyleModule,
  CheckboxEditorModule,
  ColumnApiModule,
  DateEditorModule,
  NumberEditorModule,
  TextEditorModule,
  UndoRedoEditModule,
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
import {useDispatch, useSelector} from "react-redux";
import useTabRouter from "../../../hooks/useTabRouter";
import useDebounce from "../../../hooks/useDebounce";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteColumnModal from "./DeleteColumnModal";
import FieldCreateModal from "../../../components/DataTable/FieldCreateModal";
import {useFieldArray, useForm} from "react-hook-form";
import constructorFieldService, {
  useFieldCreateMutation,
  useFieldUpdateMutation,
} from "../../../services/constructorFieldService";
import {
  useRelationFieldUpdateMutation,
  useRelationsCreateMutation,
} from "../../../services/relationService";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import RelationSettings from "../../Constructor/Tables/Form/Relations/RelationSettings";
import constructorRelationService from "../../../services/constructorRelationService";
import {transliterate} from "../../../utils/textTranslater";
import {showAlert} from "../../../store/alert/alert.thunk";

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
]);

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
});

function AgGridTableView(props) {
  const {
    open,
    view,
    mainForm,
    menuItem,
    fieldsMap,
    searchText,
    selectedRow,
    projectInfo,
    visibleColumns,
    checkedColumns,
    selectedTabIndex,
    computedVisibleFields,
    setOpen = () => {},
    setLayoutType = () => {},
    navigateToEditPage = () => {},
    getRelationFields = () => {},
  } = props;
  const gridApi = useRef(null);
  const dispatch = useDispatch();
  const pinFieldsRef = useRef({});
  const queryClient = useQueryClient();
  const {navigateToForm} = useTabRouter();
  const {tableSlug, appId} = useParams();
  const {i18n, t} = useTranslation();
  const [columnId, setColumnId] = useState();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [rowData, setRowData] = useState([]);
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
          addRow,
          deleteFunction: deleteHandler,
          updateTreeData: updateTreeData,
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
        view?.attributes?.treeData ? updateTreeData() : refetch();
        setLoading(false);
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

  function deleteHandler(rowToDelete) {
    const allRows = [];
    gridApi.current.api.forEachNode((node) => allRows.push(node.data));
    const rowToRemove = allRows.find((row) => row.guid === rowToDelete?.guid);

    gridApi.current.api.applyTransaction({
      remove: [rowToRemove],
    });

    constructorObjectService.delete(tableSlug, rowToDelete.guid).then(() => {
      view?.attributes?.treeData ? null : refetch();
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

  function createChildTree(parentObj) {
    const newChild = {
      guid: generateGUID(),
      [`${tableSlug}_id`]: parentObj.guid,
      path: [...parentObj.path, generateGUID()],
    };
    gridApi.current.api.applyTransaction({
      add: [newChild],
    });

    constructorObjectService.create(tableSlug, {
      data: newChild,
    });
  }

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
                  rowBuffer={15}
                  theme={myTheme}
                  gridOptions={{
                    rowBuffer: 10,
                    cacheBlockSize: 10,
                    maxBlocksInCache: 10,
                  }}
                  onColumnMoved={getColumnsUpdated}
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
                  getMainMenuItems={getMainMenuItems}
                  suppressColumnVirtualisation={true}
                  treeData={view?.attributes?.treeData}
                  suppressColumnMoveAnimation={true}
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

      <DeleteColumnModal
        view={view}
        columnId={columnId}
        tableSlug={tableSlug}
        handleCloseModal={handleCloseModal}
        openDeleteModal={openDeleteModal}
      />

      <FieldCreateModal
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

export default AgGridTableView;
