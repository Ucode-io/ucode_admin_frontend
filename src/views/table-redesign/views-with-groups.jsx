import SettingsIcon from "@mui/icons-material/Settings";
import {
  Backdrop,
  Box as MuiBox,
  Button as MuiButton,
  Popover as MuiPopover,
} from "@mui/material";
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
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import chakraUITheme from "@/theme/chakraUITheme";
import {endOfMonth, startOfMonth} from "date-fns";
import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CRangePickerNew from "../../components/DatePickers/CRangePickerNew";
import FiltersBlock from "../../components/FiltersBlock";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import InlineSVG from "react-inlinesvg";
import useDebounce from "../../hooks/useDebounce";
import useFilters from "../../hooks/useFilters";
import {useFieldSearchUpdateMutation} from "@/services/constructorFieldService";
import {
  getSearchText,
  openDB,
  saveOrUpdateSearchText,
} from "@/utils/indexedDb.jsx";
import {queryGenerator} from "@/utils/queryGenerator";
import TableView from "./table-view";
import style from "@/views/Objects/style.module.scss";
import {
  ArrowBackIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {useTranslation} from "react-i18next";
import SVG from "react-inlinesvg";
import {viewsActions} from "@/store/views/view.slice";
import ViewTypeList from "@/views/Objects/components/ViewTypeList";
import {computedViewTypes} from "@/utils/constants/viewTypes";
import {filterActions} from "@/store/filter/filter.slice";
import {Filter} from "./FilterGenerator";
import constructorViewService from "@/services/constructorViewService";
import {quickFiltersActions} from "@/store/filter/quick_filter";
import useTabRouter from "@/hooks/useTabRouter";
import layoutService from "@/services/layoutService";
import ExcelUploadModal from "@/views/Objects/components/ExcelButtons/ExcelUploadModal";
import constructorObjectService from "@/services/constructorObjectService";
import useDownloader from "@/hooks/useDownloader";
import {getColumnIcon} from "@/views/table-redesign/icons";
import {Container, Draggable} from "react-smooth-dnd";
import {applyDrag} from "@/utils/applyDrag";
import {mainActions} from "@/store/main/main.slice";
import AgGridTableView from "@/views/Objects/AgGridTableView";
import ShareModal from "@/views/Objects/ShareModal/ShareModal";
import GroupTableView from "@/views/Objects/TableView/GroupTableView";
import TreeView from "@/views/Objects/TreeView";
import WebsiteView from "@/views/Objects/WebsiteView";
import ViewTabSelector from "@/views/Objects/components/ViewTypeSelector";
import {getAllFromDB} from "../../utils/languageDB";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {LayoutPopup} from "./LayoutPopup";
import {useTableByIdQuery} from "../../services/constructorTableService";
import {generateGUID} from "../../utils/generateID";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
};

