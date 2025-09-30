import { useGetLang } from "@/hooks/useGetLang";
import { viewsActions } from "@/store/views/view.slice";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes"
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { useGetViewsList } from "@/services/viewsService/views.service";
import { useGetTableInfo } from "@/services/menuService/menu.service";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { listToMap, listToMapWithoutRel } from "@/utils/listToMap";

export const useViewsProps = () => {
  const {views: viewsFromStore} = useSelector((state) => state.views);
  const selectedTabIndex = useSelector((state) => state.drawer.mainTabIndex);

  const { i18n } = useTranslation();

  const {menuId} = useParams();
  const {state, pathname} = useLocation();
  const navigate = useNavigate()

  const viewsRef = useRef();
  const tableLan = useGetLang("Table");

  const dispatch = useDispatch()

  const [selectedView, setSelectedView] = useState(null);

  const [visibleViews, setVisibleViews] = useState([]);
  const [overflowedViews, setOverflowedViews] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [viewAnchorEl, setViewAnchorEl] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v") ?? selectedView?.id;

  const tableSlug = selectedView?.table_slug;

  const viewsMap = {
    [VIEW_TYPES_MAP.TABLE]: <></>,
    [VIEW_TYPES_MAP.TREE]: <></>,
    [VIEW_TYPES_MAP.GRID]: <></>,
    [VIEW_TYPES_MAP.BOARD]: <></>,
    [VIEW_TYPES_MAP.TIMELINE]: <></>,
    [VIEW_TYPES_MAP.CALENDAR]: <></>,
    [VIEW_TYPES_MAP.WEBSITE]: <></>,
  }

  const updateVisibleViews = useCallback(() => {
    if (!viewsFromStore || viewsFromStore.length === 0) return;

    const container = viewsRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const viewButtonWidth = 90;
    const maxVisible = Math.max(
      1,
      Math.floor(containerWidth / viewButtonWidth)
    );

    let visible = viewsFromStore.slice(0, maxVisible);
    let overflowed = viewsFromStore.slice(maxVisible);

    if (overflowed.length > 0) {
      const chosenView = viewsFromStore.find((v) => v.id === viewId);
      if (chosenView) {
        const isInVisible = visible.some((v) => v.id === viewId);

        if (!isInVisible) {
          if (visible.length >= maxVisible) {
            const removed = visible.pop();
            overflowed = [removed, ...overflowed];
          }
          visible.push(chosenView);
          overflowed = overflowed.filter((v) => v.id !== viewId);
        } else {
          visible = visible.filter((v) => v.id !== viewId);
          visible.push(chosenView);
        }
      }
    }

    setVisibleViews(visible);
    setOverflowedViews(overflowed);
  }, [viewsFromStore, viewId]);

  const handleViewClick = (view, idx) => {
    updateQueryWithoutRerender("v", view?.id)
    setSelectedView(view);
    dispatch(viewsActions.setSelectedView({ view, idx }));
  }

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  useGetViewsList(
    menuId,
    {
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
          selectedView?.id !== data?.[selectedTabIndex]?.id
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
    }
  )

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
  } = useGetTableInfo(
    {
      enabled: Boolean(
        selectedView?.table_slug && selectedView?.type !== "SECTION"
      ),
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
    },
    {
      menuId,
      viewId: selectedView?.id,
      tableSlug: selectedView?.table_slug
    },
  );

  const tableName = tableInfo?.label;

  useEffect(() => {
    updateVisibleViews();
  }, [updateVisibleViews]);

  return {
    viewsMap,
    viewsRef,
    visibleViews,
    overflowedViews,
    tableLan,
    viewId,
    i18n,
    tableName,
    tableSlug,
    handleViewClick,
    handleClick,
    navigate,
    setViewAnchorEl,
  }
}
