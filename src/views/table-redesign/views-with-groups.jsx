import useTabRouter from "@/hooks/useTabRouter";
import {useFieldSearchUpdateMutation} from "@/services/constructorFieldService";
import constructorViewService from "@/services/constructorViewService";
import {filterActions} from "@/store/filter/filter.slice";
import {quickFiltersActions} from "@/store/filter/quick_filter";
import {mainActions} from "@/store/main/main.slice";
import {viewsActions} from "@/store/views/view.slice";
import chakraUITheme from "@/theme/chakraUITheme";
import {computedViewTypes} from "@/utils/constants/viewTypes";
import {
  getSearchText,
  openDB,
  saveOrUpdateSearchText,
} from "@/utils/indexedDb.jsx";
import {queryGenerator} from "@/utils/queryGenerator";
import ViewTypeList from "@/views/Objects/components/ViewTypeList";
import style from "@/views/Objects/style.module.scss";
import {getColumnIcon} from "@/views/table-redesign/icons";
import {
  ArrowBackIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
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
  Spinner,
  Switch,
} from "@chakra-ui/react";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {Backdrop, CircularProgress, Popover as MuiPopover} from "@mui/material";
import {addDays, endOfMonth, startOfMonth} from "date-fns";
import React, {
  Suspense,
  lazy,
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
import constructorFieldService from "../../services/constructorFieldService";
import constructorRelationService from "../../services/constructorRelationService";
import constructorTableService, {
  useTableByIdQuery,
} from "../../services/constructorTableService";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {detailDrawerActions} from "../../store/detailDrawer/detailDrawer.slice";
import {groupFieldActions} from "../../store/groupField/groupField.slice";
import {generateGUID} from "../../utils/generateID";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {listToMap} from "../../utils/listToMap";
import listToOptions from "../../utils/listToOptions";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";
import {Filter} from "./FilterGenerator";
import {LayoutPopup} from "./LayoutPopup";
import {ScreenOptions} from "./ScreenOptions";
import ViewSettingsModal from "./ViewSettings";
import {CalendarSettings} from "./components/CalendarSettings";
import {SubGroup} from "./components/SubGroup";
import {TimelineSettings} from "./components/TimelineSettings";
import {
  ColumnsVisibility,
  DeleteViewButton,
  ExcelExportButton,
  ExcelImportButton,
  FixColumns,
  Group,
  TabGroup,
} from "./components/ViewOptionElement";
import {FilterButton} from "./FilterButton";
import {updateObject} from "../Objects/AgGridTableView/Functions/AggridDefaultComponents";
import {VIEW_TYPES_MAP} from "../../utils/constants/viewTypes";

const WebsiteView = lazy(() => import("@/views/Objects/WebsiteView"));
const BoardView = lazy(() => import("../Objects/BoardView"));
const CalendarView = lazy(() => import("../Objects/CalendarView"));
const TimeLineView = lazy(() => import("../Objects/TimeLineView"));
const DrawerTableView = lazy(() => import("./drawer-table-view"));
const TableView = lazy(() => import("./table-view"));
const TableViewOld = lazy(() => import("./table-view-old"));
const AgGridTableView = lazy(() => import("@/views/Objects/AgGridTableView"));
const GroupTableView = lazy(
  () => import("@/views/Objects/TableView/GroupTableView")
);
const AggridTreeView = lazy(
  () => import("../Objects/AgGridTableView/AggridTreeView")
);
const DrawerFormDetailPage = lazy(
  () => import("../Objects/DrawerDetailPage/DrawerFormDetailPage")
);

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
  setLoading = () => {},
  refetchMenuViews = () => {},
  setSelectedTabIndex = () => {},
  onSubmit = () => {},
  setViews = () => {},
  refetchViews = () => {},
  setSelectedView = () => {},
  handleClose = () => {},
  setFullScreen = () => {},
  handleMouseDown = () => {},
  setSelectedViewType = () => {},
}) => {
  const location = useLocation();
  const {
    id,
    menuId: menuid,
    tableSlug: tableSlugFromProps,
    appId,
  } = useParams();
  const tableSlug = tableSlugFromProps || view?.table_slug;
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
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
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

  const projectId = useSelector((state) => state.auth.projectId);
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  const settingsForm = useForm({
    defaultValues: {
      calendar_from_slug: "",
      calendar_to_slug: "",
    },
  });

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
      navigate(url);
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
    if (savedSearch && savedSearch.searchText) {
      setSearchText(savedSearch.searchText);
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

  const handleViewClick = (view, index) => {
    viewHandler(view);
    setSelectedView(view);

    const isSection = view?.type === "SECTION";
    if (!new_router) {
      dispatch(viewsActions.setViewTab({tableSlug, tabIndex: index}));
      setSelectedTabIndex(index);
    } else {
      if (isSection) {
        dispatch(detailDrawerActions.setDrawerTabIndex(index));
        dispatch(groupFieldActions.trimViewsDataUntil(view));
        dispatch(groupFieldActions.trimViewsUntil(view));
        return;
      }

      if (relationView && !isSection) {
        dispatch(detailDrawerActions.setDrawerTabIndex(index));
        dispatch(
          groupFieldActions.addViewPath({
            ...view,
          })
        );
      } else {
        dispatch(detailDrawerActions.setMainTabIndex(index));
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

  const viewName =
    view?.attributes?.[`name_${i18n?.language}`] || view?.name || view.type;

  return (
    <>
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
                    handleClose();
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
                        onClick={() =>
                          navigate(`/${menuId}/customize/${tableInfo?.id}`, {
                            state: {
                              ...data,
                              tableSlug,
                            },
                          })
                        }
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

              <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                <Button
                  h="30px"
                  ml="auto"
                  onClick={navigateToSettingsPage}
                  variant="outline"
                  colorScheme="gray"
                  borderColor="#D0D5DD"
                  color="#344054"
                  leftIcon={<Image src="/img/settings.svg" alt="settings" />}
                  borderRadius="8px">
                  {generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Table Settings"
                  ) || "Table Settings"}
                </Button>
              </PermissionWrapperV2>
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

              <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                <Button
                  h="30px"
                  ml="auto"
                  onClick={navigateToSettingsPage}
                  variant="outline"
                  colorScheme="gray"
                  borderColor="#D0D5DD"
                  color="#344054"
                  leftIcon={<Image src="/img/settings.svg" alt="settings" />}
                  borderRadius="8px">
                  {generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Table Settings"
                  ) || "Table Settings"}
                </Button>
              </PermissionWrapperV2>
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
              w={"70%"}
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              overflow={"scroll"}>
              {(views ?? []).map((view, index) => (
                <Button
                  minW={"80px"}
                  key={view.id}
                  variant="ghost"
                  colorScheme="gray"
                  mx={"4px"}
                  leftIcon={
                    <SVG
                      src={`/img/${viewIcons[view.type]}`}
                      color={selectedTabIndex === index ? "#175CD3" : "#475467"}
                      width={18}
                      height={18}
                    />
                  }
                  fontSize={13}
                  h={"30px"}
                  fontWeight={500}
                  color={selectedTabIndex === index ? "#175CD3" : "#475467"}
                  bg={selectedTabIndex === index ? "#D1E9FF" : "#fff"}
                  _hover={
                    selectedTabIndex === index ? {bg: "#D1E9FF"} : undefined
                  }
                  onClick={() => handleViewClick(view, index)}>
                  {view?.is_relation_view
                    ? view?.table_label
                    : view?.attributes?.[`name_${i18n?.language}`] ||
                      view?.name ||
                      view.type}
                </Button>
              ))}
            </Flex>

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

            {view?.type === "FINANCE CALENDAR" && (
              <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
            )}

            <MuiPopover
              open={Boolean(viewAnchorEl)}
              anchorEl={viewAnchorEl}
              anchorPosition={{top: 200, left: 600}}
              onClose={() => {
                handleClosePop();
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}>
              <ViewTypeList
                tableRelations={tableRelations}
                relationView={relationView}
                view={view}
                fieldsMap={fieldsMap}
                tableSlug={tableSlug}
                views={views}
                refetchViews={refetchViews}
                computedViewTypes={computedViewTypes}
                handleClose={() => setViewAnchorEl(null)}
                openModal={(data) => {
                  setIsChanged(false);
                  setSettingsModalVisible(true);
                  setSelectedView(data);
                }}
              />
            </MuiPopover>

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
              <FilterPopover
                tableLan={tableLan}
                view={view}
                visibleColumns={visibleColumns}
                refetchViews={refetchViews}>
                <FilterButton view={view} />
              </FilterPopover>
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
                {" "}
                <PermissionWrapperV2 tableSlug={tableSlug} type="write">
                  <Button
                    h={"30px"}
                    rightIcon={<ChevronDownIcon fontSize={18} />}
                    onClick={() => navigateCreatePage()}>
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Create item"
                    ) || "Create item"}
                  </Button>
                </PermissionWrapperV2>
                <ViewOptions
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
                  }}
                  searchText={searchText}
                  computedVisibleFields={computedVisibleFields}
                  handleOpenPopup={handleOpenPopup}
                  queryClient={queryClient}
                  settingsForm={settingsForm}
                  views={views}
                />
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
                  <DrawerFormDetailPage
                    view={view}
                    modal={modal}
                    tableInfo={tableInfo}
                    navigateToEditPage={navigateToEditPage}
                    setLayoutType={setLayoutType}
                    layoutType={layoutType}
                    selectedViewType={selectedViewType}
                    setSelectedViewType={setSelectedViewType}
                    onSubmit={onSubmit}
                    rootForm={rootForm}
                    handleMouseDown={handleMouseDown}
                    layout={layout}
                    selectedTab={layout?.tabs?.[0]}
                    selectedTabIndex={selectedTabIndex}
                    menuItem={menuItem}
                    data={data}
                    selectedRow={row}
                    handleClose={handleClose}
                    dateInfo={dateInfo}
                    setFullScreen={setFullScreen}
                    fullScreen={fullScreen}
                    fieldsMap={fieldsMap}
                    projectInfo={projectInfo}
                  />
                </form>
              </Box>
            ) : (
              <>
                {!tabs?.length && (
                  <>
                    {view?.type === "WEBSITE" && <WebsiteView view={view} />}
                    {view?.type === "GRID" && groupTable?.length ? (
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
                      </Suspense>
                    ) : view.type === "TABLE" && groupTable?.length ? (
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
                      </Suspense>
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
                          setViews={() => {}}
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
                      setViews={setViews}
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
                    />
                  </Suspense>
                )}
                {!groupTable?.length &&
                  view.type !== "TIMELINE" &&
                  view.type !== "BOARD" &&
                  tabs?.map((tab) => (
                    <TabPanel key={tab.value}>
                      {view?.type === "GRID" ? (
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
                        </Suspense>
                      ) : view.type === "TREE" ? (
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
                        </Suspense>
                      ) : (
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
                          />
                        </Suspense>
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
                      </Suspense>
                    ) : view.type === "TREE" ? (
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
                      </Suspense>
                    ) : (
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
                        />
                      </Suspense>
                    )}
                  </>
                ) : null}
              </>
            )}
          </Tabs>
        </Flex>
      </ChakraProvider>
      <LayoutPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        authData={authInfo}
        control={mainForm.control}
        handleSubmit={mainForm.handleSubmit}
        tableLan={tableLan}
      />
    </>
  );
};

