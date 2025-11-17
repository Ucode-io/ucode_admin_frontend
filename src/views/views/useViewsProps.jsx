import { viewsActions } from "@/store/views/view.slice";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import {
  useGetViewsList,
  useUpdateViewMutation,
} from "@/services/viewsService/views.service";
import { useGetTableInfo } from "@/services/menuService/menu.service";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { listToMap, listToMapWithoutRel } from "@/utils/listToMap";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { openDB, saveOrUpdateSearchText } from "@/utils/indexedDb";
import { updateObject } from "@/services/objectService/object.service";
import { useFieldArray, useForm } from "react-hook-form";
import { addDays } from "date-fns";
import { useProjectGetByIdQuery } from "@/services/projectService";
import useTabRouter from "@/hooks/useTabRouter";
import { generateGUID } from "@/utils/generateID";
import { useTableByIdQuery } from "@/services/tableService/table.service";
import { useMenuGetByIdQuery } from "@/services/menuService";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import { useGetLayout } from "@/services/layoutService/layout.service";
import { DRAWER_LAYOUT_TYPES } from "@/utils/constants/drawerConstants";
import { Section } from "./modules/Section";
import { mainActions } from "@/store/main/main.slice";
import { useQuery } from "react-query";
import { queryGenerator } from "@/utils/queryGenerator";
import useFilters from "@/hooks/useFilters";
import { ViewTabs } from "./components/ViewTabs";

import { Table } from "./modules/Table";
import { Timeline } from "./modules/Timeline";
import { Board } from "./modules/Board";
import { TableGroup } from "./modules/TableGroup";

