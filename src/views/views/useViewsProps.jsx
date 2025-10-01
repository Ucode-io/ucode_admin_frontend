import { viewsActions } from "@/store/views/view.slice";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { useGetViewsList } from "@/services/viewsService/views.service";
import { useGetTableInfo } from "@/services/menuService/menu.service";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { listToMap, listToMapWithoutRel } from "@/utils/listToMap";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { openDB, saveOrUpdateSearchText } from "@/utils/indexedDb";

export const useViewsProps = () => {
  const { views: viewsFromStore } = useSelector((state) => state.views);
  const selectedTabIndex = useSelector((state) => state.drawer.mainTabIndex);

  const roleName = useSelector((state) => state.auth?.roleInfo?.name);
  const projectId = useSelector((state) => state.auth.projectId);

  const paginationCounts = useSelector(
    (state) => state?.pagination?.paginationCount
  );

  const { i18n } = useTranslation();

  const { menuId } = useParams();
  const { state, pathname } = useLocation();

  const dispatch = useDispatch();

  const [selectedView, setSelectedView] = useState(null);

  const [sortPopupAnchorEl, setSortPopupAnchorEl] = useState(null);

  const [orderBy, setOrderBy] = useState(false);
  const [sortedDatas, setSortedDatas] = useState([]);

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v") ?? selectedView?.id;

  const tableSlug = selectedView?.table_slug;
  const viewType = selectedView?.type;

  const paginationCount = useMemo(() => {
    const getObject = paginationCounts.find(
      (el) => el?.tableSlug === tableSlug
    );

    return getObject?.pageCount ?? 1;
  }, [paginationCounts, tableSlug]);

  const [currentPage, setCurrentPage] = useState(paginationCount);

  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );

  const viewsMap = {
    [VIEW_TYPES_MAP.TABLE]: <></>,
    [VIEW_TYPES_MAP.TREE]: <></>,
    [VIEW_TYPES_MAP.GRID]: <></>,
    [VIEW_TYPES_MAP.BOARD]: <></>,
    [VIEW_TYPES_MAP.TIMELINE]: <></>,
    [VIEW_TYPES_MAP.CALENDAR]: <></>,
    [VIEW_TYPES_MAP.WEBSITE]: <></>,
  };

  const saveSearchTextToDB = async (tableSlug, searchText) => {
    const db = await openDB();
    await saveOrUpdateSearchText(db, tableSlug, searchText);
  };

  const handleSearchOnChange = (value) => {
    setCurrentPage(1);
    saveSearchTextToDB(tableSlug, value);
  };

  const handleSortClick = (e) => {
    setSortPopupAnchorEl(e.currentTarget);
  };

  const { refetch: refetchViewsList, isRefetching } = useGetViewsList(menuId, {
    enabled: Boolean(menuId),
    select: (res) => {
      return (
        res?.views?.filter(
          (el) => el?.type !== "SECTION" && Boolean(!el?.is_relation_view)
        ) ?? []
      );
    },
    onSuccess: (data) => {
      if (
        !selectedView ||
        selectedView?.id !== data?.[selectedTabIndex]?.id ||
        isRefetching
      ) {
        setSelectedView(data?.[selectedTabIndex]);
      }
      dispatch(viewsActions.setViews(data));

      if (!pathname.includes("/login")) {
        updateQueryWithoutRerender("v", data?.[selectedTabIndex]?.id);
      }
      if (state?.toDocsTab)
        dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
    },
  });

  const {
    data: {
      fieldsMap,
      fieldsMapRel,
      visibleColumns,
      visibleRelationColumns,
      tableInfo,
    } = {
      fieldsMap: {},
      fieldsMapRel: {},
      tableInfo: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
    refetch: refetchTableInfo,
  } = useGetTableInfo(
    {
      enabled: Boolean(tableSlug && viewType !== VIEW_TYPES_MAP.SECTION),
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
        };
      },
      onSuccess: (data) => {
        dispatch(
          groupFieldActions.addViewPath({
            id: data?.tableInfo.id,
            label: data?.tableInfo.label,
            table_slug: data?.tableInfo.slug,
            relation_table_slug: data?.tableInfo.relation_table_slug,
            is_relation_view: data?.tableInfo?.is_relation_view ?? false,
          })
        );
        dispatch(detailDrawerActions.setInitialTableInfo(data?.tableInfo));
      },
      staleTime: 1000 * 60, // 1 min
      cacheTime: 1000 * 60 * 10, // 10 min
    },
    {
      menuId,
      viewId: selectedView?.id,
      tableSlug: selectedView?.table_slug,
    }
  );

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
        el?.type === FIELD_TYPES.FORMULA_FRONTEND
    );
  }, [fieldsMap]);

  const tableName = tableInfo?.label;
  const view = selectedView;

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
    views: viewsFromStore,
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
  };
};
