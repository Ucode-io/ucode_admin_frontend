import cls from "./style.module.scss";
import { Box, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import constructorObjectService from "@/services/constructorObjectService";
import layoutService from "@/services/layoutService";
import { store } from "@/store";
import { showAlert } from "@/store/alert/alert.thunk";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { sortSections } from "@/utils/sectionsOrderNumber";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
// import DrawerObjectsPage from "./DrawerObjectsPage";
import {
  SIDEBAR_CLOSED_WIDTH,
  SIDEBAR_OPENED_WIDTH,
} from "@/utils/constants/main";
import { DRAWER_VIEW_TYPES } from "@/utils/constants/drawerConstants";
import { useViewContext } from "@/providers/ViewProvider";
import clsx from "clsx";
import { menuService } from "@/services/menuService/menu.service";
import { useQueryClient } from "react-query";
import { DrawerFormSkeleton } from "./DrawerFormSkeleton";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

const Views = lazy(() => import("../.."));

function DrawerDetailPage({
  layout,
  menuItem,
  dateInfo = {},
  menuId,
  refetchMainDataList,
}) {
  const dispatch = useDispatch();

  const { selectedViewType } = useViewContext();

  const { selectedView } = useSelector((state) => state.drawer);
  const selectedTabIndex = useSelector((state) => state.drawer.drawerTabIndex);

  const { i18n } = useTranslation();

  const { state = {} } = useLocation();

  const menu = store.getState().menu;

  const tableSlug = selectedView?.table_slug;

  const isInvite = menu.invite;

  const size = selectedViewType === DRAWER_VIEW_TYPES.FullPage ? "full" : "xs";

  // const [tabRelations, setTableRelations] = useState();
  // const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [sections, setSections] = useState([]);

  const [layoutData, setLayoutData] = useState({});
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);

  const queryClient = useQueryClient();

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("dv");
  const itemId = query.get("p");
  // const fieldSlug = query.get("field_slug");

  const open = useSelector((state) => state?.drawer?.openDrawer);
  const defaultValue = useSelector((state) => state.drawer.defaultValue);

  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen,
  );

  const drawerRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const [drawerWidth, setDrawerWidth] = useState(() => {
    const savedWidth = localStorage.getItem("drawerWidth");
    return savedWidth ? parseInt(savedWidth, 10) : 1050;
  });

  const fieldsList = useMemo(() => {
    const fieldsList = [];

    layout?.tabs?.[selectedTabIndex]?.sections?.forEach((section) => {
      section?.fields?.forEach((field) => {
        fieldsList.push(field);
      });
    });

    return fieldsList;
  }, [layout]);

  const rootForm = useForm({
    ...state,
    ...dateInfo,
    invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
  });

  const handleClose = () => {
    // if (action === "close" && Boolean(!itemId)) {
    //   dispatch(detailDrawerActions.closeDrawer());
    // } else if (action !== "close" && Boolean(!itemId)) {
    //   onSubmit(rootForm?.getValues());
    // } else {
    rootForm.reset({});
    updateQueryWithoutRerender("p", null);
    updateQueryWithoutRerender("dv", null);

    dispatch(groupFieldActions.clearViews());
    dispatch(groupFieldActions.clearViewsPath());
    dispatch(detailDrawerActions.setDrawerTabIndex(0));
    dispatch(detailDrawerActions.closeDrawer());
    dispatch(detailDrawerActions.setSelectedView({}));
    // updateQueryWithoutRerender("v", view?.id);
    // }
  };

  const getData = async () => {
    // ponytail: same key/params as useGetLayout in useViewsProps, so the two callers that
    // both want this layout share one request instead of firing identical GETs in parallel.
    const params = {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    };
    const layout = await queryClient.fetchQuery(
      ["GET_LAYOUT", tableSlug, menuId, params],
      () => layoutService.getLayout(tableSlug, menuId, params),
    );

    try {
      const filteredTabs = {
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section",
        ),
      };

      const computedLayout = {
        ...layout,
        tabs: filteredTabs?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.attributes?.field_hide_layout === undefined) {
                    return {
                      ...field,
                      attributes: {
                        ...field?.attributes,
                        field_hide_layout: false,
                      },
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };

      setLayoutData(computedLayout);
      setSections(sortSections(sections));
      setIsLayoutLoading(false);

      // const relations =
      //   layout?.tabs?.map((el) => ({
      //     ...el,
      //     ...el.relation,
      //   })) ?? [];

      // setTableRelations(
      //   relations.map((relation) => ({
      //     ...relation,
      //     relatedTable:
      //       relation.table_from?.slug === tableSlug
      //         ? relation.table_to?.slug
      //         : relation.table_from?.slug,
      //   })),
      // );
    } catch (error) {
      console.error(error);
      setIsLayoutLoading(false);
    }
  };

  const getItems = async () => {
    const isSection =
      Boolean(itemId) &&
      selectedView?.type === VIEW_TYPES_MAP.SECTION &&
      Boolean(tableSlug);

    if (isSection) {
      const getFormData = menuService.getFieldsTableDataById(
        menuId,
        viewId,
        tableSlug,
        itemId,
      );
      const { data } = await getFormData;
      rootForm.reset(data?.response ?? {});
    }
  };

  function updateLayout() {
    const updatedTabs = layout?.tabs?.map((tab, index) =>
      index === selectedTabIndex
        ? {
            ...tab,
            attributes: {
              ...tab?.attributes,
              layout_heading: rootForm.watch("attributes.layout_heading"),
            },
          }
        : tab,
    );

    const currentUpdatedLayout = {
      ...layout,
      tabs: updatedTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug);
  }

  function create(data) {
    const specialRequiredFields = [];
    fieldsList?.forEach((field) => {
      if (
        field?.type === FIELD_TYPES.MULTI_LINE &&
        field?.required &&
        !data?.[field?.slug]?.trim()
      ) {
        specialRequiredFields.push(field);
      }
    });

    if (specialRequiredFields.length) {
      specialRequiredFields.forEach((field) => {
        dispatch(showAlert(`Field ${field?.label} is required`, "error"));
      });
    } else {
      constructorObjectService
        .create(tableSlug, { data })
        .then(() => {
          updateLayout();

          dispatch(detailDrawerActions.closeDrawer());
          dispatch(showAlert("Successfully updated!", "success"));

          refetchMainDataList();

          handleClose();
          rootForm.reset({});
        })
        .catch((e) => console.log("ERROR: ", e));
    }
  }

  const update = (data) => {
    delete data.invite;
    constructorObjectService
      .update(tableSlug, { data })
      .then(() => {
        updateLayout();
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
        // queryClient.refetchQueries("GET_OBJECTS_LIST", tableSlug, {
        //   table_slug: tableSlug,
        // });
      })
      .catch((e) => console.log("ERROR: ", e));
  };

  const onSubmit = (data) => {
    if (itemId) {
      update(data);
    } else {
      create(data);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();

    startX.current = e.clientX;
    startWidth.current = drawerRef.current
      ? drawerRef.current.offsetWidth
      : drawerWidth;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const deltaX = e.clientX - startX.current;
    let newWidth = startWidth.current - deltaX;

    if (newWidth < 650) newWidth = 650;
    if (newWidth > 1150) newWidth = 1150;

    if (drawerRef.current) {
      drawerRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const finalWidth = drawerRef.current.offsetWidth;
    if (drawerRef.current) {
      localStorage.setItem("drawerWidth", finalWidth);
      setDrawerWidth(drawerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.style.width =
        size === "full" ? "100%" : `${drawerWidth ?? 1050}px`;
      drawerRef.current.closest(".chakra-portal").style.position = "relative";
      drawerRef.current.closest(".chakra-portal").style.zIndex = 40;
    }
  }, [drawerRef.current, drawerWidth, size]);

  useEffect(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        defaultValue.forEach((item) => {
          rootForm.setValue(item?.field, item?.value);
        });
      } else {
        if (defaultValue?.field && defaultValue?.value) {
          rootForm.setValue(defaultValue?.field, defaultValue?.value);
        }
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (open && tableSlug) {
      getData();
    } else if (!open) {
      setIsLayoutLoading(true);
    }
  }, [itemId, selectedView, open, tableSlug]);

  useEffect(() => {
    if (open && viewId) {
      getItems();
    }
  }, [itemId, viewId, tableSlug, open]);

  return (
    <Drawer
      isOpen={open}
      placement="right"
      onClose={handleClose}
      size={size}
      returnFocusOnClose={false}
    >
      {selectedViewType === DRAWER_VIEW_TYPES.CenterPeek && <DrawerOverlay />}
      <DrawerContent
        className={clsx(cls.drawerContent, {
          [cls.centerPeek]:
            selectedViewType === DRAWER_VIEW_TYPES.CenterPeek && open,
        })}
        ref={drawerRef}
        style={{
          width: size === "full" ? "100%" : `${drawerWidth}px`,
          maxWidth: `calc(100vw - ${sidebarIsOpen ? SIDEBAR_OPENED_WIDTH : SIDEBAR_CLOSED_WIDTH}px)`,
          boxShadow:
            size === "full"
              ? "none"
              : "0px 0px 16px 1px rgba(15, 15, 15, 0.04), 0px 12px 16px rgba(15, 15, 15, 0.15), 0px 9px 24px rgba(15, 15, 15, 0.06)",
        }}
      >
        <Box zIndex={9}>
          <Suspense fallback={<DrawerFormSkeleton />}>
            <Views
              isRelationView
              handleCloseDrawer={handleClose}
              rootForm={rootForm}
              layoutData={layoutData}
              isLayoutLoading={isLayoutLoading}
              onSectionSubmit={onSubmit}
              updateLayout={updateLayout}
              handleMouseDown={handleMouseDown}
            />
          </Suspense>
        </Box>
        {selectedViewType === DRAWER_VIEW_TYPES.SidePeek && (
          <Box onMouseDown={handleMouseDown} className={cls.resizer} />
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerDetailPage;
