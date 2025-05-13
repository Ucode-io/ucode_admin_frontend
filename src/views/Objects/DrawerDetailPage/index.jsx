import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
} from "@chakra-ui/react";
import {store} from "../../../store";
import {useForm} from "react-hook-form";
import {Check} from "@mui/icons-material";
import {useQueryClient} from "react-query";
import {Menu, MenuItem} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useTabRouter from "../../../hooks/useTabRouter";
import DrawerFormDetailPage from "./DrawerFormDetailPage";
import {showAlert} from "../../../store/alert/alert.thunk";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import layoutService from "../../../services/layoutService";
import {sortSections} from "../../../utils/sectionsOrderNumber";
import {useTranslation} from "react-i18next";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import DrawerRelationTable from "../ModalDetailPage/DrawerRelationTable";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import menuService from "../../../services/menuService";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";

function DrawerDetailPage({
  view,
  open,
  layout,
  refetch = () => {},
  setOpen = () => {},
  menuItem,
  fieldsMap,
  selectedRow,
  dateInfo = {},
  selectedViewType,
  fullScreen = false,
  projectInfo,
  defaultValue,
  setLayoutType = () => {},
  setFullScreen = () => {},
  navigateToEditPage = () => {},
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
  const tableSlug = view?.table_slug;

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [loader, setLoader] = useState(true);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const {i18n} = useTranslation();
  const [data, setData] = useState({});

  const permissions = useSelector(
    (state) => state?.permissions?.permissions?.[tableSlug]
  );
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

      if (!selectedTab?.relation_id) {
        reset(data?.response ?? {});
      }
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

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: {errors},
    setValue: setFormValue,
    getValues,
  } = useForm({
    defaultValues: {
      ...state,
      ...dateInfo,
      invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
    },
  });

  useEffect(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        defaultValue.forEach((item) => {
          setFormValue(item?.field, item?.value);
        });
      } else {
        if (defaultValue?.field && defaultValue?.value) {
          setFormValue(defaultValue?.field, defaultValue?.value);
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
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
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
        refetch();
      });
  };

  function updateLayout() {
    const updatedTabs = layout.tabs.map((tab, index) =>
      index === selectedTabIndex
        ? {
            ...tab,
            attributes: {
              ...tab?.attributes,
              layout_heading: watch("attributes.layout_heading"),
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
    if (itemId) getAllData();
    else getFields();
  }, [itemId]);

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

  return (
    <Drawer isOpen={open} placement="right" onClose={handleClose} size="md">
      <Tabs selectedIndex={selectedTabIndex}>
        <Box position={"relative"} zIndex={9}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerContent
              boxShadow="
        rgba(15, 15, 15, 0.04) 0px 0px 0px 1px,
        rgba(15, 15, 15, 0.03) 0px 3px 6px,
        rgba(15, 15, 15, 0.06) 0px 9px 24px
      "
              zIndex={9}
              ref={drawerRef}
              bg={"white"}
              resize={"both"}
              position={"relative"}>
              <DrawerHeader
                px="12px"
                bg="white"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                pr={6}>
                <Flex h={"44px"} align="center" justify="space-between">
                  <Box
                    onClick={handleClose}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="24px"
                    height="24px">
                    <KeyboardDoubleArrowRightIcon
                      style={{color: "rgba(55, 53, 47, 0.45)"}}
                      w={6}
                      h={6}
                    />
                  </Box>
                  {!layout?.is_visible_section && (
                    <>
                      {" "}
                      <Box
                        sx={{
                          width: "1px",
                          height: "14px",
                          margin: "0 6px",
                          background: "rgba(55, 53, 47, 0.16)",
                        }}
                      />
                      <Box>
                        <ScreenOptions
                          selectedViewType={selectedViewType}
                          setSelectedViewType={setSelectedViewType}
                          setLayoutType={setLayoutType}
                          selectedRow={selectedRow}
                          navigateToEditPage={navigateToEditPage}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "1px",
                          height: "14px",
                          margin: "0 6px",
                          background: "rgba(55, 53, 47, 0.16)",
                        }}
                      />
                      {Boolean(permissions?.settings) && (
                        <>
                          <Button
                            onClick={() =>
                              navigate(`/${menuId}/customize/${itemId}`, {
                                state: {
                                  ...data,
                                  tableSlug,
                                },
                              })
                            }
                            w={18}
                            h={18}
                            display={"flex"}
                            alignItems={"center"}
                            variant="outlined">
                            <SpaceDashboardIcon style={{color: "#808080"}} />
                          </Button>
                          <Box
                            sx={{
                              width: "1px",
                              height: "14px",
                              margin: "0 6px",
                              background: "rgba(55, 53, 47, 0.16)",
                            }}
                          />
                        </>
                      )}
                    </>
                  )}

                  {!layout?.is_visible_section && (
                    <TabList
                      style={{
                        borderBottom: "none",
                        overflowX: "auto",
                      }}>
                      {data?.tabs?.map((el, index) => (
                        <Tab
                          onClick={(e) => {
                            setSelectTab(el);
                            setSelectedTabIndex(index);
                          }}
                          key={index}
                          style={{
                            whiteSpace: "nowrap",
                            height: "24px",
                            padding: "0 10px",
                            fontSize: "11px",
                            fontWeight: "500",
                          }}>
                          {el?.type === "relation"
                            ? el?.relation?.attributes?.[
                                `label_to_${i18n?.language}`
                              ]
                            : el?.attributes?.[`label_${i18n?.language}`] ||
                              el?.label}
                        </Tab>
                      ))}
                    </TabList>
                  )}
                </Flex>

                {/* {selectedTabIndex === 0 && ( */}
                <Button
                  isLoading={btnLoader}
                  disabled={btnLoader}
                  type="submit"
                  rounded={4}
                  bg={"#007aff"}
                  color={"#fff"}
                  w={100}
                  h={10}>
                  Save
                </Button>
                {/* )} */}
              </DrawerHeader>

              <TabPanel>
                <DrawerBody
                  position={"relative"}
                  p="0px 50px"
                  overflow={"auto"}>
                  <DrawerFormDetailPage
                    projectInfo={projectInfo}
                    handleMouseDown={handleMouseDown}
                    getValues={getValues}
                    setFormValue={setFormValue}
                    layout={layout}
                    selectedTab={selectedTab}
                    selectedTabIndex={selectedTabIndex}
                    menuItem={menuItem}
                    data={data}
                    selectedRow={selectedRow}
                    handleClose={handleClose}
                    modal={true}
                    dateInfo={dateInfo}
                    setFullScreen={setFullScreen}
                    fullScreen={fullScreen}
                    fieldsMap={fieldsMap}
                    control={control}
                    watch={watch}
                    reset={reset}
                  />
                </DrawerBody>
              </TabPanel>
              {data?.tabs
                ?.filter((tab) => tab?.type !== "section")
                .map(() => (
                  <TabPanel>
                    <DrawerBody p="0px 0px" overflow={"auto"}>
                      <DrawerRelationTable
                        selectedTab={selectedTab}
                        getValues={getValues}
                        handleMouseDown={handleMouseDown}
                        getAllData={getAllData}
                        selectedTabIndex={selectedTabIndex}
                        setSelectedTabIndex={setSelectedTabIndex}
                        relations={tableRelations}
                        control={control}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        reset={reset}
                        setFormValue={setFormValue}
                        tableSlug={tableSlug}
                        watch={watch}
                        loader={loader}
                        setSelectTab={setSelectTab}
                        errors={errors}
                        relatedTable={
                          tableRelations[selectedTabIndex]?.relatedTable
                        }
                        id={itemId}
                        fieldsMap={fieldsMap}
                        data={data}
                        setData={setData}
                      />
                    </DrawerBody>
                  </TabPanel>
                ))}
            </DrawerContent>
          </form>
        </Box>
      </Tabs>
    </Drawer>
  );
}

