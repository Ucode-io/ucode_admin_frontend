import { useViewContext } from "@/providers/ViewProvider"

import DeleteIcon from "@mui/icons-material/Delete";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import useFilters from "@/hooks/useFilters";
import {
  useFieldCreateMutation,
  useFieldUpdateMutation,
} from "@/services/constructorFieldService";
import constructorObjectService from "@/services/constructorObjectService";
import constructorTableService from "@/services/constructorTableService";
import constructorViewService from "@/services/constructorViewService";
import {
  useRelationFieldUpdateMutation,
  useRelationsCreateMutation,
} from "@/services/relationService";
import {showAlert} from "@/store/alert/alert.thunk";
import {generateGUID} from "@/utils/generateID";
import {pageToOffset} from "@/utils/pageToOffset";
import {transliterate} from "@/utils/textTranslater";
import AggridDefaultComponents, {
  ActionsColumn,
  IndexColumn,
} from "./Functions/AggridDefaultComponents";
import getColumnEditorParams from "./valueOptionGenerator";
import { Flex, Text, Button as ChakraButton } from "@chakra-ui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import {isSubscriptionBannerVisible} from "@/utils/subscriptionWarning";

export const useGridProps = () => {
  const {
    view,
    tableSlug,
    visibleColumns,
    viewForm,
    computedVisibleFields,
    projectInfo,
    menuItem,
    tabs,
    selectedTabIndex,
    navigateToEditPage,
  } = useViewContext();

  const gridApi = useRef(null);
  const dispatch = useDispatch();
  const pinFieldsRef = useRef({});
  const queryClient = useQueryClient();
  const addClickedRef = useRef(false);

  const { i18n } = useTranslation();

  const [columnId, setColumnId] = useState();

  const [limit] = useState(10);
  const [offset] = useState(0);

  const [groupTab, setGroupTab] = useState(null);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [drawerStateField, setDrawerStateField] = useState(null);

  const [drawerState, setDrawerState] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const languages = useSelector((state) => state.languages.list);

  const { control, watch, setValue, reset, handleSubmit, register } = useForm();

  const slug = transliterate(watch(`attributes.label_${languages[0]?.slug}`));

  const initialTableInfo = useSelector((state) => state.drawer.tableInfo);

  const recursiveField = visibleColumns?.find(
    (el) => el?.table_slug === tableSlug,
  );

  const { filters } = useFilters(tableSlug, view.id);

  const handleOpenFieldDrawer = (column) => {
    if (column?.attributes?.relation_data) {
      setDrawerStateField(column);
    } else {
      setDrawerState(column);
    }
  };

  const limitPage = useMemo(() => pageToOffset(offset, limit), [limit, offset]);

  const visibleFields = useMemo(() => {
    return visibleColumns
      ?.filter((el) => computedVisibleFields?.includes(el?.id))
      .map((item) => item?.slug);
  }, [visibleColumns, computedVisibleFields]);

  useEffect(() => {
    import("react-quill");
  }, []);

  const {
    data: { fiedlsarray } = {
      pageCount: 1,
      fiedlsarray: [],
      custom_events: [],
    },
  } = useQuery({
    queryKey: ["GET_TABLE_INFO", tableSlug, view],
    queryFn: () =>
      constructorTableService.getTableInfo(tableSlug, { data: {} }),
    enabled: Boolean(tableSlug),
    select: (res) => {
      return {
        fiedlsarray: res?.data?.fields
          ?.filter((el) => el?.attributes?.field_permission?.view_permission)
          ?.map((item) => {
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
              valueGetter: (params) => {
                if (!params.data) return null;
                const lang = i18n.language;
                const fieldName = item?.slug;

                return (
                  params.data[`${fieldName}_${lang}`] ||
                  params.data[`${fieldName}_en`] ||
                  params.data[fieldName]
                );
              },

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

  const { defaultColDef, autoGroupColumnDef, rowSelection, cellSelection } =
    AggridDefaultComponents({
      customAutoGroupColumnDef: {
        suppressCount: true,
        fields: visibleColumns,
        view,
        tableSlug,
        fiedlsarray,
      },
    });

  const columns = useMemo(() => {
    if (fiedlsarray?.length) {
      return [
        {
          ...IndexColumn,
          menuItem,
          view,
          treeData: true,
          addRow: addRowTree,
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
        ...(view?.columns
          ?.map((columnID, index) => {
            const field = fiedlsarray?.find(
              (item) => item.columnID === columnID,
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
          .filter(Boolean) ?? []),
        {
          ...ActionsColumn,
          view,
          selectedTabIndex,
          menuItem,
          removeRow,
          createChildTree,
          addRow: addRowTree,
          deleteFunction: deleteHandler,
          cellClass: Boolean(view?.columns?.length)
            ? "actionBtn"
            : "actionBtnNoBorder",
        },
      ];
    }
  }, [fiedlsarray, view?.columns, i18n.language]);

  const handleOpenModal = () => setOpenDeleteModal(true);
  const handleCloseModal = () => setOpenDeleteModal(false);

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
        params.api.refreshCells({ rowNodes: [node] });

        if (!node.expanded) {
          node.setExpanded(true);
        }
      });
  }

  function appendNewRow() {
    const newRow = { new_field: true, guid: generateGUID() };
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
    pinFieldsRef.current = { ...pinFieldsRef.current, ...pinnedField };
    constructorViewService.update(tableSlug, {
      ...view,
      columns: updatedColumns?.length ? updatedColumns : view?.columns,
      attributes: {
        ...view.attributes,
        pinnedFields: pinFieldsRef.current,
      },
    });
  };

  const updateObject = (data) => {
    if (!data?.new_field) {
      constructorObjectService.update(tableSlug, { data: { ...data } });
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
    const { column, pinned } = event;
    const fieldId = column?.colDef?.columnID;
    updateView({
      [fieldId]: { pinned },
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

  const isSubscriptionBannerActive = isSubscriptionBannerVisible(projectInfo);

  const calculatedHeight = useMemo(() => {
    let warningHeight = 0;

    if (isSubscriptionBannerActive) {
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
    isSubscriptionBannerActive,
  ]);

  const getMainMenuItems = (params) => {
    const defaultItems = params.defaultItems;

    return [
      {
        name: "Edit",
        action: (action) => {
          setFieldCreateAnchor(true);
          setFieldData(action.column?.colDef?.fieldObj);
        },
        icon: <DeleteIcon />,
      },
      ...defaultItems,
      {
        name: "Delete field",
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
          math: { label: "plus", value: "+" },
        },
      });
    }
  }, [fieldData]);

  const { mutate: createField } = useFieldCreateMutation({
    onSuccess: (res) => {
      reset({});
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful created", "success"));
      updateView(res?.id);
    },
  });

  const { mutate: updateField } = useFieldUpdateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["GET_TABLE_INFO"]);
      reset({});
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const { mutate: createRelation } = useRelationsCreateMutation({
    onSuccess: (res) => {
      reset({});
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const { mutate: updateRelation } = useRelationFieldUpdateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["GET_TABLE_INFO"]);
      reset({});
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
          ]),
        ),
        ...Object.fromEntries(
          languages.map((lang) => [
            `label_to_${lang.slug}`,
            values?.table_from,
          ]),
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
        createField({ data, tableSlug });
      }
      if (values?.type === "RELATION") {
        createRelation({ data: relationData, tableSlug });
      }
    }
    if (fieldData) {
      if (values?.view_fields) {
        updateRelation({ data: values, tableSlug });
      } else {
        updateField({ data, tableSlug });
      }
    }
  };

  const { update } = useFieldArray({
    control: viewForm.control,
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

  const createServerSideDatasource = (parentId, updatedFilters) => {
    return {
      getRows: async (params) => {
        const { startRow, endRow } = params.request;

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
            },
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
    [tableSlug, cleanedFilters],
  );

  useEffect(() => {
    if (gridApi.current) {
      if (gridApi.current?.api?.refreshCells)
        gridApi.current?.api?.refreshCells({ force: true });
      if (gridApi.current?.api?.refreshHeader)
        gridApi.current?.api?.refreshHeader();
    }
  }, [i18n.language, gridApi]);

  return {
    view,
    tableSlug,
    visibleColumns,
    viewForm,
    menuItem,
    tabs,
    selectedTabIndex,
    calculatedHeight,
    setGroupTab,
    groupTab,
    columns,
    gridApi,
    getColumnsUpdated,
    limit,
    rowSelection,
    isServerSideGroup,
    getServerSideGroupKey,
    defaultColDef,
    cellSelection,
    onColumnPinned,
    getMainMenuItems,
    addClickedRef,
    waitUntilStoreReady,
    autoGroupColumnDef,
    onGridReady,
    getDataPath,
    updateObject,
    columnId,
    handleCloseModal,
    openDeleteModal,
    initialTableInfo,
    fieldCreateAnchor,
    setFieldCreateAnchor,
    watch,
    control,
    setValue,
    handleSubmit,
    onSubmit,
    reset,
    fieldData,
    handleOpenFieldDrawer,
    register,
    drawerState,
    setDrawerState,
    update,
    setDrawerStateField,
    drawerStateField,
  };
};

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