const FilterPopover = ({
  view,
  visibleColumns,
  refetchViews,
  children,
  tableLan,
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
}) => {
  const {tableSlug: tableSlugParam} = useParams();
  const tableSlug = tableSlugParam || view?.table_slug;
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
  }, []);

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
        refetchViews={refetchViews}>
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
}) => {
  const queryClient = useQueryClient();
  // const {tableSlug} = useParams();
  const tableSlug = view?.table_slug;
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const [queryParameters] = useSearchParams();

  const columnsIds = visibleColumns?.map((item) => item?.id);
  const quickFiltersIds = view?.attributes?.quick_filters?.map(
    (item) => item?.id
  );
  const checkedColumns =
    view?.attributes?.quick_filters?.filter((checkedField) =>
      columnsIds?.includes(checkedField?.id)
    ) ?? [];
  const unCheckedColumns =
    (view?.attributes?.quick_filters?.length === 0 ||
    view?.attributes?.quick_filters?.length === undefined
      ? visibleColumns
      : visibleColumns?.filter(
          (column) => !quickFiltersIds?.includes(column?.id)
        )) ?? [];

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column.label;

  const renderColumns = [
    ...checkedColumns.map((c) => ({...c, checked: true})),
    ...unCheckedColumns.map((c) => ({...c, checked: false})),
  ].filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

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
      {renderColumns.map((column) => (
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
            isChecked={column.is_checked}
            onChange={(ev) => onChange(column, ev.target.checked)}
          />
        </Flex>
      ))}
    </Flex>
  );
};