const ScreenOptions = ({
  selectedViewType,
  selectedRow,
  setSelectedViewType = () => {},
  setLayoutType = () => {},
  navigateToEditPage = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const options = [
    {label: "Side peek", icon: "SidePeek"},
    {label: "Center peek", icon: "CenterPeek"},
    {label: "Full page", icon: "FullPage"},
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    localStorage.setItem("detailPage", option?.icon);
    if (option?.icon === "FullPage") {
      setLayoutType("SimpleLayout");
      navigateToEditPage(selectedRow);
    }

    if (option) setSelectedViewType(option?.icon);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button onClick={handleClick} variant="outlined">
        <span>{getColumnFieldIcon(selectedViewType)}</span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
          {options.map((option) => (
            <MenuItem
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "6px",
                color: "#37352f",
              }}
              key={option.label}
              onClick={() => handleClose(option)}>
              <Box sx={{display: "flex", alignItems: "center", gap: "5px"}}>
                <span>{getColumnFieldIcon(option)}</span>
                {option.label}
              </Box>

              <Box>{option.icon === selectedViewType ? <Check /> : ""}</Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export const getColumnFieldIcon = (column) => {
  if (column === "SidePeek") {
    return (
      <img
        src="/img/drawerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else if (column === "CenterPeek") {
    return (
      <img
        src="/img/centerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else
    return (
      <img
        src="/img/fullpagePeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
};

export default DrawerDetailPage;
