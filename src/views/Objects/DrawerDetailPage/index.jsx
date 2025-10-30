import {Box, Drawer, DrawerContent} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import layoutService from "../../../services/layoutService";
import menuService from "../../../services/menuService";
import {store} from "../../../store";
import {showAlert} from "../../../store/alert/alert.thunk";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";
import {groupFieldActions} from "../../../store/groupField/groupField.slice";
import {sortSections} from "../../../utils/sectionsOrderNumber";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";
import DrawerObjectsPage from "./DrawerObjectsPage";

function DrawerDetailPage({
  view,
  layout,
  menuItem,
  selectedRow,
  dateInfo = {},
  fullScreen = false,
  projectInfo,
  defaultValue,
  selectedViewType,
  setFullScreen = () => {},
  setSelectedViewType = () => {},
  modal,
}) {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { state = {} } = useLocation();
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const queryClient = useQueryClient();
  const viewsPath = useSelector((state) => state.groupField.viewsList);
  const open = useSelector((state) => state?.drawer?.openDrawer);
  const selectedV =
    viewsPath?.length > 1 ? viewsPath?.[viewsPath?.length - 1] : viewsPath?.[0];
  const { menuId, tableSlug: tableFromParams } = useParams();
  const [tabRelations, setTableRelations] = useState();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [loader, setLoader] = useState(true);
  const [sections, setSections] = useState([]);
  const [data, setData] = useState({});

  const isUserId = useSelector((state) => state?.auth?.userId);

  const [selectedView, setSelectedView] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v");
  const itemId = query.get("p");
  const fieldSlug = query.get("field_slug");
  const drawerRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const tableSlug =
    tableFromParams ||
    fieldSlug ||
    selectedV?.relation_table_slug ||
    view?.table_slug;

  const [drawerWidth, setDrawerWidth] = useState(() => {
    const savedWidth = localStorage.getItem("drawerWidth");
    return savedWidth ? parseInt(savedWidth, 10) : 1050;
  });

  const rootForm = useForm({
    ...state,
    ...dateInfo,
    invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
  });

  const handleClose = (action = "") => {
    // if (action === "close" && Boolean(!itemId)) {
    //   dispatch(detailDrawerActions.closeDrawer());
    // } else if (action !== "close" && Boolean(!itemId)) {
    //   onSubmit(rootForm?.getValues());
    // } else {
    dispatch(groupFieldActions.trimViewsUntil(viewsPath?.[0]));
    dispatch(groupFieldActions.trimViewsDataUntil(viewsPath?.[0]));
    dispatch(detailDrawerActions.setDrawerTabIndex(0));
    dispatch(detailDrawerActions.closeDrawer());
    updateQueryWithoutRerender("p", null);
    updateQueryWithoutRerender("v", view?.id);
    // }
  };

  const getAllData = async () => {
    setLoader(true);
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    const getFormData = menuService.getFieldsTableDataById(
      menuId,
      viewId,
      tableSlug,
      itemId,
    );

    try {
      const [{ data = {} }, layout] = await Promise.all([
        getFormData,
        getLayout,
      ]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section",
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
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
      setData(layout2);
      setSections(sortSections(sections));
      // setSummary(layout?.summary_fields ?? []);

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
      rootForm.reset(data?.response ?? {});

      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layout] = await Promise.all([getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section",
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
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
      setData(layout2);
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
      if (!menuId) {
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  function create(data) {
    constructorObjectService
      .create(tableSlug, { data })
      .then((res) => {
        updateLayout();
        dispatch(detailDrawerActions.closeDrawer());
        queryClient.invalidateQueries(["GET_OBJECTS_LIST", tableSlug]);
        queryClient.refetchQueries("GET_OBJECTS_LIST", tableSlug, {
          table_slug: tableSlug,
        });
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          },
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            },
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
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

  const onSubmit = (data) => {
    create(data);
  };

  useEffect(() => {
    if (
      Boolean(itemId) &&
      selectedView?.type === "SECTION" &&
      Boolean(tableSlug)
    ) {
      getAllData();
    } else getFields();
  }, [itemId, selectedView]);

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
      drawerRef.current.style.width = `${drawerWidth ?? 1050}px`;
      drawerRef.current.closest(".chakra-portal").style.position = "relative";
      drawerRef.current.closest(".chakra-portal").style.zIndex = 40;
    }
  }, [drawerRef.current]);

  return (
    <Drawer isOpen={open} placement="right" onClose={handleClose}>
      <DrawerContent
        ref={drawerRef}
        bg="white"
        position="relative"
        overflow={"hidden"}
        boxShadow="0px 0px 16px 1px rgba(15, 15, 15, 0.04),
               0px 12px 16px rgba(15, 15, 15, 0.15),
               0px 9px 24px rgba(15, 15, 15, 0.06)"
        style={{
          width: `${drawerWidth}px`,
          maxWidth: "90vw",
          transition: "width 0.1s ease",
          overflow: "hidden",
          background: "#fff",
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
            data={data}
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
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            position: "absolute",
            height: "calc(100vh - 0px)",
            width: "6px",
            left: 0,
            top: 0,
            cursor: "col-resize",
            zIndex: 999999,
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerDetailPage;