export const useViewsProps = ({ isRelationView }) => {
  const { views: viewsFromStore } = useSelector((state) => state.views);
  const mainTabIndex = useSelector((state) => state.drawer.mainTabIndex);
  const drawerTabIndex = useSelector((state) => state.drawer.drawerTabIndex);
  const selectedTabIndex = isRelationView ? drawerTabIndex : mainTabIndex;

  const roleName = useSelector((state) => state.auth?.roleInfo?.name);
  const projectId = useSelector((state) => state.auth.projectId);

  const viewsPath = useSelector((state) => state.groupField.viewsPath);
  const viewsList = useSelector((state) => state.groupField.viewsList);

  const lastPath = viewsPath?.[viewsPath.length - 1];
  const selectedV = viewsList?.[viewsList.length - 1];

  const paginationCounts = useSelector(
    (state) => state?.pagination?.paginationCount,
  );

  const { i18n } = useTranslation();

  const { menuId, id } = useParams();
  const { state, pathname } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { navigateToForm } = useTabRouter();

  const settingsForm = useForm({
    defaultValues: {
      calendar_from_slug: "",
      calendar_to_slug: "",
    },
  });

  const [relationViews, setRelationViews] = useState([]);
  const [selectedView, setSelectedView] = useState(null);

  const [menuItem, setMenuItem] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);

  const [sortPopupAnchorEl, setSortPopupAnchorEl] = useState(null);

  const { selectedViewType } = useSelector((state) => state.main);

  const setSelectedViewType = (value) => {
    dispatch(mainActions.setSelectedViewType(value));
  };

  const view = selectedView;

  const groupTable = view?.attributes?.group_by_columns;
  // const [selectedViewType, setSelectedViewType] = useState(
  //   localStorage?.getItem("detailPage"),
  // );

  // For TIMELINE view
  const [noDates, setNoDates] = useState([]);
  const [centerDate, setCenterDate] = useState(null);

  const [selectedRow, setSelectedRow] = useState("");
  const [layoutType, setLayoutType] = useState(DRAWER_LAYOUT_TYPES.POPUP);

  const [searchText, setSearchText] = useState("");
  const [checkedColumns, setCheckedColumns] = useState([]);

  const [orderBy, setOrderBy] = useState(false);
  const [sortedDatas, setSortedDatas] = useState([]);

  const query = new URLSearchParams(window.location.search);
  const viewId = isRelationView
    ? query.get("dv")
    : (query.get("v") ?? selectedView?.id);

  const tableSlug = selectedView?.table_slug;
  const viewType = selectedView?.type;

  const { filters } = useFilters(tableSlug, viewId);

  const paginationCount = useMemo(() => {
    const getObject = paginationCounts.find(
      (el) => el?.tableSlug === tableSlug,
    );

    return getObject?.pageCount ?? 1;
  }, [paginationCounts, tableSlug]);

  const [currentPage, setCurrentPage] = useState(paginationCount);

  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug],
  );

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const viewsMap = {
    [VIEW_TYPES_MAP.TABLE]: (props) => (
      <MaterialUIProvider style={{ height: "100%" }}>
        {groupTable.length > 0 ? (
          <TableGroup {...props} />
        ) : (
          <Table {...props} />
        )}
      </MaterialUIProvider>
    ),
    [VIEW_TYPES_MAP.TREE]: () => <></>,
    [VIEW_TYPES_MAP.GRID]: () => <></>,
    [VIEW_TYPES_MAP.BOARD]: () => <Board />,
    [VIEW_TYPES_MAP.TIMELINE]: () => <Timeline />,
    [VIEW_TYPES_MAP.CALENDAR]: () => <></>,
    [VIEW_TYPES_MAP.WEBSITE]: () => <></>,
    [VIEW_TYPES_MAP.SECTION]: (props) => (
      <MaterialUIProvider>
        <Section {...props} />
      </MaterialUIProvider>
    ),
  };

  const viewsWithoutTabs = [
    VIEW_TYPES_MAP.BOARD,
    VIEW_TYPES_MAP.TIMELINE,
    VIEW_TYPES_MAP.CALENDAR,
    VIEW_TYPES_MAP.WEBSITE,
  ];

  const getView = (viewType) => {
    if (!viewsMap[viewType]) return <></>;

    if (viewsWithoutTabs.includes(viewType) || !tabs?.length) {
      return viewsMap[viewType]();
    } else {
      return (
        <ViewTabs view={view} tabs={tabs} element={viewsMap[viewType]} />
        // <Tabs
        //   direction={"ltr"}
        //   defaultIndex={0}
        //   style={{
        //     height: "100%",
        //   }}
        // >
        //   {tabs?.map((tab) => (
        //     <TabPanel key={tab?.value}>{viewsMap[viewType]({ tab })}</TabPanel>
        //   ))}
        // </Tabs>
      );
    }
  };

  const viewForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: menuId,
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });

  const fieldsForm = useForm({
    defaultValues: {
      multi: [],
    },
    shouldUnregister: true,
  });

  const { fields } = useFieldArray({
    control: fieldsForm.control,
    name: "multi",
  });

  // For TIMELINE view
  const handleAddDate = (item) => {
    const startDate = new Date(centerDate).toISOString();
    const endDate = addDays(new Date(centerDate), 5).toISOString();

    updateObject({
      ...item,
      [settingsForm.getValues()["calendar_from_slug"]]: startDate,
      [settingsForm.getValues()["calendar_to_slug"]]: endDate,
    });
  };

  const saveSearchTextToDB = async (tableSlug, searchText) => {
    const db = await openDB();
    await saveOrUpdateSearchText(db, tableSlug, searchText);
  };

  const handleSearchOnChange = (value) => {
    setCurrentPage(1);
    setSearchText(value);
    saveSearchTextToDB(tableSlug, value);
  };

  const handleSortClick = (e) => {
    setSortPopupAnchorEl(e.currentTarget);
  };

  const navigateCreatePage = () => {
    if (projectInfo?.new_layout) {
      const isOldUrlVariant = typeof view?.attributes?.url_object === "string";

      if (
        view?.attributes?.url_object?.url ||
        (isOldUrlVariant && view?.attributes?.url_object)
      ) {
        if (isOldUrlVariant) {
          navigate(
            `/${menuId}/page/${view?.attributes?.url_object}?create=true`,
          );
        } else {
          const urlParams = view?.attributes?.url_object?.params;
          const params = new URLSearchParams(
            Object.fromEntries(
              urlParams?.map((item) => [item.key, item.value]),
            ),
          ).toString();

          navigate(
            `/${menuId}/page/${view?.attributes?.url_object?.url}?${params}`,
          );
        }
      } else {
        dispatch(detailDrawerActions.openDrawer());
      }
      setSelectedRow(null);
    } else {
      if (layoutType === "PopupLayout") {
        dispatch(detailDrawerActions.openDrawer());
        setSelectedRow(null);
      } else {
        navigateToForm(tableSlug, "CREATE", {}, { id }, menuId);
      }
    }
  };

  const selectAll = () => {
    setCheckedColumns(
      columnsForSearch
        .filter((item) => item.is_search === true)
        .map((item) => item.slug),
    );
  };

  const { refetch: refetchViewsList, isRefetching } = useGetViewsList(menuId, {
    enabled: Boolean(menuId),
    select: (res) => {
      const relationViews =
        res?.views?.filter(
          (item) => item?.type === "SECTION" || item?.is_relation_view,
        ) ?? [];

      const views =
        res?.views?.filter(
          (el) => el?.type !== "SECTION" && Boolean(!el?.is_relation_view),
        ) ?? [];

      return { views, relationViews };
    },
    onSuccess: ({ views, relationViews }) => {
      if (
        (!selectedView ||
          selectedView?.id !== views?.[selectedTabIndex]?.id ||
          isRefetching) &&
        !isRelationView
      ) {
        setSelectedView(views?.[selectedTabIndex]);
      }

      if (isRelationView) {
        setSelectedView(relationViews?.[selectedTabIndex]);
        setRelationViews(relationViews);
        updateQueryWithoutRerender("dv", relationViews?.[selectedTabIndex]?.id);
        // if (state?.toDocsTab) setSelectedTabIndex(data?.length);
      } else {
        dispatch(viewsActions.setViews(views));

        if (!pathname.includes("/login")) {
          updateQueryWithoutRerender("v", views?.[selectedTabIndex]?.id);
        }
        if (state?.toDocsTab)
          dispatch(detailDrawerActions.setDrawerTabIndex(views?.length));
      }
    },
  });

  const {
    data: { layout } = {
      layout: [],
    },
  } = useGetLayout(
    {
      select: (data) => {
        return {
          layout: data ?? {},
        };
      },
      onSuccess: (data) => {
        if (data?.layout?.type === DRAWER_LAYOUT_TYPES.POPUP) {
          setLayoutType(DRAWER_LAYOUT_TYPES.POPUP);
        } else {
          setLayoutType(DRAWER_LAYOUT_TYPES.SIMPLE);
        }
      },
      enabled: Boolean(isRelationView && tableSlug && menuId),
    },
    {
      menuId,
      tableSlug,
    },
  );

  const {
    data: {
      fieldsMap,
      fieldsMapRel,
      visibleColumns,
      visibleRelationColumns,
      tableInfo,
      customEvents,
    } = {
      fieldsMap: {},
      fieldsMapRel: {},
      tableInfo: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    refetch: refetchTableInfo,
  } = useGetTableInfo(
    {
      keepPreviousData: !isRelationView,
      enabled: isRelationView
        ? Boolean(
            (lastPath?.relation_table_slug || lastPath?.table_slug) &&
              selectedV?.id,
          )
        : Boolean(tableSlug && viewType !== VIEW_TYPES_MAP.SECTION),
      select: ({ data }) => {
        return {
          fieldsMap: listToMap(data?.fields),
          fieldsMapRel: listToMapWithoutRel(data?.fields ?? []),
          visibleColumns: data?.fields ?? [],
          tableInfo: data?.table_info || {},
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
          customEvents: data?.custom_events,
          orderBy: data?.table_info?.order_by || false,
        };
      },
      onSuccess: (data) => {
        if (!isRelationView) {
          dispatch(
            groupFieldActions.addViewPath({
              id: data?.tableInfo.id,
              label: data?.tableInfo.label,
              table_slug: data?.tableInfo.slug,
              relation_table_slug: data?.tableInfo.relation_table_slug,
              is_relation_view: data?.tableInfo?.is_relation_view ?? false,
            }),
          );
          dispatch(detailDrawerActions.setInitialTableInfo(data?.tableInfo));
          setOrderBy(data?.orderBy);
        }
      },
      staleTime: 1000 * 60, // 1 min
      cacheTime: 1000 * 60 * 10, // 10 min
    },
    {
      menuId,
      viewId: isRelationView ? selectedV?.id : selectedView?.id,
      tableSlug: isRelationView
        ? lastPath?.relation_table_slug || lastPath?.table_slug
        : selectedView?.table_slug,
    },
  );

  const tableName =
    tableInfo?.attributes?.[`label_${i18n.language}`] || tableInfo?.label;

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];
  const { data: tabs } = useQuery(
    queryGenerator(groupField, filters, i18n.language),
  );

  const updateViewMutation = useUpdateViewMutation(tableSlug, {
    onSuccess: () => {
      refetchViewsList();
    },
  });

  const handleUpdateView = (data) => {
    updateViewMutation.mutate(data);
  };

  const { isLoading: isLoadingTable } = useTableByIdQuery({
    id: menuItem?.table_id,
    queryParams: {
      enabled: !!menuItem?.table_id,
      onSuccess: (res) => {
        setAuthInfo(res?.attributes?.auth_info);
        viewForm.reset(res);
      },
    },
  });

  useMenuGetByIdQuery({
    menuId: menuId,
    queryParams: {
      enabled: Boolean(menuId && menuId !== "login"),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  const computedVisibleFields = useMemo(() => {
    const mappedObjects = [];
    Object.values(fieldsMap)?.forEach((obj) => {
      if (obj.type === FIELD_TYPES.LOOKUP || obj.type === FIELD_TYPES.LOOKUPS) {
        if (view?.columns?.includes(obj.relation_id)) {
          mappedObjects.push(obj);
        }
      } else {
        if (view?.columns?.includes(obj.id)) {
          mappedObjects.push(obj);
        }
      }
    });

    return mappedObjects.map((obj) => obj.id);
  }, [Object.values(fieldsMap)?.length, view?.columns?.length]);

  const columnsForSearch = useMemo(() => {
    return Object.values(fieldsMap)?.filter(
      (el) =>
        el?.type === FIELD_TYPES.SINGLE_LINE ||
        el?.type === FIELD_TYPES.MULTI_LINE ||
        el?.type === FIELD_TYPES.NUMBER ||
        el?.type === FIELD_TYPES.PHONE ||
        el?.type === FIELD_TYPES.EMAIL ||
        el?.type === FIELD_TYPES.INTERNATION_PHONE ||
        el?.type === FIELD_TYPES.INCREMENT_ID ||
        el?.type === FIELD_TYPES.FORMULA_FRONTEND,
    );
  }, [fieldsMap]);

  // useEffect(() => {
  //   if (localStorage.getItem("detailPage") === "undefined") {
  //     setSelectedViewType("SidePeek");
  //     localStorage.setItem("detailPage", "SidePeek");
  //   }
  // }, [localStorage.getItem("detailPage")]);

  return {
    viewsMap,
    viewId,
    tableName,
    tableSlug,
    fieldsMap,
    fieldsMapRel,
    menuId,
    refetchViews: refetchViewsList,
    setSelectedView,
    views: isRelationView ? relationViews : viewsFromStore,
    view,
    refetchTableInfo,
    permissions,
    roleName,
    columnsForSearch,
    viewType,
    handleSearchOnChange,
    orderBy,
    setOrderBy,
    handleSortClick,
    setSortedDatas,
    tableInfo,
    projectId,
    sortedDatas,
    visibleColumns,
    i18n,
    noDates,
    setNoDates,
    handleAddDate,
    navigateCreatePage,
    settingsForm,
    viewForm,
    authInfo,
    visibleRelationColumns,
    handleUpdateView,
    isViewUpdating: updateViewMutation.isLoading,
    searchText,
    selectAll,
    setCheckedColumns,
    checkedColumns,
    computedVisibleFields,
    projectInfo,
    menuItem,
    paginationCount,
    currentPage,
    setCurrentPage,
    customEvents,
    layoutType,
    setLayoutType,
    selectedRow,
    setSelectedRow,
    layout,
    selectedViewType,
    setSelectedViewType,
    selectedView,
    tabs,
    getView,
    setCenterDate,
    fieldsForm,
    fields,
    isLoadingTable,
    selectedTabIndex,
  };
};
