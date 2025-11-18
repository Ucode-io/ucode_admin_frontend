import cls from "./style.module.scss";
import { Box, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
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
import DrawerObjectsPage from "./DrawerObjectsPage";
import {
  SIDEBAR_CLOSED_WIDTH,
  SIDEBAR_OPENED_WIDTH,
} from "@/utils/constants/main";
import { DRAWER_VIEW_TYPES } from "@/utils/constants/drawerConstants";
import { useViewContext } from "@/providers/ViewProvider";
import clsx from "clsx";
import { menuService } from "@/services/menuService/menu.service";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";

function DrawerDetailPage({
  view,
  layout,
  menuItem,
  selectedRow,
  dateInfo = {},
  fullScreen = false,
  projectInfo,
  defaultValue,
  setFullScreen = () => {},
  modal,
  tableSlug,
  menuId,
}) {
  const { selectedViewType, setSelectedViewType } = useViewContext();

  const { i18n } = useTranslation();

  const dispatch = useDispatch();

  const { state = {} } = useLocation();

  const menu = store.getState().menu;

  const isInvite = menu.invite;

  const queryClient = useQueryClient();

  const size = selectedViewType === DRAWER_VIEW_TYPES.FullPage ? "full" : "xs";

  const viewsPath = useSelector((state) => state.groupField.viewsList);

  const selectedV =
    viewsPath?.length > 1 ? viewsPath?.[viewsPath?.length - 1] : viewsPath?.[0];

  const [tabRelations, setTableRelations] = useState();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [loader, setLoader] = useState(true);
  const [sections, setSections] = useState([]);

  const [layoutData, setLayoutData] = useState({});

  const isUserId = useSelector((state) => state?.auth?.userId);

  const [selectedView, setSelectedView] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("dv");
  const itemId = query.get("p");
  const fieldSlug = query.get("field_slug");

  const open = useSelector((state) => state?.drawer?.openDrawer);

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
    updateQueryWithoutRerender("p", null);
    updateQueryWithoutRerender("dv", null);
    dispatch(groupFieldActions.trimViewsUntil(viewsPath?.[0]));
    dispatch(groupFieldActions.trimViewsDataUntil(viewsPath?.[0]));
    dispatch(detailDrawerActions.setDrawerTabIndex(0));
    dispatch(detailDrawerActions.closeDrawer());
    // updateQueryWithoutRerender("v", view?.id);
    // }
  };

  const getData = async () => {
    setLoader(true);

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
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
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

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        })),
      );

      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
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
    const updatedTabs = layout.tabs.map((tab, index) =>
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
    constructorObjectService
      .create(tableSlug, { data })
      .then(() => {
        updateLayout();
        dispatch(detailDrawerActions.closeDrawer());
        // queryClient.invalidateQueries(["GET_OBJECTS_LIST", tableSlug]);
        // queryClient.refetchQueries("GET_OBJECTS_LIST", tableSlug, {
        //   table_slug: tableSlug,
        // });
        // queryClient.refetchQueries(
        //   "GET_OBJECTS_LIST_WITH_RELATIONS",
        //   tableSlug,
        //   {
        //     table_slug: tableSlug,
        //   }
        // );
        // queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
        //   table_slug: tableSlug,
        //   user_id: isUserId,
        // });
        if (modal) {
          handleClose();
          // queryClient.refetchQueries(
          //   "GET_OBJECTS_LIST_WITH_RELATIONS",
          //   tableSlug,
          //   {
          //     table_slug: tableSlug,
          //   }
          // );
          // queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          handleClose();
        }
        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        rootForm.refetch();
      });
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
    if (open) {
      getData();
    }
  }, [itemId, selectedView, open, layout]);

  useEffect(() => {
    if (open && viewId) {
      getItems();
    }
  }, [itemId, viewId, tableSlug, open]);

  return (
    <Drawer isOpen={open} placement="right" onClose={handleClose} size={size}>
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
          <DrawerObjectsPage
            open={open}
            onSubmit={onSubmit}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            projectInfo={projectInfo}
            handleMouseDown={handleMouseDown}
            layout={layout}
            selectedTab={layout?.tabs?.[0]}
            menuItem={menuItem}
            layoutData={layoutData}
            selectedRow={selectedRow}
            handleClose={handleClose}
            modal={true}
            dateInfo={dateInfo}
            setFullScreen={setFullScreen}
            fullScreen={fullScreen}
            view={view}
            rootForm={rootForm}
            updateLayout={updateLayout}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
          />
        </Box>
        {selectedViewType === DRAWER_VIEW_TYPES.SidePeek && (
          <Box onMouseDown={handleMouseDown} className={cls.resizer} />
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerDetailPage;
