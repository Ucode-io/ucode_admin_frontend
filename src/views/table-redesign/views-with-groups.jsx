import useTabRouter from "@/hooks/useTabRouter";
import {useFieldSearchUpdateMutation} from "@/services/constructorFieldService";
import constructorViewService from "@/services/constructorViewService";
import {filterActions} from "@/store/filter/filter.slice";
import {quickFiltersActions} from "@/store/filter/quick_filter";
import {mainActions} from "@/store/main/main.slice";
import {viewsActions} from "@/store/views/view.slice";
import chakraUITheme from "@/theme/chakraUITheme";
import {
  getSearchText,
  openDB,
  saveOrUpdateSearchText,
} from "@/utils/indexedDb.jsx";
import {queryGenerator} from "@/utils/queryGenerator";
import AgGridTableView from "@/views/Objects/AgGridTableView";
import GroupTableView from "@/views/Objects/TableView/GroupTableView";
import style from "@/views/Objects/style.module.scss";
import {getColumnIcon} from "@/views/table-redesign/icons";
import {ArrowBackIcon, ChevronRightIcon} from "@chakra-ui/icons";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@chakra-ui/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {Backdrop, CircularProgress} from "@mui/material";
import {addDays, endOfMonth, startOfMonth} from "date-fns";
import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {default as InlineSVG, default as SVG} from "react-inlinesvg";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CRangePickerNew from "../../components/DatePickers/CRangePickerNew";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import useDebounce from "../../hooks/useDebounce";
import useFilters from "../../hooks/useFilters";
import {useGetLang} from "../../hooks/useGetLang";
import MaterialUIProvider from "../../providers/MaterialUIProvider";
import {ViewProvider} from "../../providers/ViewProvider";
import constructorFieldService from "../../services/constructorFieldService";
import constructorRelationService from "../../services/constructorRelationService";
import constructorTableService, {
  useTableByIdQuery,
} from "../../services/constructorTableService";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {detailDrawerActions} from "../../store/detailDrawer/detailDrawer.slice";
import {groupFieldActions} from "../../store/groupField/groupField.slice";
import {VIEW_TYPES_MAP} from "../../utils/constants/viewTypes";
import {generateGUID} from "../../utils/generateID";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {listToMap} from "../../utils/listToMap";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";
import AggridTreeView from "../Objects/AgGridTableView/AggridTreeView";
import {updateObject} from "../Objects/AgGridTableView/Functions/AggridDefaultComponents";
import ViewOptions from "../Objects/ModalDetailPage/ViewOptions";
import {ViewCreatePopup} from "../Objects/components/ViewCreatePopup";
import {FilterButton} from "./FilterButton";
import {Filter} from "./FilterGenerator";
import {LayoutPopup} from "./LayoutPopup";
import MoreViewsComponent from "./MoreViewsComponent";
import {ScreenOptions} from "./ScreenOptions";
import DrawerTableView from "./drawer-table-view";
import TableView from "./table-view";
import TableViewOld from "./table-view-old";
import {useViewWithGroupsProps} from "./useViewWithGroupsProps";
import TableActions from "./TableActions";
import {AIMenu, useAIChat} from "@/components/ProfilePanel/AIChat";
import { SortPopover } from "./components/SortPopover";

const DrawerFormDetailPage = lazy(
  () => import("../Objects/DrawerDetailPage/DrawerFormDetailPage")
);
const WebsiteView = lazy(() => import("@/views/Objects/WebsiteView"));
const BoardView = lazy(() => import("../Objects/BoardView"));
const CalendarView = lazy(() => import("../Objects/CalendarView"));
const TimeLineView = lazy(() => import("../Objects/TimeLineView"));

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "tree.svg",
  SECTION: "layout.svg",
};

