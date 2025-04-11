import {Box, Button, Flex} from "@chakra-ui/react";
import {Check} from "@mui/icons-material";
import {Dialog, Menu, MenuItem, Modal} from "@mui/material";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import layoutService from "../../services/layoutService";
import {store} from "../../store";
import {sortSections} from "../../utils/sectionsOrderNumber";
import NewModalFormPage from "./NewModalFormPage";
import NewModalRelationTable from "./NewModalRelationTable";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

function NewModalDetailPage({
  open,
  layout,
  refetch,
  setOpen,
  menuItem,
  fieldsMap,
  selectedRow,
  projectInfo,
  dateInfo = {},
  selectedViewType,
  fullScreen = false,
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
  const handleClose = () => setOpen(false);
  const {navigateToForm} = useTabRouter();
  const [btnLoader, setBtnLoader] = useState(false);
  const isUserId = useSelector((state) => state?.auth?.userId);

  const {id: idFromParam, tableSlug, appId} = useParams();
  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [loader, setLoader] = useState(true);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const {i18n} = useTranslation();
  const [data, setData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

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
    const getFormData = constructorObjectService.getById(tableSlug, id);

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
      if (!id) {
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

  const rowData = watch();

  const update = (data) => {
    delete data.invite;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        updateLayout();
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
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
    if (id) {
      update(data);
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (id) getAllData();
    else getFields();
  }, [id]);

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
    }
  }, [drawerRef.current]);
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
        <Tabs selectedIndex={selectedTabIndex}>
          <Box position={"relative"} zIndex={9}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex
                px={5}
                h={"44px"}
                align="center"
                justifyContent={"space-between"}>
                <Flex alignItems={"center"} gap="5px">
                  <ScreenOptions
                    selectedViewType={selectedViewType}
                    setSelectedViewType={setSelectedViewType}
                    setLayoutType={setLayoutType}
                    selectedRow={selectedRow}
                    navigateToEditPage={navigateToEditPage}
                  />

                  <Box
                    sx={{
                      width: "1px",
                      height: "14px",
                      margin: "0 6px",
                      background: "rgba(55, 53, 47, 0.16)",
                    }}
                  />

                  <Button
                    onClick={() =>
                      navigate(
                        `/main/${appId}/layout-settings/${tableSlug}/${id}`,
                        {
                          state: {
                            ...rowData,
                          },
                        }
                      )
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

                  <TabList style={{borderBottom: "none"}}>
                    {data?.tabs?.map((el, index) => (
                      <Tab
                        onClick={(e) => {
                          setSelectTab(el);
                          setSelectedTabIndex(index);
                        }}
                        key={index}
                        style={{
                          height: "24px",
                          padding: "0 10px",
                          fontSize: "11px",
                          fontWeight: "500",
                        }}>
                        {el?.label}
                      </Tab>
                    ))}
                  </TabList>
                </Flex>

                {selectedTabIndex === 0 && (
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
                )}
              </Flex>

              <TabPanel>
                <Box overflow={"auto"} h={"600px"} p="0px 80px">
                  <NewModalFormPage
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
                </Box>
              </TabPanel>
              {data?.tabs
                ?.filter((tab) => tab?.type !== "section")
                .map(() => (
                  <TabPanel>
                    <Box id="modalTable" p="0px 0px" h={550}>
                      <NewModalRelationTable
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
                        selectedTab={selectedTab}
                        errors={errors}
                        relatedTable={
                          tableRelations[selectedTabIndex]?.relatedTable
                        }
                        id={id}
                        fieldsMap={fieldsMap}
                        data={data}
                        setData={setData}
                      />
                    </Box>
                  </TabPanel>
                ))}
            </form>
          </Box>
        </Tabs>
      </Box>
    </Dialog>
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

              <Box>{option?.icon === selectedViewType ? <Check /> : ""}</Box>
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

export default NewModalDetailPage;
