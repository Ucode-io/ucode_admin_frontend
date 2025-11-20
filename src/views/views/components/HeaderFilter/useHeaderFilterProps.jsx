import { useCallback, useEffect, useRef, useState } from "react";
import { useFilterContext } from "../../providers/FilterProvider";
import { useViewContext } from "@/providers/ViewProvider";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { viewsActions } from "@/store/views/view.slice";
import { useGetLang } from "@/hooks/useGetLang";
import { useUpdateTableMutation } from "@/services/tableService/table.service";
import { useFieldsContext } from "../../providers/FieldsProvider";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { useRelationsListQuery } from "@/services/relationService";

export const useHeaderFilterProps = () => {
  const dispatch = useDispatch();

  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table");

  const {
    view,
    views,
    viewId,
    tableSlug,
    viewType,
    menuId,
    refetchViews,
    isRelationView,
    setSelectedView,
    tableInfo,
    projectId,
    visibleColumns,
    viewForm,
    selectedView,
  } = useViewContext();

  const {
    handleSearchOnChange,
    orderBy,
    setOrderBy,
    setSortedDatas,
    sortedDatas,
  } = useFilterContext();

  const mainTabIndex = useSelector((state) => state.drawer.mainTabIndex);
  const drawerTabIndex = useSelector((state) => state.drawer.drawerTabIndex);

  const selectedTabIndex = isRelationView ? drawerTabIndex : mainTabIndex;

  const { fieldsMap, fieldsMapRel } = useFieldsContext();

  const viewsRef = useRef(null);

  const [visibleViews, setVisibleViews] = useState([]);
  const [overflowedViews, setOverflowedViews] = useState([]);

  const [isChanged, setIsChanged] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [viewAnchorEl, setViewAnchorEl] = useState(null);
  const [sortPopupAnchorEl, setSortPopupAnchorEl] = useState(null);

  const isSortPopupOpen = Boolean(!!sortPopupAnchorEl);

  const viewsList = useSelector((state) => state.groupField.viewsList);

  const { data: { relations } = { relations: [] } } = useRelationsListQuery({
    params: {
      table_slug: viewsList?.[viewsList?.length - 1]?.table_slug,
      relation_table_slug:
        viewsList?.[viewsList?.length - 1]?.relation_table_slug,
      disable_table_to: true,
    },
    tableSlug:
      viewsList?.[viewsList?.length - 1]?.relation_table_slug ||
      viewsList?.[viewsList?.length - 1]?.table_slug,
    queryParams: {
      enabled: !!viewAnchorEl,
    },
  });

  const relationFields = relations;

  const getViewName = (view) => {
    return view?.is_relation_view
      ? view?.attributes?.[`name_${i18n?.language}`] ||
          view?.type ||
          view?.table_label
      : view?.attributes?.[`name_${i18n?.language}`] ||
          view?.name ||
          view?.type;
  };

  const handleCloseCreateViewPopup = () => {
    dispatch(groupFieldActions.clearGroupBySlug());
    setViewAnchorEl(null);
  };

  const handleViewClick = (view, idx) => {
    const isSection = view?.type === VIEW_TYPES_MAP.SECTION;

    if (isRelationView) {
      updateQueryWithoutRerender("dv", view?.id);
      dispatch(detailDrawerActions.setDrawerTabIndex(idx));

      if (isSection) {
        dispatch(groupFieldActions.trimViewsDataUntil(view));
        dispatch(groupFieldActions.trimViewsUntil(view));
        setSelectedView(view);

        return;
      } else {
        dispatch(
          groupFieldActions.addViewPath({
            ...view,
          }),
        );
      }
    } else {
      updateQueryWithoutRerender("v", view?.id);
      dispatch(detailDrawerActions.setMainTabIndex(idx));
    }
    setSelectedView(view);
    // dispatch(viewsActions.setSelectedView(view));
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseViews = () => {
    setAnchorEl(null);
  };

  const handleSortClick = (e) => {
    setSortPopupAnchorEl(e.currentTarget);
  };

  const handleCloseSortPopup = () => setSortPopupAnchorEl(null);

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const tableUpdateMutation = useUpdateTableMutation();

  const handleChangeOrder = (order) => {
    const isGivenFromProps = typeof order === "boolean";
    setOrderBy((prev) => {
      tableUpdateMutation.mutate(
        {
          ...tableInfo,
          order_by: isGivenFromProps ? order : !prev,
        },
        projectId,
      );
      return isGivenFromProps ? order : !prev;
    });
  };

  const updateVisibleViews = useCallback(() => {
    if (!views || views.length === 0) return;

    const container = viewsRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const viewButtonWidth = 90;
    const maxVisible = Math.max(
      1,
      Math.floor(containerWidth / viewButtonWidth),
    );

    let visible = views.slice(0, maxVisible);
    let overflowed = views.slice(maxVisible - 1);

    if (overflowed.length > 0) {
      const chosenView = views.find((v) => v.id === viewId);
      if (chosenView) {
        const isInVisible = visible.some((v) => v.id === viewId);

        if (!isInVisible) {
          if (visible.length >= maxVisible) {
            // const removed = visible.pop();
            // overflowed = [removed, ...overflowed];
          }
          // visible.push(chosenView);
          // overflowed = overflowed.filter((v) => v.id !== viewId);
        } else {
          // visible = visible.filter((v) => v.id !== viewId);
          // visible.push(chosenView);
        }
      }
    }

    setVisibleViews(visible);
    setOverflowedViews(overflowed);
  }, [views, viewId]);

  useEffect(() => {
    updateVisibleViews();
  }, [updateVisibleViews]);

  useEffect(() => {
    let resizeTimeout;

    const handleResizeEnd = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateVisibleViews();
      }, 200);
    };

    window.addEventListener("resize", handleResizeEnd);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResizeEnd);
    };
  }, [updateVisibleViews]);

  return {
    viewsRef,
    visibleViews,
    overflowedViews,
    viewId,
    tableSlug,
    i18n,
    viewType,
    view,
    views,
    menuId,
    refetchViews,
    isRelationView,
    setSelectedView,
    handleCloseCreateViewPopup,
    viewAnchorEl,
    setViewAnchorEl,
    handleViewClick,
    handleClick,
    anchorEl,
    setAnchorEl,
    tableLan,
    handleSearchOnChange,
    orderBy,
    handleSortClick,
    handleCloseSortPopup,
    isSortPopupOpen,
    sortPopupAnchorEl,
    handleChangeOrder,
    setOrderBy,
    setSortedDatas,
    sortedDatas,
    fieldsMap,
    fieldsMapRel,
    relationFields,
    visibleColumns,
    isPopupOpen,
    handleOpenPopup,
    handleClosePopup,
    isChanged,
    setIsChanged,
    viewForm,
    getViewName,
    selectedView,
    handleCloseViews,
    selectedTabIndex,
  };
};