export const NewUiViewsWithGroups = ({
  modal = false,
  views,
  view,
  fieldsMap,
  menuItem,
  visibleRelationColumns,
  visibleColumns,
  fieldsMapRel,
  selectedView,
  relationView = false,
  layout,
  rootForm,
  selectedRow: row,
  data,
  dateInfo,
  fullScreen,
  tableInfo,
  selectedViewType,
  selectedTabIndex,
  relationFields = [],
  updateLayout = () => {},
  setLoading = () => {},
  refetchMenuViews = () => {},
  setSelectedTabIndex = () => {},
  onSubmit = () => {},
  refetchViews = () => {},
  setSelectedView = () => {},
  handleClose = () => {},
  setFullScreen = () => {},
  handleMouseDown = () => {},
  setSelectedViewType = () => {},
  refetchRelationViews = () => {},
}) => {
  const location = useLocation();
  const {
    id,
    menuId: menuid,
    tableSlug: tableSlugFromProps,
    appId,
  } = useParams();

  const tableSlug = relationView
    ? (view?.relation_table_slug ?? view?.table_slug)
    : (tableSlugFromProps ?? view?.table_slug);
  const new_router = Boolean(localStorage.getItem("new_router") === "true");
  const [searchParams] = useSearchParams();
  const menuId = menuid ?? searchParams.get("menuId");
  const queryClient = useQueryClient();
  const visibleForm = useForm();
  const dispatch = useDispatch();
  const {filters} = useFilters(tableSlug, view.id);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const navigate = useNavigate();
  const [isChanged, setIsChanged] = useState(false);
  const [searchText, setSearchText] = useState("");
  const {i18n} = useTranslation();
  const [viewAnchorEl, setViewAnchorEl] = useState(null);
  const [checkedColumns, setCheckedColumns] = useState([]);
  const [sortedDatas, setSortedDatas] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [layoutType, setLayoutType] = useState("SimpleLayout");
  const [selectedRow, setSelectedRow] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [noDates, setNoDates] = useState([]);
  const [centerDate, setCenterDate] = useState(null);
  const {navigateToForm} = useTabRouter();
  const tableLan = useGetLang("Table");
  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const groupTable = view?.attributes?.group_by_columns;
  const viewsRef = useRef();
  const [visibleViews, setVisibleViews] = useState([]);
  const [overflowedViews, setOverflowedViews] = useState([]);

  const [sortPopupAnchorEl, setSortPopupAnchorEl] = useState(null);

  const isSortPopupOpen = Boolean(!!sortPopupAnchorEl);

  const [orderBy, setOrderBy] = useState(false);

  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v") ?? selectedView?.id;

  const projectId = useSelector((state) => state.auth.projectId);
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  const settingsForm = useForm({
    defaultValues: {
      calendar_from_slug: "",
      calendar_to_slug: "",
    },
  });

  const handleCloseSortPopup = () => setSortPopupAnchorEl(null);

  const handleChangeOrder = (order) => {
    const isGivenFromProps = typeof order === "boolean";
    setOrderBy((prev) => {
      constructorTableService.update(
        {
          ...tableInfo,
          order_by: isGivenFromProps ? order : !prev,
        },
        projectId
      );
      return isGivenFromProps ? order : !prev;
    });
  };

  const handleSortClick = (e) => {
    setSortPopupAnchorEl(e.currentTarget);
  };

  const handleAddDate = (item) => {
    const startDate = new Date(centerDate).toISOString();
    const endDate = addDays(new Date(centerDate), 5).toISOString();

    updateObject({
      ...item,
      [settingsForm.getValues()["calendar_from_slug"]]: startDate,
      [settingsForm.getValues()["calendar_to_slug"]]: endDate,
    });
  };

  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );
  const paginationCount = useSelector(
    (state) => state?.pagination?.paginationCount
  );

  const paginiationCount = useMemo(() => {
    const getObject = paginationCount.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageCount ?? 1;
  }, [paginationCount, tableSlug]);

  const [currentPage, setCurrentPage] = useState(paginiationCount);

  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lt: endOfMonth(new Date()),
  });

  const {
    control,
    reset,
    setValue: setFormValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const mainForm = useForm({
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

  const {fields} = useFieldArray({
    control,
    name: "multi",
  });

  const {mutate: updateField, isLoading: updateLoading} =
    useFieldSearchUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS");
      },
    });

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const {data: tabs} = useQuery(
    queryGenerator(groupField, filters, i18n.language)
  );

  const navigateToSettingsPage = () => {
    if (new_router) {
      const url = `/settings/constructor/apps/${menuId}/objects/${tableSlug}?menuId=${menuId}`;
      navigate(url, {
        state: {
          tableInfo: tableInfo,
        },
      });
    } else {
      const url = `/settings/constructor/apps/${menuId}/objects/${menuItem?.table_id}/${menuItem?.data?.table?.slug}?menuId=${menuItem?.id}`;
      navigate(url, {
        state: {
          tableInfo: tableInfo,
        },
      });
    }
  };

  const columnsForSearch = useMemo(() => {
    return Object.values(fieldsMap)?.filter(
      (el) =>
        el?.type === "SINGLE_LINE" ||
        el?.type === "MULTI_LINE" ||
        el?.type === "NUMBER" ||
        el?.type === "PHONE" ||
        el?.type === "EMAIL" ||
        el?.type === "INTERNATION_PHONE" ||
        el?.type === "INCREMENT_ID" ||
        el?.type === "FORMULA_FRONTEND"
    );
  }, [view, fieldsMap]);

  const computedVisibleFields = useMemo(() => {
    const mappedObjects = [];
    Object.values(fieldsMap)?.forEach((obj) => {
      if (obj.type === "LOOKUP" || obj.type === "LOOKUPS") {
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

  const inputChangeHandler = useDebounce((val) => {
    setCurrentPage(1);
    setSearchText(val);
    saveSearchTextToDB(tableSlug, val);
  }, 300);

  const selectAll = () => {
    setCheckedColumns(
      columnsForSearch
        .filter((item) => item.is_search === true)
        .map((item) => item.slug)
    );
  };

  const initDB = async () => {
    const db = await openDB();
    const savedSearch = await getSearchText(db, tableSlug);

    if (savedSearch && savedSearch?.searchText) {
      setSearchText(savedSearch?.searchText);
      setInputKey(inputKey + 1);
    }
  };

  function getTableRelations(relationFields, tableSlug) {
    return relationFields?.filter((relation) => {
      return !(
        (relation.type === "Many2One" &&
          relation.table_from?.slug === tableSlug) ||
        (relation.type === "One2Many" &&
          relation.table_to?.slug === tableSlug) ||
        relation.type === "Recursive" ||
        (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
        (relation.type === "Many2Dynamic" &&
          relation.table_from?.slug === tableSlug)
      );
    });
  }

  const tableRelations = getTableRelations(
    relationFields,
    viewsList?.[0]?.table_slug
  );

  const saveSearchTextToDB = async (tableSlug, searchText) => {
    const db = await openDB();
    await saveOrUpdateSearchText(db, tableSlug, searchText);
  };

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const [authInfo, setAuthInfo] = useState(null);

  const {isLoading} = useTableByIdQuery({
    id: menuItem?.table_id,
    queryParams: {
      enabled: !!menuItem?.table_id,
      onSuccess: (res) => {
        setAuthInfo(res?.attributes?.auth_info);
        mainForm.reset(res);
        // setLoader(false);
      },
    },
  });

  const navigateCreatePage = () => {
    if (projectInfo?.new_layout) {
      if (view?.attributes?.url_object) {
        navigate(
          `/main/${appId}/page/${view?.attributes?.url_object}?create=true`
        );
      } else {
        dispatch(detailDrawerActions.openDrawer());
      }
      setSelectedRow(null);
    } else {
      if (layoutType === "PopupLayout") {
        dispatch(detailDrawerActions.openDrawer());
        setSelectedRow(null);
      } else {
        navigateToForm(tableSlug, "CREATE", {}, {id}, menuId);
      }
    }
  };

  const navigateToEditPage = (row) => {
    if (layoutType === "SimpleLayout") {
      navigateToForm(tableSlug, "EDIT", row, {}, menuId);
    }
    if (layoutType === "PopupLayout") {
      setSelectedRow(row);
      dispatch(detailDrawerActions.openDrawer());
    }
  };

  const viewHandler = (viewEl) => {
    if (Boolean(!location?.pathname?.includes("login"))) {
      updateQueryWithoutRerender("v", viewEl?.id);
    }
  };

  const handleViewClick = (view) => {
    const idx = views?.findIndex((v) => v.id === view.id);
    setSelectedTabIndex(idx);
    viewHandler(view);
    setSelectedView(view);
    dispatch(viewsActions.setSelectedView({view, idx}));
    const isSection = view?.type === "SECTION";
    if (!new_router) {
      dispatch(viewsActions.setViewTab({tableSlug, tabIndex: idx}));
      setSelectedTabIndex(idx);
    } else {
      if (isSection) {
        dispatch(detailDrawerActions.setDrawerTabIndex(idx));
        dispatch(groupFieldActions.trimViewsDataUntil(view));
        dispatch(groupFieldActions.trimViewsUntil(view));
        return;
      }

      if (relationView && !isSection) {
        dispatch(detailDrawerActions.setDrawerTabIndex(idx));
        dispatch(
          groupFieldActions.addViewPath({
            ...view,
          })
        );
      } else {
        dispatch(detailDrawerActions.setMainTabIndex(idx));
      }
    }
  };

  const handleBreadCrumb = (item, index) => {
    if (!viewsList?.length) return;

    if (index === viewsList.length - 1) return;

    if (index === 0) {
      setLoading(true);
      dispatch(detailDrawerActions.setDrawerTabIndex(0));
      dispatch(groupFieldActions.trimViewsUntil(viewsList[0]));
      dispatch(groupFieldActions.trimViewsDataUntil(viewsList[0]));
      updateQueryWithoutRerender("p", viewsList[0]?.detailId);
    } else {
      setLoading(true);
      dispatch(detailDrawerActions.setDrawerTabIndex(0));
      dispatch(groupFieldActions.trimViewsUntil(item));
      dispatch(groupFieldActions.trimViewsDataUntil(item));
      updateQueryWithoutRerender("p", item?.detailId);
    }
  };

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({
        table_id: id ?? menuItem?.table_id,
      });
      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        {},
        tableSlug
      );
      const [{relations = []}, {fields = []}] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
      }));
      const layoutRelations = [];
      const tableRelations = [];
      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
        ) {
          layoutRelations.push(relation);
        } else {
          tableRelations.push(relation);
        }
      });
      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          (relation?.label ?? relation[relation.relatedTableSlug]?.label)
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));
      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
      queryClient.refetchQueries(["GET_TABLE_INFO"]);
    });
  };

  const handleClosePop = () => {
    dispatch(groupFieldActions.clearGroupBySlug());
    setViewAnchorEl(null);
  };

  useEffect(() => {
    initDB();
  }, [tableSlug]);

  useEffect(() => {
    selectAll();
  }, [view, fieldsMap]);

  const TableComponent =
    !relationView && !new_router
      ? TableViewOld
      : Boolean(relationView)
        ? DrawerTableView
        : TableView;

  const tableName = tableInfo?.label;

  const viewName = relationView
    ? view?.attributes?.[`name_${i18n?.language}`] || view?.table_label
    : view?.attributes?.[`name_${i18n?.language}`] || view?.name || view.type;

  // const {
  //   getViewSettings,
  //   viewsWithSettings,
  //   createView,
  //   handleSelectViewType,
  //   selectedViewAnchor,
  //   selectedViewTab,
  //   closeViewSettings,
  //   loading,
  //   computedColumns,
  //   viewErrors,
  // } = useViewWithGroupsProps({
  //   relationView,
  //   tableSlug,
  //   viewsList,
  //   fieldsMap,
  //   fieldsMapRel,
  //   i18n,
  //   menuId,
  //   views,
  //   handleClose,
  //   refetchViews,
  //   handleClosePop,
  //   tableRelations,
  // });

  const updateVisibleViews = useCallback(() => {
    if (!views || views.length === 0) return;

    const container = viewsRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const viewButtonWidth = 90;
    const maxVisible = Math.max(
      1,
      Math.floor(containerWidth / viewButtonWidth)
    );

    let visible = views.slice(0, maxVisible);
    let overflowed = views.slice(maxVisible);

    if (overflowed.length > 0) {
      const chosenView = views.find((v) => v.id === viewId);
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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseViews = () => {
    setAnchorEl(null);
  };
  return (
    <ViewProvider state={{view, fieldsMap}}>
      <ChakraProvider theme={chakraUITheme}>
        <Flex
          h={modal ? `100vh` : "100vh"}
          overflow={"hidden"}
          flexDirection="column"
          bg={"white"}>
          {updateLoading && (
            <Backdrop
              sx={{zIndex: (theme) => theme.zIndex.drawer + 999}}
              open={true}>
              <RingLoaderWithWrapper />
            </Backdrop>
          )}
          {viewsList?.length && relationView ? (
            <Flex
              minH="45px"
              h="36px"
              px="16px"
              alignItems="center"
              bg="#fff"
              borderBottom="1px solid #EAECF0"
              columnGap="8px">
              {relationView && (
                <IconButton
                  aria-label="back"
                  icon={<ArrowBackIcon fontSize={20} color="#344054" />}
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => {
                    handleClose("close");
                    if (location?.state?.fullPage) {
                      navigate(-1);
                      setLayoutType("SidePeek");
                    }
                  }}
                  size="sm"
                />
              )}

              {!relationView && (
                <IconButton
                  aria-label="back"
                  icon={<ArrowBackIcon fontSize={20} color="#344054" />}
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => {
                    navigate(-1);
                  }}
                  size="sm"
                />
              )}

              {relationView ? (
                <MaterialUIProvider>
                  <Flex>
                    <ScreenOptions
                      projectInfo={projectInfo}
                      view={selectedView}
                      selectedViewType={selectedViewType}
                      selectedRow={selectedRow}
                      setSelectedViewType={setSelectedViewType}
                      setLayoutType={setLayoutType}
                    />
                    <Box
                      sx={{
                        marginLeft: "10px",
                        height: "18px",
                      }}>
                      <Box
                        onClick={() => {
                          navigate(`/${menuId}/customize/${tableInfo?.id}`, {
                            state: {
                              ...data,
                              tableSlug,
                              backLink: location?.pathname,
                            },
                          });
                          dispatch(detailDrawerActions.closeDrawer());
                        }}
                        sx={{
                          cursor: "pointer",
                          alignItems: "center",
                          gap: "5px",
                          color: "rgba(55, 53, 47, 0.5)",
                          "&:hover": {
                            background: "rgba(55, 53, 47, 0.06)",
                          },
                        }}>
                        <SpaceDashboardIcon />
                      </Box>
                    </Box>
                  </Flex>
                </MaterialUIProvider>
              ) : (
                <IconButton
                  aria-label="home"
                  icon={<img src="/img/home.svg" alt="home" />}
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => navigate("/")}
                  ml="8px"
                  size="sm"
                />
              )}
              {viewsList?.length &&
                viewsList?.map((item, index) => (
                  <>
                    {" "}
                    <ChevronRightIcon fontSize={20} color="#344054" />
                    <Flex
                      py="4px"
                      px="8px"
                      bg="#EAECF0"
                      borderRadius={6}
                      color="#344054"
                      cursor={"pointer"}
                      fontWeight={500}
                      alignItems="center"
                      columnGap="8px"
                      onClick={() => {
                        handleBreadCrumb(item, index);
                      }}>
                      <Flex
                        w="16px"
                        h="16px"
                        bg="#EE46BC"
                        borderRadius={4}
                        columnGap={8}
                        color="#fff"
                        fontWeight={500}
                        fontSize={11}
                        justifyContent="center"
                        alignItems="center">
                        {item?.label?.[0]}
                      </Flex>
                      {item?.label}
                    </Flex>
                  </>
                ))}

              {/* <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                <Button
                  h="30px"
                  ml="auto"
                  onClick={navigateToSettingsPage}
                  variant="outline"
                  colorScheme="gray"
                  borderColor="#D0D5DD"
                  color="#344054"
                  leftIcon={<Image src="/img/settings.svg" alt="settings" />}
                  borderRadius="8px"
                >
                  {generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Table Settings"
                  ) || "Table Settings"}
                </Button>
              </PermissionWrapperV2> */}
            </Flex>
          ) : (
            <Flex
              minH="45px"
              h="36px"
              px="16px"
              alignItems="center"
              bg="#fff"
              borderBottom="1px solid #EAECF0"
              columnGap="8px">
              {relationView && (
                <IconButton
                  aria-label="back"
                  icon={<ArrowBackIcon fontSize={20} color="#344054" />}
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => {
                    handleClose();
                  }}
                  size="sm"
                />
              )}

              {!relationView && (
                <IconButton
                  aria-label="back"
                  icon={<ArrowBackIcon fontSize={20} color="#344054" />}
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => {
                    navigate(-1);
                  }}
                  size="sm"
                />
              )}

              <IconButton
                aria-label="home"
                icon={<img src="/img/home.svg" alt="home" />}
                variant="ghost"
                colorScheme="gray"
                onClick={() => navigate("/")}
                ml="8px"
                size="sm"
              />
              <ChevronRightIcon fontSize={20} color="#344054" />
              <Flex
                py="4px"
                px="8px"
                bg="#EAECF0"
                borderRadius={6}
                color="#344054"
                fontWeight={500}
                alignItems="center"
                columnGap="8px">
                <Flex
                  w="16px"
                  h="16px"
                  bg="#EE46BC"
                  borderRadius={4}
                  columnGap={8}
                  color="#fff"
                  fontWeight={500}
                  fontSize={11}
                  justifyContent="center"
                  alignItems="center">
                  {tableName?.[0]}
                </Flex>
                {tableName}
              </Flex>

              <Flex position="absolute" right="16px" gap="8px">
                <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                  <TableActions tableSlug={tableSlug} tableLan={tableLan} />
                </PermissionWrapperV2>
                <SearchButton />
              </Flex>
              {/* <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                <Button
                  h="30px"
                  ml="auto"
                  onClick={navigateToSettingsPage}
                  variant="outline"
                  colorScheme="gray"
                  borderColor="#D0D5DD"
                  color="#344054"
                  leftIcon={<Image src="/img/settings.svg" alt="settings" />}
                  borderRadius="8px"
                >
                  {generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Table Settings"
                  ) || "Table Settings"}
                </Button>
              </PermissionWrapperV2> */}
            </Flex>
          )}

          <Flex
            minH="40px"
            h="40px"
            px="16px"
            alignItems="center"
            bg="#fff"
            borderBottom="1px solid #EAECF0"
            columnGap="5px">
            <Flex
              ref={viewsRef}
              w={"70%"}
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              overflow={"scroll"}>
              {(visibleViews ?? []).map((view, index) => (
                <Button
                  p={"0 6px"}
                  minW={"80px"}
                  key={view.id}
                  variant="ghost"
                  colorScheme="gray"
                  mx={"4px"}
                  leftIcon={
                    <SVG
                      src={`/img/${viewIcons[view.type]}`}
                      color={viewId === view?.id ? "#175CD3" : "#475467"}
                      width={18}
                      height={18}
                    />
                  }
                  fontSize={13}
                  h={"30px"}
                  fontWeight={500}
                  color={viewId === view?.id ? "#175CD3" : "#475467"}
                  bg={viewId === view?.id ? "#D1E9FF" : "#fff"}
                  _hover={viewId === view?.id ? {bg: "#D1E9FF"} : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (overflowedViews?.length > 0) {
                      if (index !== visibleViews?.length - 1) {
                        handleViewClick(view, index);
                      } else {
                        handleClick(e);
                      }
                    } else handleViewClick(view, index);
                  }}>
                  {view?.is_relation_view
                    ? view?.attributes?.[`name_${i18n?.language}`] ||
                      view?.table_label ||
                      view.type
                    : view?.attributes?.[`name_${i18n?.language}`] ||
                      view?.name ||
                      view.type}

                  {overflowedViews?.length > 0 &&
                    index === visibleViews?.length - 1 && (
                      <Box
                        onClick={handleClick}
                        sx={{
                          height: "19px",
                          cursor: "pointer",
                        }}>
                        <KeyboardArrowDownIcon />
                      </Box>
                    )}
                </Button>
              ))}
              {overflowedViews?.length > 0 && (
                <MoreViewsComponent
                  tableLan={tableLan}
                  views={overflowedViews}
                  selectedView={selectedView}
                  refetchViews={refetchViews}
                  selectedTabIndex={selectedTabIndex}
                  handleViewClick={handleViewClick}
                  handleClose={handleCloseViews}
                  anchorEl={anchorEl}
                  open={open}
                />
              )}
            </Flex>

            {!overflowedViews?.length > 0 && (
              <PermissionWrapperV2 tableSlug={tableSlug} type="view_create">
                <Button
                  leftIcon={<Image src="/img//plus-icon.svg" alt="Add" />}
                  variant="ghost"
                  colorScheme="gray"
                  color="#475467"
                  onClick={(ev) => setViewAnchorEl(ev.currentTarget)}>
                  {generateLangaugeText(tableLan, i18n?.language, "View") ||
                    "View"}
                </Button>
              </PermissionWrapperV2>
            )}

            {view?.type === "FINANCE CALENDAR" && (
              <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
            )}

            <ViewCreatePopup
              fieldsMap={fieldsMap}
              fieldsMapRel={fieldsMapRel}
              handleClose={handleClose}
              handleClosePop={handleClosePop}
              menuId={menuId}
              refetchViews={refetchViews}
              relationFields={relationFields}
              relationView={relationView}
              setSelectedView={setSelectedView}
              tableSlug={tableSlug}
              viewAnchorEl={viewAnchorEl}
              views={views}
            />

            <Popover placement="bottom-end">
              <InputGroup ml="auto" w="320px">
                <InputLeftElement>
                  <Image src="/img/search-lg.svg" alt="search" />
                </InputLeftElement>
                <Input
                  id="search_input"
                  defaultValue={searchText}
                  placeholder={
                    generateLangaugeText(tableLan, i18n?.language, "Search") ||
                    "Search"
                  }
                  onChange={(ev) => inputChangeHandler(ev.target.value)}
                />

                {(roleInfo === "DEFAULT ADMIN" ||
                  permissions?.search_button) && (
                  <PopoverTrigger>
                    <InputRightElement>
                      <IconButton
                        w="24px"
                        h="24px"
                        aria-label="more"
                        icon={<Image src="/img/dots-vertical.svg" alt="more" />}
                        variant="ghost"
                        colorScheme="gray"
                        size="xs"
                      />
                    </InputRightElement>
                  </PopoverTrigger>
                )}
              </InputGroup>

              <PopoverContent
                w="280px"
                p="8px"
                display="flex"
                flexDirection="column"
                maxH="300px"
                overflow="auto">
                {columnsForSearch.map((column) => (
                  <Flex
                    key={column.id}
                    as="label"
                    p="8px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer">
                    {getColumnIcon({column})}
                    <ViewOptionTitle>
                      {column?.attributes?.[`label_${i18n.language}`] ||
                        column?.label}
                    </ViewOptionTitle>
                    <Switch
                      ml="auto"
                      isChecked={column.is_search}
                      onChange={(e) =>
                        updateField({
                          data: {
                            fields: columnsForSearch.map((c) =>
                              c.id === column.id
                                ? {...c, is_search: e.target.checked}
                                : c
                            ),
                          },
                          tableSlug,
                        })
                      }
                    />
                  </Flex>
                ))}
              </PopoverContent>
            </Popover>

            {view?.type !== "SECTION" && (
              <Box display="flex">
                {view?.type === VIEW_TYPES_MAP.TABLE && (
                  <IconButton
                    fontSize="1.7rem"
                    variant="ghost"
                    color={orderBy ? "#0365F2" : "#475467"}
                    sx={{color: orderBy ? "#0365F2" : "#475467"}}
                    icon={<SwapVertIcon fontSize="inherit" />}
                    onClick={handleSortClick}
                  />
                )}
                <SortPopover
                  tableSlug={tableSlug}
                  open={isSortPopupOpen}
                  anchorEl={sortPopupAnchorEl}
                  handleClose={handleCloseSortPopup}
                  fieldsMap={fieldsMap}
                  setSortedDatas={setSortedDatas}
                  handleChangeOrder={handleChangeOrder}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                />
                <FilterPopover
                  tableLan={tableLan}
                  view={view}
                  visibleColumns={visibleColumns}
                  refetchViews={refetchViews}
                  tableSlug={tableSlug}>
                  <FilterButton view={view} />
                </FilterPopover>
              </Box>
            )}

            {view?.type === "TIMELINE" && noDates.length > 0 && (
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="text"
                    _hover={{backgroundColor: "rgba(0, 122, 255, 0.08)"}}
                    fontWeight={400}
                    color={"#888"}>
                    No date ({noDates.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
                    {noDates.map((item) => (
                      <Box
                        p="8px"
                        h="32px"
                        columnGap="8px"
                        alignItems="center"
                        borderRadius={6}
                        _hover={{bg: "#EAECF0"}}
                        cursor="pointer"
                        key={item?.guid}
                        fontSize={12}
                        onClick={() => handleAddDate(item)}>
                        {item?.[view?.attributes?.visible_field?.split("/")[0]]}
                      </Box>
                    ))}
                  </Box>
                </PopoverContent>
              </Popover>
            )}

            {view?.type !== "SECTION" && (
              <>
                <PermissionWrapperV2 tableSlug={tableSlug} type="write">
                  <Button
                    minW={"auto"}
                    width={"auto"}
                    h={"30px"}
                    px={4}
                    onClick={() => navigateCreatePage()}>
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Create item"
                    ) || "Create item"}
                  </Button>
                </PermissionWrapperV2>
                <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                  <ViewOptions
                    tableInfo={tableInfo}
                    relationView={relationView}
                    refetchViews={refetchViews}
                    selectedTabIndex={selectedTabIndex}
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                    selectedView={selectedView}
                    tableLan={tableLan}
                    view={view}
                    viewName={viewName}
                    fieldsMap={fieldsMap}
                    visibleRelationColumns={visibleRelationColumns}
                    checkedColumns={checkedColumns}
                    projectId={projectId}
                    onDocsClick={() => {
                      dispatch(
                        detailDrawerActions.setDrawerTabIndex(views?.length)
                      );
                      if (new_router) {
                        navigate(`/${menuId}/templates?tableSlug=${tableSlug}`);
                      } else {
                        navigate(
                          `/main/${appId}/object/${tableSlug}/templates`
                        );
                      }
                    }}
                    searchText={searchText}
                    computedVisibleFields={computedVisibleFields}
                    handleOpenPopup={handleOpenPopup}
                    queryClient={queryClient}
                    settingsForm={settingsForm}
                    views={views}
                    refetchMenuViews={refetchMenuViews}
                    refetchRelationViews={refetchRelationViews}
                  />
                </PermissionWrapperV2>
              </>
            )}
          </Flex>

          {view?.attributes?.quick_filters?.length > 0 && (
            <FiltersList
              tableLan={tableLan}
              view={view}
              fieldsMap={fieldsMap}
              visibleColumns={visibleColumns}
              refetchViews={refetchViews}
              tableSlug={tableSlug}
            />
          )}

          <Tabs
            direction={"ltr"}
            defaultIndex={0}
            style={{
              height: view?.type === VIEW_TYPES_MAP.BOARD ? "100%" : "auto",
            }}>
            {tabs?.length > 0 &&
              view?.type !== "GRID" &&
              view?.type !== "BOARD" && (
                <div id="tabsHeight" className={style.tableCardHeader}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <div className="title" style={{marginRight: "20px"}}>
                      <h3>{view.table_label}</h3>
                    </div>
                    <TabList style={{border: "none"}}>
                      {tabs?.map((tab) => (
                        <Tab
                          key={tab.value}
                          selectedClassName={style.activeTab}
                          className={`${style.disableTab} react-tabs__tab`}>
                          {tab.label}
                        </Tab>
                      ))}
                    </TabList>
                  </div>
                </div>
              )}
            {new_router && view?.type === "SECTION" ? (
              <Box px={10}>
                <form onSubmit={rootForm.handleSubmit(onSubmit)}>
                  <Suspense
                    fallback={
                      <div
                        style={{
                          height: "90vh",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <CircularProgress />
                      </div>
                    }>
                    <DrawerFormDetailPage
                      view={view}
                      modal={modal}
                      tableInfo={tableInfo}
                      layoutType={layoutType}
                      selectedViewType={selectedViewType}
                      rootForm={rootForm}
                      layout={layout}
                      selectedTab={layout?.tabs?.[0]}
                      selectedTabIndex={selectedTabIndex}
                      menuItem={menuItem}
                      data={data}
                      selectedRow={row}
                      dateInfo={dateInfo}
                      fullScreen={fullScreen}
                      fieldsMap={fieldsMap}
                      projectInfo={projectInfo}
                      onSubmit={onSubmit}
                      setFullScreen={setFullScreen}
                      updateLayout={updateLayout}
                      handleClose={handleClose}
                      setLayoutType={setLayoutType}
                      handleMouseDown={handleMouseDown}
                      navigateToEditPage={navigateToEditPage}
                      setSelectedViewType={setSelectedViewType}
                    />
                  </Suspense>
                </form>
              </Box>
            ) : (
              <>
                {!tabs?.length && (
                  <>
                    {view?.type === "WEBSITE" && <WebsiteView view={view} />}
                    {view?.type === "GRID" && groupTable?.length ? (
                      <MaterialUIProvider>
                        <AgGridTableView
                          mainForm={mainForm}
                          setLoading={setLoading}
                          relationView={relationView}
                          projectInfo={projectInfo}
                          searchText={searchText}
                          selectedRow={selectedRow}
                          setLayoutType={setLayoutType}
                          navigateToEditPage={navigateToEditPage}
                          selectedTabIndex={selectedTabIndex}
                          view={view}
                          views={views}
                          fieldsMap={fieldsMap}
                          computedVisibleFields={computedVisibleFields}
                          checkedColumns={checkedColumns}
                          setCheckedColumns={setCheckedColumns}
                          columnsForSearch={columnsForSearch}
                          updateField={updateField}
                          visibleColumns={visibleColumns}
                          visibleRelationColumns={visibleRelationColumns}
                          visibleForm={visibleForm}
                          menuItem={menuItem}
                          layoutType={layoutType}
                          setFormValue={setFormValue}
                        />
                      </MaterialUIProvider>
                    ) : view.type === "TABLE" && groupTable?.length ? (
                      <GroupTableView
                        tableLan={tableLan}
                        selectedTabIndex={selectedTabIndex}
                        reset={reset}
                        sortedDatas={sortedDatas}
                        menuItem={menuItem}
                        fields={fields}
                        setFormValue={setFormValue}
                        control={control}
                        setFormVisible={setFormVisible}
                        formVisible={formVisible}
                        filters={filters}
                        checkedColumns={checkedColumns}
                        view={view}
                        setSortedDatas={setSortedDatas}
                        fieldsMap={fieldsMap}
                        searchText={searchText}
                        selectedObjects={selectedObjects}
                        setSelectedObjects={setSelectedObjects}
                        selectedView={selectedView}
                      />
                    ) : view.type === "TIMELINE" ? (
                      <Suspense
                        fallback={
                          <div
                            style={{
                              height: "90vh",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                            <CircularProgress />
                          </div>
                        }>
                        <TimeLineView
                          setFormValue={setFormValue}
                          projectInfo={projectInfo}
                          layoutType={layoutType}
                          view={view}
                          noDates={noDates}
                          searchText={searchText}
                          columnsForSearch={columnsForSearch}
                          menuItem={menuItem}
                          selectedView={selectedView}
                          selectedTabIndex={selectedTabIndex}
                          setSelectedTabIndex={setSelectedTabIndex}
                          views={views}
                          fieldsMap={fieldsMap}
                          isViewLoading={isLoading}
                          setNoDates={setNoDates}
                          setLayoutType={setLayoutType}
                          setCenterDate={setCenterDate}
                          relationView={relationView}
                          setSelectedView={setSelectedView}
                        />
                      </Suspense>
                    ) : null}
                  </>
                )}
                {view.type === "BOARD" && (
                  <Suspense
                    fallback={
                      <div
                        style={{
                          height: "90vh",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <CircularProgress />
                      </div>
                    }>
                    <BoardView
                      setSelectedRow={setSelectedRow}
                      selectedRow={selectedRow}
                      relationView={relationView}
                      layoutType={layoutType}
                      setFormValue={setFormValue}
                      setLoading={setLoading}
                      setLayoutType={setLayoutType}
                      selectedView={selectedView}
                      setSelectedView={setSelectedView}
                      projectInfo={projectInfo}
                      menuItem={menuItem}
                      fieldsMapRel={fieldsMapRel}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      visibleColumns={visibleColumns}
                      visibleRelationColumns={visibleRelationColumns}
                      views={views}
                      fieldsMap={fieldsMap}
                      view={view}
                    />
                  </Suspense>
                )}
                {view.type === "CALENDAR" && (
                  <Suspense
                    fallback={
                      <div
                        style={{
                          height: "90vh",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <CircularProgress />
                      </div>
                    }>
                    <CalendarView
                      menuItem={menuItem}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      view={view}
                      views={views}
                      key={"calendar"}
                      layoutType={layoutType}
                      setLayoutType={setLayoutType}
                      relationView={relationView}
                    />
                  </Suspense>
                )}
                {!groupTable?.length &&
                  view.type !== "TIMELINE" &&
                  view.type !== "BOARD" &&
                  tabs?.map((tab) => (
                    <TabPanel key={tab.value}>
                      {view?.type === "GRID" ? (
                        <MaterialUIProvider>
                          <AgGridTableView
                            mainForm={mainForm}
                            setLoading={setLoading}
                            relationView={relationView}
                            projectInfo={projectInfo}
                            searchText={searchText}
                            selectedRow={selectedRow}
                            setLayoutType={setLayoutType}
                            navigateToEditPage={navigateToEditPage}
                            selectedTabIndex={selectedTabIndex}
                            view={view}
                            views={views}
                            fieldsMap={fieldsMap}
                            computedVisibleFields={computedVisibleFields}
                            checkedColumns={checkedColumns}
                            setCheckedColumns={setCheckedColumns}
                            columnsForSearch={columnsForSearch}
                            updateField={updateField}
                            visibleColumns={visibleColumns}
                            visibleRelationColumns={visibleRelationColumns}
                            visibleForm={visibleForm}
                            menuItem={menuItem}
                            setFormValue={setFormValue}
                          />
                        </MaterialUIProvider>
                      ) : view.type === "TREE" ? (
                        <MaterialUIProvider>
                          <AggridTreeView
                            navigateCreatePage={navigateCreatePage}
                            getRelationFields={getRelationFields}
                            mainForm={mainForm}
                            searchText={searchText}
                            layoutType={layoutType}
                            selectedRow={selectedRow}
                            projectInfo={projectInfo}
                            setLayoutType={setLayoutType}
                            navigateToEditPage={navigateToEditPage}
                            selectedTabIndex={selectedTabIndex}
                            view={view}
                            views={views}
                            fieldsMap={fieldsMap}
                            relationView={relationView}
                            setFormValue={setFormValue}
                            computedVisibleFields={computedVisibleFields}
                            checkedColumns={checkedColumns}
                            setCheckedColumns={setCheckedColumns}
                            columnsForSearch={columnsForSearch}
                            updateField={updateField}
                            visibleColumns={visibleColumns}
                            visibleRelationColumns={visibleRelationColumns}
                            visibleForm={visibleForm}
                            menuItem={menuItem}
                          />
                        </MaterialUIProvider>
                      ) : (
                        <TableComponent
                          projectInfo={projectInfo}
                          setLoading={setLoading}
                          refetchMenuViews={refetchMenuViews}
                          setSelectedView={setSelectedView}
                          relationView={relationView}
                          selectedRow={selectedRow}
                          setSelectedRow={setSelectedRow}
                          setLayoutType={setLayoutType}
                          layoutType={layoutType}
                          tableLan={tableLan}
                          isVertical
                          setCurrentPage={setCurrentPage}
                          currentPage={currentPage}
                          visibleColumns={visibleColumns}
                          visibleRelationColumns={visibleRelationColumns}
                          visibleForm={visibleForm}
                          filterVisible={filterVisible}
                          control={control}
                          getValues={getValues}
                          setFormVisible={setFormVisible}
                          formVisible={formVisible}
                          filters={filters}
                          setFilterVisible={setFilterVisible}
                          view={view}
                          fieldsMap={fieldsMap}
                          setFormValue={setFormValue}
                          setSortedDatas={setSortedDatas}
                          tab={tab}
                          selectedObjects={selectedObjects}
                          setSelectedObjects={setSelectedObjects}
                          menuItem={menuItem}
                          selectedTabIndex={selectedTabIndex}
                          reset={reset}
                          sortedDatas={sortedDatas}
                          fields={fields}
                          checkedColumns={checkedColumns}
                          searchText={searchText}
                          selectedView={selectedView}
                          currentView={view}
                          watch={watch}
                          setOrderBy={setOrderBy}
                          orderBy={orderBy}
                        />
                      )}
                    </TabPanel>
                  ))}

                {!tabs?.length &&
                !groupTable?.length &&
                view.type !== "TIMELINE" &&
                view.type !== "BOARD" &&
                view.type !== "CALENDAR" ? (
                  <>
                    {view?.type === "GRID" ? (
                      <MaterialUIProvider>
                        <AgGridTableView
                          mainForm={mainForm}
                          setLoading={setLoading}
                          relationView={relationView}
                          projectInfo={projectInfo}
                          tableSlug={tableSlug}
                          searchText={searchText}
                          selectedRow={selectedRow}
                          layoutType={layoutType}
                          setLayoutType={setLayoutType}
                          navigateToEditPage={navigateToEditPage}
                          selectedTabIndex={selectedTabIndex}
                          view={view}
                          views={views}
                          fieldsMap={fieldsMap}
                          computedVisibleFields={computedVisibleFields}
                          checkedColumns={checkedColumns}
                          setCheckedColumns={setCheckedColumns}
                          columnsForSearch={columnsForSearch}
                          updateField={updateField}
                          visibleColumns={visibleColumns}
                          visibleRelationColumns={visibleRelationColumns}
                          visibleForm={visibleForm}
                          menuItem={menuItem}
                          setFormValue={setFormValue}
                        />
                      </MaterialUIProvider>
                    ) : view.type === "TREE" ? (
                      <AggridTreeView
                        navigateCreatePage={navigateCreatePage}
                        getRelationFields={getRelationFields}
                        mainForm={mainForm}
                        searchText={searchText}
                        selectedRow={selectedRow}
                        projectInfo={projectInfo}
                        layoutType={layoutType}
                        setLayoutType={setLayoutType}
                        navigateToEditPage={navigateToEditPage}
                        selectedTabIndex={selectedTabIndex}
                        view={view}
                        views={views}
                        fieldsMap={fieldsMap}
                        relationView={relationView}
                        setFormValue={setFormValue}
                        computedVisibleFields={computedVisibleFields}
                        checkedColumns={checkedColumns}
                        setCheckedColumns={setCheckedColumns}
                        columnsForSearch={columnsForSearch}
                        updateField={updateField}
                        visibleColumns={visibleColumns}
                        visibleRelationColumns={visibleRelationColumns}
                        visibleForm={visibleForm}
                        menuItem={menuItem}
                      />
                    ) : (
                      <TableComponent
                        projectInfo={projectInfo}
                        setLoading={setLoading}
                        refetchMenuViews={refetchMenuViews}
                        setSelectedView={setSelectedView}
                        relationView={relationView}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        setLayoutType={setLayoutType}
                        layoutType={layoutType}
                        tableLan={tableLan}
                        visibleColumns={visibleColumns}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        visibleRelationColumns={visibleRelationColumns}
                        visibleForm={visibleForm}
                        currentView={view}
                        filterVisible={filterVisible}
                        setFilterVisible={setFilterVisible}
                        getValues={getValues}
                        selectedTabIndex={selectedTabIndex}
                        isTableView={true}
                        reset={reset}
                        sortedDatas={sortedDatas}
                        menuItem={menuItem}
                        fields={fields}
                        setFormValue={setFormValue}
                        control={control}
                        setFormVisible={setFormVisible}
                        formVisible={formVisible}
                        filters={filters}
                        checkedColumns={checkedColumns}
                        view={view}
                        setSortedDatas={setSortedDatas}
                        fieldsMap={fieldsMap}
                        searchText={searchText}
                        selectedObjects={selectedObjects}
                        setSelectedObjects={setSelectedObjects}
                        selectedView={selectedView}
                        watch={watch}
                        setOrderBy={setOrderBy}
                        orderBy={orderBy}
                      />
                    )}
                  </>
                ) : null}
              </>
            )}
          </Tabs>
        </Flex>
      </ChakraProvider>
      <LayoutPopup
        view={view}
        open={isPopupOpen}
        onClose={handleClosePopup}
        authData={authInfo}
        control={mainForm.control}
        handleSubmit={mainForm.handleSubmit}
        tableLan={tableLan}
      />
    </ViewProvider>
  );
};

const FilterPopover = ({
  view,
  visibleColumns,
  refetchViews,
  children,
  tableLan,
  tableSlug,
}) => {
  const ref = useRef();
  const [search, setSearch] = useState("");
  const {i18n} = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent px="4px" py="8px" ref={ref}>
        <InputGroup mb="8px">
          <InputLeftElement>
            <Image src="/img/search-lg.svg" alt="search" />
          </InputLeftElement>
          <Input
            placeholder={
              generateLangaugeText(
                tableLan,
                i18n?.language,
                "Seaarch by filled name"
              ) || "Search by filled name"
            }
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </InputGroup>
        <FiltersSwitch
          view={view}
          visibleColumns={visibleColumns}
          refetchViews={refetchViews}
          search={search}
          tableSlug={tableSlug}
        />
      </PopoverContent>
    </Popover>
  );
};

const FiltersList = ({
  view,
  fieldsMap,
  visibleColumns,
  refetchViews,
  tableLan,
  tableSlug,
}) => {
  const {new_list} = useSelector((state) => state.filter);
  const [queryParameters] = useSearchParams();
  const filtersOpen = useSelector((state) => state.main.tableViewFiltersOpen);
  const {filters} = useFilters(tableSlug, view?.id);
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const filtersRef = useRef(null);

  useEffect(() => {
    if (queryParameters.get("specialities")?.length) {
      dispatch(
        filterActions.setFilter({
          tableSlug: tableSlug,
          viewId: view?.id,
          name: "specialities_id",
          value: [`${queryParameters.get("specialities")}`],
        })
      );
    }
  }, [queryParameters]);

  const computedFields = useMemo(() => {
    const filter = view?.attributes?.quick_filters ?? [];

    return (
      [
        ...(filter ?? []),
        ...(new_list[tableSlug] ?? [])
          ?.filter(
            (fast) =>
              fast.is_checked &&
              !view?.attributes?.quick_filters?.find(
                (quick) => quick?.id === fast.id
              )
          )
          ?.map((fast) => fast),
      ]
        ?.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return fieldsMap[el?.relation_id];
          } else {
            return fieldsMap[el?.id];
          }
        })
        ?.filter((el) => el) ?? []
    );
  }, [view?.attributes?.quick_filters, fieldsMap, new_list, tableSlug]);

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name: name,
        value,
      })
    );
  };

  useEffect(() => {
    if (filtersRef.current) {
      localStorage.setItem("filtersHeight", filtersRef.current.offsetHeight);
    }
  }, [computedFields]);

  if (!filtersOpen) {
    return;
  }

  return (
    <Flex
      ref={filtersRef}
      minH="max-content"
      px="16px"
      py="6px"
      bg="#fff"
      alignItems="center"
      gap="6px"
      borderBottom="1px solid #EAECF0"
      flexWrap="wrap"
      id="filterHeight">
      <FilterPopover
        tableLan={tableLan}
        view={view}
        visibleColumns={visibleColumns}
        refetchViews={refetchViews}
        tableSlug={tableSlug}>
        <Flex
          alignItems="center"
          columnGap="4px"
          border="1px solid #EAECF0"
          borderRadius={32}
          color="#FFFFFF70"
          py="1px"
          px="8px"
          cursor="pointer"
          _hover={{bg: "#f3f3f3"}}>
          <InlineSVG
            src="/img/plus-icon.svg"
            width={14}
            height={14}
            color="#909EAB"
          />
          <Box color="#909EAB">
            {generateLangaugeText(tableLan, i18n?.language, "Add filter") ||
              "Add filter"}
          </Box>
        </Flex>
      </FilterPopover>

      {computedFields?.map((filter) => (
        <div key={filter.id}>
          <Filter
            field={filter}
            name={filter?.path_slug || filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}
    </Flex>
  );
};

const FiltersSwitch = ({
  view,
  visibleColumns,
  refetchViews,
  search,
  relationView = false,
  tableSlug,
}) => {
  const queryClient = useQueryClient();
  // const {tableSlug} = useParams();
  // const tableSlug = view?.table_slug;
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const [queryParameters] = useSearchParams();

  const columnsIds = visibleColumns?.map((item) => item?.id);
  const quickFiltersIds = view?.attributes?.quick_filters?.map(
    (item) => item?.id
  );

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column.label;

  const checkedColumns = useMemo(() => {
    return (
      view?.attributes?.quick_filters?.filter((checkedField) =>
        search
          ? columnsIds?.includes(checkedField?.id) &&
            getLabel(checkedField)?.toLowerCase().includes(search.toLowerCase())
          : columnsIds?.includes(checkedField?.id)
      ) ?? []
    );
  }, [view, search]);

  const unCheckedColumns = useMemo(() => {
    return (
      (view?.attributes?.quick_filters?.length === 0 ||
      view?.attributes?.quick_filters?.length === undefined
        ? search
          ? visibleColumns?.filter((column) =>
              getLabel(column)?.toLowerCase().includes(search.toLowerCase())
            )
          : visibleColumns
        : visibleColumns?.filter((column) =>
            search
              ? !quickFiltersIds?.includes(column?.id) &&
                getLabel(column)?.toLowerCase().includes(search.toLowerCase())
              : !quickFiltersIds?.includes(column?.id)
          )) ?? []
    );
  }, [view, search]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      if (relationView) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else {
        return refetchViews();
      }
    },
    onSettled: (data) => {
      dispatch(quickFiltersActions.setQuickFiltersCount(data?.length));
    },
  });

  const updateView = async (data, checked) => {
    const result = data?.map((item) => ({
      ...item,
      is_checked: true,
    }));

    await mutation.mutateAsync({
      ...view,
      attributes: {...view?.attributes, quick_filters: result},
    });
    if (view?.attributes?.quick_filters?.length === 0) {
      dispatch(mainActions.setTableViewFiltersOpen(true));
    }
    if (view?.attributes?.quick_filters?.length === 1 && !checked) {
      dispatch(mainActions.setTableViewFiltersOpen(false));
    }
  };

  const onChange = (column, checked) => {
    const quickFilters = view?.attributes?.quick_filters ?? [];

    !checked
      ? dispatch(
          filterActions.clearFilters({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          })
        )
      : dispatch(
          filterActions.setFilter({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          })
        );

    updateView(
      checked
        ? [...quickFilters, column]
        : quickFilters.filter((c) => c.id !== column.id),
      checked
    );
  };

  return (
    <Flex flexDirection="column" maxHeight="300px" overflow="auto">
      {checkedColumns.map((column) => (
        <Flex
          key={column.id}
          as="label"
          p="8px"
          columnGap="8px"
          alignItems="center"
          borderRadius={6}
          _hover={{bg: "#EAECF0"}}
          cursor="pointer">
          {column?.type && getColumnIcon({column})}
          {getLabel(column)}
          <Switch
            ml="auto"
            isChecked={true}
            onChange={(ev) => onChange(column, ev.target.checked)}
          />
        </Flex>
      ))}

      {unCheckedColumns.map((column) => (
        <Flex
          key={column.id}
          as="label"
          p="8px"
          columnGap="8px"
          alignItems="center"
          borderRadius={6}
          _hover={{bg: "#EAECF0"}}
          cursor="pointer">
          {column?.type && getColumnIcon({column})}
          {getLabel(column)}
          <Switch
            ml="auto"
            isChecked={false}
            onChange={(ev) => onChange(column, ev.target.checked)}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export const ViewOptionTitle = ({children}) => (
  <Box color="#101828" fontWeight={400} fontSize={14} lineHeight="20px">
    {children}
  </Box>
);

const SearchButton = () => {
  const {
    open,
    anchorEl,
    loader,
    setLoader,
    inputValue,
    setInputValue,
    messages,
    messagesEndRef,
    handleClick,
    handleClose,
    handleKeyDown,
    handleSendClick,
    showInput,
    setShowInput,
    handleSuccess,
    handleError,
    onExited,
    appendMessage,
    selectedEntityType,
    handleChangeEntityType,
    setMessages,
    control,
    errors,
    handleSubmit,
    reset,
    setAnchorEl,
    setValue,
    watch,
  } = useAIChat();

  return (
    <>
      <Button
        h="30px"
        ml="auto"
        onClick={handleClick}
        variant="outline"
        colorScheme="gray"
        borderColor="#D0D5DD"
        color="#344054"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="8px"
        borderRadius="8px"
        fontSize="14px"
        fontWeight={500}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.8332 11.666L8.33321 9.16602M12.5085 2.91602V1.66602M15.7913 4.21657L16.6752 3.33268M15.7913 10.8327L16.6752 11.7166M9.17517 4.21657L8.29128 3.33268M17.0918 7.49935H18.3418M5.10935 17.3899L12.8071 9.69216C13.1371 9.36214 13.3021 9.19714 13.3639 9.00686C13.4183 8.83949 13.4183 8.6592 13.3639 8.49183C13.3021 8.30156 13.1371 8.13655 12.8071 7.80654L12.1927 7.19216C11.8627 6.86214 11.6977 6.69714 11.5074 6.63531C11.34 6.58093 11.1597 6.58093 10.9924 6.63531C10.8021 6.69714 10.6371 6.86214 10.3071 7.19216L2.60935 14.8899C2.27934 15.2199 2.11433 15.3849 2.0525 15.5752C1.99812 15.7425 1.99812 15.9228 2.0525 16.0902C2.11433 16.2805 2.27934 16.4455 2.60935 16.7755L3.22373 17.3899C3.55375 17.7199 3.71875 17.8849 3.90903 17.9467C4.0764 18.0011 4.25669 18.0011 4.42405 17.9467C4.61433 17.8849 4.77934 17.7199 5.10935 17.3899Z"
            stroke="#475467"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      <AIMenu
        open={open}
        anchorEl={anchorEl}
        loader={loader}
        setLoader={setLoader}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        messagesEndRef={messagesEndRef}
        handleClose={handleClose}
        handleKeyDown={handleKeyDown}
        handleSendClick={handleSendClick}
        showInput={showInput}
        setShowInput={setShowInput}
        handleSuccess={handleSuccess}
        handleError={handleError}
        onExited={onExited}
        appendMessage={appendMessage}
        selectedEntityType={selectedEntityType}
        handleChangeEntityType={handleChangeEntityType}
        setMessages={setMessages}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        watch={watch}
      />
    </>
  );
};

export const ViewOptionSubtitle = ({children}) => (
  <Box color="#667085" fontWeight={400} fontSize={14}>
    {children}
  </Box>
);