const ViewOptions = ({
  relationView = false,
  view,
  viewName,
  refetchViews,
  fieldsMap,
  visibleRelationColumns,
  searchText,
  checkedColumns,
  onDocsClick,
  computedVisibleFields,
  tableLan,
  handleOpenPopup,
  isChanged,
  selectedTabIndex,
  setIsChanged = () => {},
  settingsForm,
  views,
  projectId,
}) => {
  const navigate = useNavigate();
  const {menuId, appId, tableSlug: tableSlugFromProps} = useParams();
  const queryClient = useQueryClient();
  const tableSlug = relationView
    ? view?.relation_table_slug
    : (tableSlugFromProps ?? view?.table_slug);
  const {i18n, t} = useTranslation();
  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );

  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  const isTimelineView = view?.type === "TIMELINE";
  const isBoardView = view?.type === "BOARD";
  const isCalendarView = view?.type === "CALENDAR";

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  useEffect(() => {
    settingsForm.setValue(
      "calendar_from_slug",
      view?.attributes?.calendar_from_slug
    );
    settingsForm.setValue(
      "calendar_to_slug",
      view?.attributes?.calendar_to_slug
    );
    settingsForm.setValue("group_fields", view?.group_fields);
  }, [view]);

  const updateView = useMutation({
    mutationFn: async (value) => {
      await constructorViewService.update(tableSlug, {
        ...view,
        id: view.id,
        columns: view.columns,
        attributes: {...view?.attributes, [`name_${i18n?.language}`]: value},
      });
      if (relationView && viewsList?.length > 1) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      }
    },
  });

  const onViewNameChange = useDebounce((ev) => {
    updateView.mutate(ev.target.value);
  }, 500);

  const fixedColumnsCount = Object.values(
    view?.attributes?.fixedColumns || {}
  ).length;
  const groupByColumnsCount = view?.attributes?.group_by_columns?.length;
  const visibleColumnsCount = view?.columns?.length ?? 0;
  const tabGroupColumnsCount = view?.group_fields?.length;
  const visibleColumnsCountForTimeline =
    view?.attributes?.visible_field?.split("/")?.length ?? 0;

  const {
    data: {fields, visibleColumns} = {data: []},
    isLoading: tableInfoLoading,
    refetch: refetchGetTableInfo,
  } = useQuery(
    ["GET_TABLE_INFO", {tableSlug}],
    () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    {
      enabled: false,
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMap([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));

        return {
          fieldsMap,
          data,
          fields,
          visibleColumns: res?.data?.fields ?? [],
          visibleRelationColumns:
            res?.data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const computedColumns = useMemo(() => {
    const filteredFields = fields?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fields]);

  const saveSettings = () => {
    const computedData = {
      ...view,
      attributes: {
        ...view.attributes,
        calendar_from_slug: settingsForm.getValues("calendar_from_slug"),
        calendar_to_slug: settingsForm.getValues("calendar_to_slug"),
        // visible_field: settingsForm.getValues("visible_field"),
      },
    };

    constructorViewService
      .update(tableSlug, {
        ...computedData,
      })
      .then(() => {
        if (relationView && viewsList?.length > 1) {
          return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
        } else {
          return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
        }
      });
  };

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      if (
        Array.isArray(visibleRelationColumns) &&
        Array.isArray(visibleColumns)
      ) {
        return [...visibleColumns, ...visibleRelationColumns];
      } else {
        return [];
      }
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  const viewUpdateMutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const navigateToOldTemplate = () => {
    if (localStorage.getItem("new_router") === "true") {
      navigate(`/${menuId}/object/${tableSlug}/docs`);
    } else {
      navigate(`/main/${appId}/object/${tableSlug}/docs`);
    }
  };

  return (
    <Popover
      offset={[-145, 8]}
      onClose={() => setTimeout(() => setOpenedMenu(null), 250)}
      modifiers={[
        {
          name: "computeStyles",
          options: {
            gpuAcceleration: false,
            adaptive: false,
          },
        },
      ]}>
      <PopoverTrigger>
        <IconButton
          aria-label="more"
          icon={<Image src="/img/dots-vertical.svg" alt="more" />}
          variant="ghost"
          colorScheme="gray"
        />
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        w="320px"
        p={openedMenu === null ? "0px" : "8px"}>
        {openedMenu === null && (
          <>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              <Box color="#475467" fontSize={16} fontWeight={600}>
                {t("view_options")}
              </Box>
              <Flex mt="12px" columnGap="4px">
                <Flex
                  minW="32px"
                  h="26px"
                  borderRadius={6}
                  border="1px solid #D0D5DD"
                  alignItems="center"
                  justifyContent="center">
                  <SVG
                    src={`/img/${viewIcons[view.type]}`}
                    width={18}
                    height={18}
                  />
                </Flex>
                <InputGroup>
                  <Input
                    h="26px"
                    placeholder={t("view_name")}
                    defaultValue={viewName}
                    onChange={onViewNameChange}
                  />
                  {updateView.isLoading && (
                    <InputRightElement>
                      <Spinner color="#475467" />
                    </InputRightElement>
                  )}
                </InputGroup>
              </Flex>
              <Flex
                color="#475467"
                mt="4px"
                columnGap="4px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                as="span"
                onClick={handleOpenPopup}
                // to={`/settings/constructor/apps/${appId}/objects/${layoutQuery.data?.table_id}/${tableSlug}?menuId=${menuId}`}
              >
                <Flex
                  minW="36px"
                  h="28px"
                  alignItems="center"
                  justifyContent="center">
                  <SVG
                    src={`/img/${viewIcons[view.type]}`}
                    width={18}
                    height={18}
                  />
                </Flex>
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Layouts") ||
                    "Layout"}
                </ViewOptionTitle>
                <Flex ml="auto" columnGap="4px" alignItems="center">
                  <Box color="#667085" fontWeight={400} fontSize={14}>
                    {viewName}
                  </Box>
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>

              <ViewSettingsModal
                refetchViews={refetchViews}
                selectedTabIndex={selectedTabIndex}
                tableLan={tableLan}
                selectedView={view}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
              />
            </Box>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              {/* {(roleInfo === "DEFAULT ADMIN" || permissions?.columns) && ( */}
              <Flex
                p="8px"
                h="32px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                onClick={() => setOpenedMenu("columns-visibility")}>
                <Image src="/img/eye.svg" alt="Visibility" />
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Columns") ||
                    "Columns"}
                </ViewOptionTitle>
                <Flex ml="auto" alignItems="center" columnGap="8px">
                  {Boolean(
                    isTimelineView
                      ? visibleColumnsCountForTimeline
                      : visibleColumnsCount
                  ) &&
                    (isTimelineView
                      ? visibleColumnsCountForTimeline
                      : visibleColumnsCount) > 0 && (
                      <ViewOptionSubtitle>
                        {isTimelineView
                          ? visibleColumnsCountForTimeline
                          : visibleColumnsCount}{" "}
                        {t("shown")}
                      </ViewOptionSubtitle>
                    )}
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>
              {/* )} */}

              {(roleInfo === "DEFAULT ADMIN" || permissions?.group) &&
                view.type !== "BOARD" && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("group")}>
                    <Image src="/img/copy-01.svg" alt="Group by" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Group"
                      ) || "Group"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(groupByColumnsCount) && (
                        <ViewOptionSubtitle>
                          {groupByColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Group"
                          ) || "Group"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) &&
                !isTimelineView && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("tab-group")}>
                    <Image src="/img/browser.svg" alt="Group by" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        isBoardView ? "Group" : "Tab Group"
                      ) || "Tab Group"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(tabGroupColumnsCount) && (
                        <ViewOptionSubtitle>
                          {tabGroupColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Group"
                          ) || "Group"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(roleInfo === "DEFAULT ADMIN" || permissions?.group) &&
                view.type === "BOARD" && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("sub-group")}
                    color="#475467">
                    <HorizontalSplitOutlinedIcon color="inherit" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Sub group"
                      ) || "Sub group"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(tabGroupColumnsCount) && (
                        <ViewOptionSubtitle>
                          {fieldsMap?.[view?.attributes?.sub_group_by_id]
                            ?.label || "None"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(roleInfo === "DEFAULT ADMIN" || permissions?.fix_column) &&
                !isTimelineView &&
                !isBoardView && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("fix-column")}>
                    <Image src="/img/layout-left.svg" alt="Fix columns" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Fix columns"
                      ) || "Fix columns"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(fixedColumnsCount) && (
                        <ViewOptionSubtitle>
                          {fixedColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Fixed"
                          ) || "Fixed"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(isTimelineView || isCalendarView) && (
                <Flex
                  p="8px"
                  h="32px"
                  columnGap="8px"
                  alignItems="center"
                  borderRadius={6}
                  _hover={{bg: "#EAECF0"}}
                  cursor="pointer"
                  onClick={() =>
                    setOpenedMenu(
                      isTimelineView ? "timeline-settings" : "calendar-settings"
                    )
                  }>
                  <Image src="/img/settings.svg" alt="Settings" />
                  <ViewOptionTitle>
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Settings"
                    ) || "Settings"}
                  </ViewOptionTitle>
                  <Flex ml="auto">
                    <ChevronRightIcon fontSize={22} />
                  </Flex>
                </Flex>
              )}
            </Box>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              <Flex
                p="8px"
                h="32px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                onClick={(e) => {
                  onDocsClick(e);
                  projectId === "c7168030-b876-4d01-8063-f7ad9f92e974" &&
                    navigateToOldTemplate();
                }}>
                <Image src="/img/file-docs.svg" alt="Docs" />
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Docs") ||
                    "Docs"}
                </ViewOptionTitle>
                <ChevronRightIcon ml="auto" fontSize={22} />
              </Flex>
              <ExcelExportButton tableLan={tableLan} fieldsMap={fieldsMap} />
              <ExcelImportButton
                tableLan={tableLan}
                searchText={searchText}
                checkedColumns={checkedColumns}
                computedVisibleFields={computedVisibleFields}
              />
            </Box>
            <Box px="8px" py="4px">
              <DeleteViewButton
                relationView={relationView}
                view={view}
                refetchViews={refetchViews}
                tableLan={tableLan}
              />
            </Box>
          </>
        )}

        {openedMenu === "columns-visibility" && (
          <ColumnsVisibility
            relationView={relationView}
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
            settingsForm={settingsForm}
            columns={computedColumnsFor}
            queryClient={queryClient}
            refetchGetTableInfo={refetchGetTableInfo}
          />
        )}

        {openedMenu === "group" && (
          <Group
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}

        {openedMenu === "sub-group" && (
          <SubGroup
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
            title={"Sub Group"}
            viewUpdateMutation={viewUpdateMutation}
          />
        )}

        {openedMenu === "tab-group" && (
          <TabGroup
            relationView={relationView}
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            visibleRelationColumns={visibleRelationColumns}
            onBackClick={() => setOpenedMenu(null)}
            visibleColumns={visibleColumns}
            label={isBoardView ? "Group" : ""}
            isBoardView={isBoardView}
          />
        )}

        {openedMenu === "fix-column" && (
          <FixColumns
            relationView={relationView}
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}
        {openedMenu === "timeline-settings" && (
          <TimelineSettings
            relationView={relationView}
            tableSlug={tableSlug}
            control={settingsForm.control}
            computedColumns={computedColumns}
            onBackClick={() => setOpenedMenu(null)}
            saveSettings={saveSettings}
            title={
              generateLangaugeText(tableLan, i18n?.language, "Settings") ||
              "Settings"
            }
          />
        )}
        {openedMenu === "calendar-settings" && (
          <CalendarSettings
            tableSlug={tableSlug}
            columns={visibleColumns}
            onBackClick={() => setOpenedMenu(null)}
            selectedTabIndex={selectedTabIndex}
            views={views}
            initialValues={view}
            title={
              generateLangaugeText(tableLan, i18n?.language, "Settings") ||
              "Settings"
            }
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export const ViewOptionTitle = ({children}) => (
  <Box color="#475467" fontWeight={500} fontSize={14}>
    {children}
  </Box>
);

export const ViewOptionSubtitle = ({children}) => (
  <Box color="#667085" fontWeight={400} fontSize={14}>
    {children}
  </Box>
);