export const NewUiViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap,
  menuItem,
  visibleRelationColumns,
  visibleColumns,
  refetchViews,
}) => {
  const {tableSlug, id} = useParams();
  const queryClient = useQueryClient();
  const visibleForm = useForm();
  const dispatch = useDispatch();
  const {filters} = useFilters(tableSlug, view.id);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const navigate = useNavigate();
  const {appId} = useParams();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [searchText, setSearchText] = useState("");
  const {i18n} = useTranslation();
  const [viewAnchorEl, setViewAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();
  const [tableLan, setTableLan] = useState();
  const [checkedColumns, setCheckedColumns] = useState([]);
  const [sortedDatas, setSortedDatas] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const groupTable = view?.attributes.group_by_columns;
  const [inputKey, setInputKey] = useState(0);

  const [isPopupOpen, setPopupOpen] = useState(false);

  const {navigateToForm} = useTabRouter();
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

  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);

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
      app_id: appId,
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
  const values = useWatch({
    control: mainForm?.control,
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

  const {data: tabs} = useQuery(queryGenerator(groupField, filters));

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table?.slug}?menuId=${menuItem?.id}`;
    navigate(url);
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

  useEffect(() => {
    initDB();
  }, [tableSlug]);

  useEffect(() => {
    selectAll();
  }, [view, fieldsMap]);

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setTableLan(formattedData?.find((item) => item?.key === "Table"));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (view?.type === "WEBSITE") {
    return (
      <>
        <FiltersBlock
          extra={
            <>
              <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                <ShareModal />
              </PermissionWrapperV2>

              <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                <MuiButton
                  variant="outlined"
                  onClick={navigateToSettingsPage}
                  style={{
                    borderColor: "#A8A8A8",
                    width: "35px",
                    height: "35px",
                    padding: "0px",
                    minWidth: "35px",
                  }}>
                  <SettingsIcon
                    style={{
                      color: "#A8A8A8",
                    }}
                  />
                </MuiButton>
              </PermissionWrapperV2>
            </>
          }>
          <ViewTabSelector
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={setSelectedTabIndex}
            views={views}
            settingsModalVisible={settingsModalVisible}
            setSettingsModalVisible={setSettingsModalVisible}
            isChanged={isChanged}
            setIsChanged={setIsChanged}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            menuItem={menuItem}
          />
          {view?.type === "FINANCE CALENDAR" && (
            <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
          )}
        </FiltersBlock>
        <WebsiteView view={view} />
      </>
    );
  }

  if (view?.type === "GRID") {
    return (
      <MuiBox>
        <FiltersBlock
          extra={
            <>
              <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                <ShareModal />
              </PermissionWrapperV2>

              <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                <MuiButton
                  variant="outlined"
                  onClick={navigateToSettingsPage}
                  style={{
                    borderColor: "#A8A8A8",
                    width: "35px",
                    height: "35px",
                    padding: "0px",
                    minWidth: "35px",
                  }}>
                  <SettingsIcon
                    style={{
                      color: "#A8A8A8",
                    }}
                  />
                </MuiButton>
              </PermissionWrapperV2>
            </>
          }>
          <ViewTabSelector
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={setSelectedTabIndex}
            views={views}
            settingsModalVisible={settingsModalVisible}
            setSettingsModalVisible={setSettingsModalVisible}
            isChanged={isChanged}
            setIsChanged={setIsChanged}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            menuItem={menuItem}
          />
          {view?.type === "FINANCE CALENDAR" && (
            <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
          )}
        </FiltersBlock>
        <AgGridTableView
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
        />
      </MuiBox>
    );
  }

  const tableName = menuItem?.label ?? menuItem?.title;
  // const viewName =
  //   (view.attributes?.[`name_${i18n.language}`]
  //     ? view.attributes?.[`name_${i18n.language}`]
  //     : view.type) ?? view?.name;
  const viewName = view?.attributes?.name_en || view?.name || view.type;

  return (
    <>
      <ChakraProvider theme={chakraUITheme}>
        <Flex h="100vh" flexDirection="column" bg={"white"}>
          {updateLoading && (
            <Backdrop
              sx={{zIndex: (theme) => theme.zIndex.drawer + 999}}
              open={true}>
              <RingLoaderWithWrapper />
            </Backdrop>
          )}

          <Flex
            minH="45px"
            h="36px"
            px="16px"
            alignItems="center"
            bg="#fff"
            borderBottom="1px solid #EAECF0"
            columnGap="8px">
            <IconButton
              aria-label="back"
              icon={<ArrowBackIcon fontSize={20} color="#344054" />}
              variant="ghost"
              colorScheme="gray"
              onClick={() => navigate(-1)}
              size="sm"
            />
            <IconButton
              aria-label="home"
              icon={<img src="/img/home.svg" alt="home" />}
              variant="ghost"
              colorScheme="gray"
              onClick={() => navigate("/main")}
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

          <Flex
            minH="40px"
            h="40px"
            px="16px"
            alignItems="center"
            bg="#fff"
            borderBottom="1px solid #EAECF0"
            columnGap="5px">
            {(views ?? []).map((view, index) => (
              <Button
                key={view.id}
                variant="ghost"
                colorScheme="gray"
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
                onClick={() => {
                  dispatch(
                    viewsActions.setViewTab({tableSlug, tabIndex: index})
                  );
                  setSelectedTabIndex(index);
                }}>
                {view?.attributes?.name_en || view?.name || view.type}
              </Button>
            ))}

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
              onClose={() => setViewAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}>
              <ViewTypeList
                views={views}
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
                    <ViewOptionTitle>{column.label}</ViewOptionTitle>
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

            <FilterPopover
              tableLan={tableLan}
              view={view}
              visibleColumns={visibleColumns}
              refetchViews={refetchViews}>
              <FilterButton view={view} />
            </FilterPopover>

            <PermissionWrapperV2 tableSlug={tableSlug} type="write">
              <Button
                h={"30px"}
                rightIcon={<ChevronDownIcon fontSize={18} />}
                onClick={() =>
                  navigateToForm(
                    tableSlug,
                    "CREATE",
                    {},
                    {id},
                    searchParams.get("menuId")
                  )
                }>
                {generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Create item"
                ) || "Create item"}
              </Button>
            </PermissionWrapperV2>

            <ViewOptions
              tableLan={tableLan}
              view={view}
              viewName={viewName}
              refetchViews={refetchViews}
              fieldsMap={fieldsMap}
              visibleRelationColumns={visibleRelationColumns}
              checkedColumns={checkedColumns}
              onDocsClick={() => setSelectedTabIndex(views.length)}
              searchText={searchText}
              computedVisibleFields={computedVisibleFields}
              handleOpenPopup={handleOpenPopup}
            />
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

          <Tabs direction={"ltr"} defaultIndex={0}>
            {tabs?.length > 0 && (
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
            {
              <>
                {!tabs?.length && (
                  <>
                    {view.type === "TABLE" && groupTable?.length ? (
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
                    ) : null}
                  </>
                )}
                {!groupTable?.length &&
                  tabs?.map((tab) => (
                    <TabPanel key={tab.value}>
                      {view.type === "TREE" ? (
                        <TreeView
                          tableSlug={tableSlug}
                          filters={filters}
                          view={view}
                          fieldsMap={fieldsMap}
                          tab={tab}
                        />
                      ) : (
                        <TableView
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
                      )}
                    </TabPanel>
                  ))}

                {!tabs?.length && !groupTable?.length ? (
                  <>
                    {view.type === "TREE" ? (
                      <TreeView
                        tableSlug={tableSlug}
                        filters={filters}
                        view={view}
                        fieldsMap={fieldsMap}
                      />
                    ) : (
                      <TableView
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
                    )}
                  </>
                ) : null}
              </>
            }
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

const FilterButton = forwardRef(({view, onClick, ...props}, ref) => {
  const tableViewFiltersOpen = useSelector(
    (state) => state.main.tableViewFiltersOpen
  );
  const dispatch = useDispatch();

  const handleClick = (ev) => {
    if (
      tableViewFiltersOpen ||
      (view?.attributes?.quick_filters?.length > 0 && !tableViewFiltersOpen)
    ) {
      ev.stopPropagation();
      return dispatch(
        mainActions.setTableViewFiltersOpen(!tableViewFiltersOpen)
      );
    }
    onClick(ev);
  };

  return (
    <Box position="relative">
      <IconButton
        ref={ref}
        aria-label="filter"
        icon={<Image src="/img/funnel.svg" alt="filter" />}
        variant="ghost"
        colorScheme="gray"
        onClick={handleClick}
        {...props}
      />
      {Boolean(view?.attributes?.quick_filters?.length) && (
        <Flex
          position="absolute"
          top="-8px"
          right="-4px"
          w="16px"
          h="16px"
          bg="#007AFF"
          alignItems="center"
          justifyContent="center"
          color="#fff"
          borderRadius="50%"
          fontSize="10px">
          {view?.attributes?.quick_filters?.length}
        </Flex>
      )}
    </Box>
  );
});

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
                "Search by filled name"
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
  const {tableSlug} = useParams();
  const {new_list} = useSelector((state) => state.filter);
  const [queryParameters] = useSearchParams();
  const filtersOpen = useSelector((state) => state.main.tableViewFiltersOpen);
  const {filters} = useFilters(tableSlug, view?.id);
  const dispatch = useDispatch();
  const {i18n} = useTranslation();

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

  if (!filtersOpen) {
    return;
  }

  return (
    <Flex
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

const FiltersSwitch = ({view, visibleColumns, refetchViews, search}) => {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const dispatch = useDispatch();

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
      return await refetchViews();
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
            isChecked={column.checked}
            onChange={(ev) => onChange(column, ev.target.checked)}
          />
        </Flex>
      ))}
    </Flex>
  );
};

const ViewOptions = ({
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
}) => {
  const {appId, tableSlug} = useParams();
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );
  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);
  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  const layoutQuery = useQuery({
    queryKey: ["GET_LAYOUT", {tableSlug}],
    queryFn: () => layoutService.getLayout(tableSlug, appId),
  });

  const updateView = useMutation({
    mutationFn: async (value) => {
      await constructorViewService.update(tableSlug, {
        ...view,
        id: view.id,
        columns: view.columns,
        attributes: {name_en: value},
      });
      return await refetchViews();
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
                {generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "View options"
                ) || "View options"}
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
                    placeholder="View name"
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
                  {generateLangaugeText(tableLan, i18n?.language, "Layout") ||
                    "Layout"}
                </ViewOptionTitle>
                <Flex ml="auto" columnGap="4px" alignItems="center">
                  <Box color="#667085" fontWeight={400} fontSize={14}>
                    {viewName}
                  </Box>
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>
            </Box>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              {(roleInfo === "DEFAULT ADMIN" || permissions?.columns) && (
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
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Columns"
                    ) || "Columns"}
                  </ViewOptionTitle>
                  <Flex ml="auto" alignItems="center" columnGap="8px">
                    {Boolean(visibleColumnsCount) &&
                      visibleColumnsCount > 0 && (
                        <ViewOptionSubtitle>
                          {visibleColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Shown"
                          ) || "Shown"}
                        </ViewOptionSubtitle>
                      )}
                    <ChevronRightIcon fontSize={22} />
                  </Flex>
                </Flex>
              )}

              {(roleInfo === "DEFAULT ADMIN" || permissions?.group) && (
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
                    {generateLangaugeText(tableLan, i18n?.language, "Group") ||
                      "Group"}
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
              {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) && (
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
                      "Tab Group"
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
              {(roleInfo === "DEFAULT ADMIN" || permissions?.fix_column) && (
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
                      "Fix Column"
                    ) || "Fix Column"}
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
                onClick={onDocsClick}>
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
                view={view}
                refetchViews={refetchViews}
                tableLan={tableLan}
              />
            </Box>
          </>
        )}

        {openedMenu === "columns-visibility" && (
          <ColumnsVisibility
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}

        {openedMenu === "group" && (
          <Group
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}

        {openedMenu === "tab-group" && (
          <TabGroup
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            visibleRelationColumns={visibleRelationColumns}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}

        {openedMenu === "fix-column" && (
          <FixColumns
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

const ColumnsVisibility = ({
  view,
  fieldsMap,
  refetchViews,
  onBackClick,
  tableLan,
}) => {
  const {i18n} = useTranslation();
  const {tableSlug} = useParams();
  const [search, setSearch] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const allFields = Object.values(fieldsMap);
  const visibleFields =
    view?.columns
      ?.map((id) => fieldsMap[id])
      .filter((el) => {
        return el?.type === "LOOKUP" || el?.type === "LOOKUPS"
          ? el?.relation_id
          : el?.id;
      }) ?? [];
  const invisibleFields =
    allFields.filter((field) => {
      return !view?.columns?.includes(
        field?.type === "LOOKUP" || field?.type === "LOOKUPS"
          ? field.relation_id
          : field.id
      );
    }) ?? [];

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const allColumns = [...visibleFields, ...invisibleFields];
  const renderFields = allColumns.filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    const columns = view?.columns ?? [];
    const id =
      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
        ? column.relation_id
        : column.id;

    mutation.mutate({
      ...view,
      columns: checked ? [...columns, id] : columns.filter((c) => c !== id),
    });
  };

  const onShowAllChange = (checked) => {
    mutation.mutate({
      ...view,
      columns: checked
        ? renderFields.map((column) =>
            column?.type === "LOOKUP" || column?.type === "LOOKUPS"
              ? column.relation_id
              : column.id
          )
        : [],
    });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(visibleFields, dropResult);
    const computedResult = result?.filter((item) => {
      return item?.type === "LOOKUP" || item?.type === "LOOKUPS"
        ? item?.relation_id
        : item?.id;
    });

    if (computedResult) {
      mutation.mutate({
        ...view,
        columns: computedResult?.map((item) =>
          item?.type === "LOOKUP" || item?.type === "LOOKUPS"
            ? item?.relation_id
            : item?.id
        ),
      });
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          rightIcon={
            mutation.isLoading ? <Spinner color="#475467" /> : undefined
          }
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}>
          <Box color="#475467" fontSize={16} fontWeight={600}>
            {generateLangaugeText(
              tableLan,
              i18n?.language,
              "Visible columns"
            ) || "Visible columns"}
          </Box>
        </Button>

        <Flex as="label" alignItems="center" columnGap="4px" cursor="pointer">
          <Switch
            isChecked={allColumns?.length === visibleFields?.length}
            onChange={(ev) => onShowAllChange(ev.target.checked)}
          />
          {generateLangaugeText(tableLan, i18n?.language, "Show all") ||
            "Show all"}
        </Flex>
      </Flex>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Search by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        <Container onDrop={onDrop}>
          {renderFields.map((column) => (
            <Draggable key={column.id}>
              <Flex
                as="label"
                p="8px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                bg="#fff"
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                zIndex={999999}>
                {column?.type && getColumnIcon({column})}
                <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
                <Switch
                  ml="auto"
                  onChange={(ev) => onChange(column, ev.target.checked)}
                  isChecked={view?.columns?.includes(
                    column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                      ? column?.relation_id
                      : column?.id
                  )}
                />
              </Flex>
            </Draggable>
          ))}
        </Container>
      </Flex>
    </Box>
  );
};

const Group = ({view, fieldsMap, refetchViews, onBackClick, tableLan}) => {
  const {i18n} = useTranslation();
  const {tableSlug} = useParams();
  const [search, setSearch] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const allFields = Object.values(fieldsMap);
  const visibleFields =
    view?.attributes?.group_by_columns?.map((id) => fieldsMap[id]) ?? [];
  const invisibleFields = allFields.filter((field) => {
    return !view?.attributes?.group_by_columns?.includes(
      field?.type === "LOOKUP" || field?.type === "LOOKUPS"
        ? field.relation_id
        : field.id
    );
  });

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const renderFields = [...visibleFields, ...invisibleFields].filter(
    (column) =>
      search === ""
        ? true
        : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    const columns = view?.attributes?.group_by_columns ?? [];
    const id =
      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
        ? column.relation_id
        : column.id;

    mutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        group_by_columns: checked
          ? [...columns, id]
          : columns.filter((c) => c !== id),
      },
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={mutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Group columns") ||
            "Group columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Search by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {renderFields.map((column) => (
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
            <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
            <Switch
              ml="auto"
              onChange={(ev) => onChange(column, ev.target.checked)}
              isChecked={view?.attributes?.group_by_columns?.includes(
                column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                  ? column?.relation_id
                  : column?.id
              )}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

const TabGroup = ({
  view,
  fieldsMap,
  refetchViews,
  visibleRelationColumns,
  onBackClick,
  tableLan,
}) => {
  const {i18n} = useTranslation();
  const {tableSlug} = useParams();
  const [search, setSearch] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const computedColumns =
    view?.type !== "CALENDAR" && view?.type !== "GANTT"
      ? Object.values(fieldsMap)
      : [...Object.values(fieldsMap), ...visibleRelationColumns];
  const columns = (computedColumns ?? []).filter((column) =>
    ["LOOKUP", "PICK_LIST", "LOOKUPS", "MULTISELECT"].includes(column.type)
  );

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const renderFields = columns.filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    mutation.mutate({
      ...view,
      group_fields: checked
        ? [
            column?.type === "LOOKUP" || column?.type === "LOOKUPS"
              ? column?.relation_id
              : column?.id,
          ]
        : [],
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={mutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(
            tableLan,
            i18n?.language,
            "Tab group columns"
          ) || "Tab group columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Search by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {renderFields.map((column) => (
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
            <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
            <Switch
              ml="auto"
              onChange={(ev) => onChange(column, ev.target.checked)}
              isChecked={(view?.group_fields ?? []).includes(
                column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                  ? column?.relation_id
                  : column?.id
              )}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

const FixColumns = ({view, fieldsMap, refetchViews, onBackClick, tableLan}) => {
  const {tableSlug} = useParams();
  const [search, setSearch] = useState("");
  const {i18n} = useTranslation();

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const checkedElements = Object.values(fieldsMap)
    .filter((column) => {
      return view?.columns?.find((el) => el === column?.id);
    })
    ?.filter((column) =>
      Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
    );

  const uncheckedElements = Object.values(fieldsMap)
    .filter((column) => {
      return view?.columns?.find((el) => el === column?.id);
    })
    ?.filter(
      (column) =>
        !Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
    );

  const columns = [...checkedElements, ...uncheckedElements].filter((column) =>
    search === ""
      ? true
      : column?.label?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    let fixed = [...Object.keys(view?.attributes?.fixedColumns ?? {})];
    if (checked) {
      fixed.push(column.id);
    } else {
      fixed = fixed.filter((el) => el !== column.id);
    }
    mutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        fixedColumns: Object.fromEntries(fixed.map((key) => [key, true])),
      },
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={mutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Fix columns") ||
            "Fix columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Search by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {columns.map((column) => (
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
            <ViewOptionTitle>{column?.label}</ViewOptionTitle>
            <Switch
              ml="auto"
              isChecked={Boolean(
                Object.keys(view?.attributes?.fixedColumns ?? {})?.find(
                  (el) => el === column.id
                )
              )}
              onChange={(ev) => onChange(column, ev.target.checked)}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

const ExcelExportButton = ({fieldsMap, tableLan}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {i18n} = useTranslation();
  return (
    <>
      <Flex
        p="8px"
        h="32px"
        columnGap="8px"
        alignItems="center"
        borderRadius={6}
        _hover={{bg: "#EAECF0"}}
        cursor="pointer"
        onClick={onOpen}>
        <Image src="/img/file-download.svg" alt="Docs" />
        <ViewOptionTitle>
          {generateLangaugeText(tableLan, i18n?.language, "Import") || "Import"}
        </ViewOptionTitle>
        <ChevronRightIcon ml="auto" fontSize={22} />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent zIndex={2} minW="602px" w="602px">
          <ExcelUploadModal fieldsMap={fieldsMap} handleClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};

const ExcelImportButton = ({
  searchText,
  checkedColumns,
  computedVisibleFields,
  tableLan,
}) => {
  const {tableSlug} = useParams();
  const {download} = useDownloader();
  const {i18n} = useTranslation();

  const mutation = useMutation({
    mutationFn: async () => {
      const {data} = await constructorObjectService.downloadExcel(tableSlug, {
        data: {
          field_ids: computedVisibleFields,
          language: i18n.language,
          search: searchText,
          view_fields: checkedColumns,
        },
      });
      return await download({
        fileName: `${tableSlug}.xlsx`,
        link: "https://" + data.link,
      });
    },
  });

  return (
    <Flex
      p="8px"
      h="32px"
      columnGap="8px"
      alignItems="center"
      borderRadius={6}
      _hover={{bg: "#EAECF0"}}
      cursor="pointer"
      onClick={mutation.mutate}>
      {mutation.isLoading ? (
        <Spinner w="20px" h="20px" />
      ) : (
        <Image src="/img/file-download.svg" alt="Docs" />
      )}
      <ViewOptionTitle>
        {generateLangaugeText(tableLan, i18n?.language, "Export") || "Export"}
      </ViewOptionTitle>
      <ChevronRightIcon ml="auto" fontSize={22} />
    </Flex>
  );
};

const DeleteViewButton = ({view, refetchViews, tableLan}) => {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const mutation = useMutation({
    mutationFn: () => constructorViewService.delete(view.id, tableSlug),
    onSuccess: () => refetchViews(),
  });

  return (
    <Flex
      p="8px"
      h="32px"
      columnGap="8px"
      alignItems="center"
      borderRadius={6}
      _hover={{bg: "#EAECF0"}}
      cursor="pointer"
      onClick={() => mutation.mutate()}>
      {mutation.isLoading ? (
        <Spinner w="20px" h="20px" />
      ) : (
        <Image src="/img/trash.svg" alt="Delete" />
      )}
      <ViewOptionTitle>
        {generateLangaugeText(tableLan, i18n?.language, "Delete") || "Delete"}
      </ViewOptionTitle>
    </Flex>
  );
};

const ViewOptionTitle = ({children}) => (
  <Box color="#475467" fontWeight={500} fontSize={14}>
    {children}
  </Box>
);

const ViewOptionSubtitle = ({children}) => (
  <Box color="#667085" fontWeight={400} fontSize={14}>
    {children}
  </Box>
);
