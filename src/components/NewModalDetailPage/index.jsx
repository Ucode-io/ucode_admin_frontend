import {Box} from "@chakra-ui/react";
import {Dialog} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import layoutService from "../../services/layoutService";
import menuService from "../../services/menuService";
import {store} from "../../store";
import {showAlert} from "../../store/alert/alert.thunk";
import {sortSections} from "../../utils/sectionsOrderNumber";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";
import DrawerObjectsPageModal from "./DrawerObjectsPage";

function NewModalDetailPage({
  view,
  open,
  layout,
  setOpen,
  menuItem,
  selectedRow,
  projectInfo,
  defaultValue,
  dateInfo = {},
  modal = false,
  selectedViewType,
  fullScreen = false,
  setFullScreen = () => {},
  setSelectedViewType = () => {},
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {state = {}} = useLocation();
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const queryClient = useQueryClient();
  const handleClose = () => {
    updateQueryWithoutRerender("p", null);
    setOpen(false);
  };
  const {navigateToForm} = useTabRouter();
  const [btnLoader, setBtnLoader] = useState(false);
  const isUserId = useSelector((state) => state?.auth?.userId);
  const {menuId} = useParams();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [loader, setLoader] = useState(true);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const {i18n} = useTranslation();
  const [data, setData] = useState({});
  const tableSlug = view?.table_slug || view?.relation?.table_to?.slug;
  const [selectedView, setSelectedView] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v");
  const itemId = query.get("p");
  const drawerRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const [drawerWidth, setDrawerWidth] = useState(() => {
    const savedWidth = localStorage.getItem("drawerWidth");
    return savedWidth ? parseInt(savedWidth, 10) : 650;
  });

  const rootForm = useForm({
    ...state,
    ...dateInfo,
    invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
  });

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
      itemId
    );

    try {
      const [{data = {}}, layout] = await Promise.all([getFormData, getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
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
      setSummary(layout?.summary_fields ?? []);

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
        }))
      );

      // if (!selectedTab?.relation_id) {
      rootForm.reset(data?.response ?? {});
      // }
      setSelectTab(relations[selectedTabIndex]);

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
            tab?.type === "section"
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
        }))
      );
      if (!menuId) {
        setLoader(false);
      }
      setSelectTab(relations[selectedTabIndex]);
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

  const update = (data) => {
    delete data.invite;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        updateLayout();
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
        queryClient.refetchQueries("GET_OBJECTS_LIST", tableSlug, {
          table_slug: tableSlug,
        });
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setBtnLoader(false);
      });
  };
  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, {data})
      .then((res) => {
        updateLayout();
        setOpen(false);
        queryClient.invalidateQueries(["GET_OBJECTS_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
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
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }
        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setBtnLoader(false);
        rootForm.refetch();
      });
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
        : tab
    );

    const currentUpdatedLayout = {
      ...layout,
      tabs: updatedTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug);
  }

  const onSubmit = (data) => {
    if (itemId) {
      update(data);
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (itemId && selectedView?.type === "SECTION") getAllData();
    else getFields();
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
    if (newWidth > 1050) newWidth = 1050;

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
      drawerRef.current.style.width = `${drawerWidth}px`;
      drawerRef.current.closest(".chakra-portal").style.position = "relative";
      drawerRef.current.closest(".chakra-portal").style.zIndex = 40;
    }
  }, [drawerRef.current]);

  const setViews = () => {};

  return (
    <Dialog
      disablePortal
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "1000px",
        },
      }}
      onClose={handleClose}>
      <Box w={"950px"} borderRadius={"8px"} border={"none"}>
        <Box bg={"red"}>
          <DrawerObjectsPageModal
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
            setViews={setViews}
            rootForm={rootForm}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
          />
        </Box>
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            position: "absolute",
            height: "400px",
            width: "3px",
            left: 0,
            top: 0,
            cursor: "col-resize",
          }}
        />
      </Box>
    </Dialog>
  );
}

export default NewModalDetailPage;
