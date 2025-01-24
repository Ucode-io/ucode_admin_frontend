import SettingsIcon from "@mui/icons-material/Settings";
import {Backdrop, Box as MuiBox, Button as MuiButton, Popover as MuiPopover,} from "@mui/material";
import {
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
  PopoverTrigger
} from "@chakra-ui/react";
import chakraUITheme from "@/theme/chakraUITheme";
import {endOfMonth, startOfMonth} from "date-fns";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CRangePickerNew from "../../components/DatePickers/CRangePickerNew";
import FiltersBlock from "../../components/FiltersBlock";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../components/TableCard";
import useDebounce from "../../hooks/useDebounce";
import useFilters from "../../hooks/useFilters";
import {useFieldSearchUpdateMutation} from "../../services/constructorFieldService";
import {tableSizeAction} from "../../store/tableSize/tableSizeSlice";
import {getSearchText, openDB, saveOrUpdateSearchText,} from "../../utils/indexedDb.jsx";
import {queryGenerator} from "../../utils/queryGenerator";
import AgGridTableView from "./AgGridTableView";
import ShareModal from "./ShareModal/ShareModal";
import TableView from "./TableView";
import GroupTableView from "./TableView/GroupTableView";
import TreeView from "./TreeView";
import WebsiteView from "./WebsiteView";
import ViewTabSelector from "./components/ViewTypeSelector";
import style from "./style.module.scss";
import {ArrowBackIcon, ChevronDownIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {useTranslation} from "react-i18next";
import SVG from "react-inlinesvg";
import {viewsActions} from "@/store/views/view.slice";
import ViewTypeList from "@/views/Objects/components/ViewTypeList";
import {computedViewTypes} from "@/utils/constants/viewTypes";
import SearchParams from "./components/ViewSettings/SearchParams";
import FastFilter from "@/views/Objects/components/FastFilter";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: 'grid.svg',
  TIMELINE: "line-chart-up.svg"
}

const ViewsWithGroups = ({
                           views,
                           selectedTabIndex,
                           setSelectedTabIndex,
                           view,
                           fieldsMap,
                           menuItem,
                           visibleRelationColumns,
                           visibleColumns,
                         }) => {
  const {tableSlug} = useParams();
  const queryClient = useQueryClient();
  const visibleForm = useForm();
  const dispatch = useDispatch();
  const {filters} = useFilters(tableSlug, view.id);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const filterCount = useSelector((state) => state.quick_filter.quick_filters);
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

  const [checkedColumns, setCheckedColumns] = useState([]);
  const [sortedDatas, setSortedDatas] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const groupTable = view?.attributes.group_by_columns;
  const [anchorElHeightControl, setAnchorElHeightControl] = useState(null);
  const [inputKey, setInputKey] = useState(0);
  const openHeightControl = Boolean(anchorElHeightControl);
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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseHeightControl = () => {
    setAnchorElHeightControl(null);
  };

  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const openSearch = Boolean(anchorElSearch);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
  };

  const tableHeightOptions = [
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Large",
      value: "large",
    },
  ];

  const {
    control,
    reset,
    setValue: setFormValue,
    getValues,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const {fields} = useFieldArray({
    control,
    name: "multi",
  });

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
  };

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

  useEffect(() => {
    initDB();
  }, [tableSlug]);

  useEffect(() => {
    selectAll();
  }, [view, fieldsMap]);

  if (view?.type === "WEBSITE") {
    return (
      <>
        <FiltersBlock
          extra={
            <>
              <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                <ShareModal/>
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
            <CRangePickerNew onChange={setDateFilters} value={dateFilters}/>
          )}
        </FiltersBlock>
        <WebsiteView view={view}/>
      </>
    )
  }

  if (view?.type === "GRID") {
    return (
      <MuiBox>
        <FiltersBlock
          extra={
            <>
              <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                <ShareModal/>
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
            <CRangePickerNew onChange={setDateFilters} value={dateFilters}/>
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
    )
  }

  const tableName = menuItem?.label ?? menuItem?.title;

  return (
    <ChakraProvider theme={chakraUITheme}>
      {updateLoading && (
        <Backdrop
          sx={{zIndex: (theme) => theme.zIndex.drawer + 999}}
          open={true}>
          <RingLoaderWithWrapper/>
        </Backdrop>
      )}

      <Flex h='56px' px='16px' alignItems='center' bg='#fff' borderBottom='1px solid #EAECF0' columnGap='4px'>
        <IconButton aria-label='back' icon={<ArrowBackIcon fontSize={20} color='#344054'/>} variant='ghost'
                    colorScheme='gray' onClick={() => navigate(-1)}/>
        <IconButton aria-label='home' icon={<img src="/img/home.svg" alt="home"/>} variant='ghost'
                    colorScheme='gray' onClick={() => navigate('/main')} ml='8px'/>
        <ChevronRightIcon fontSize={20} color='#344054'/>
        <Flex p='8px' bg='#EAECF0' borderRadius={6} color='#344054' fontWeight={500} alignItems='center'
              columnGap='8px'>
          <Flex w='20px' h='20px' bg='#EE46BC' borderRadius={4} columnGap={8} color='#fff' fontWeight={500}
                fontSize={12} justifyContent='center' alignItems='center'>
            {tableName?.[0]}
          </Flex>
          {tableName}
        </Flex>

        <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
          <Button h='36px' ml='auto' onClick={navigateToSettingsPage} variant="outline" colorScheme='gray'
                  borderColor='#D0D5DD' color='#344054' leftIcon={<Image src='/img/settings.svg' alt='settings'/>}
                  borderRadius='8px'>
            Table Settings
          </Button>
        </PermissionWrapperV2>
      </Flex>

      <Flex h='50px' px='16px' alignItems='center' bg='#fff' borderBottom='1px solid #EAECF0' columnGap='12px'>
        {(views ?? []).map((view, index) =>
          <Button
            key={view.id}
            variant='ghost'
            colorScheme='gray'
            leftIcon={<SVG
              src={`/img/${viewIcons[view.type]}`}
              color={selectedTabIndex === index ? "#175CD3" : '#475467'}
              width={20}
              height={20}
            />}
            fontSize={14}
            fontWeight={500}
            color={selectedTabIndex === index ? "#175CD3" : '#475467'}
            bg={selectedTabIndex === index ? "#D1E9FF" : "#fff"}
            _hover={selectedTabIndex === index ? {bg: "#D1E9FF"} : undefined}
            onClick={() => {
              dispatch(viewsActions.setViewTab({tableSlug, tabIndex: index}));
              setSelectedTabIndex(index);
            }}>
            {(view.attributes?.[`name_${i18n.language}`]
              ? view.attributes?.[`name_${i18n.language}`]
              : view.type) ?? view?.name}
          </Button>
        )}

        <PermissionWrapperV2 tableSlug={tableSlug} type="view_create">
          <Button leftIcon={<Image src='/img//plus-icon.svg' alt='Add'/>} variant='ghost' colorScheme='gray'
                  color='#475467' onClick={(ev) => setViewAnchorEl(ev.currentTarget)}>
            View
          </Button>
        </PermissionWrapperV2>

        {view?.type === "FINANCE CALENDAR" && (
          <CRangePickerNew onChange={setDateFilters} value={dateFilters}/>
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

        <Popover>
          <InputGroup ml='auto' w='320px'>
            <InputLeftElement>
              <Image src='/img/search-lg.svg' alt='search'/>
            </InputLeftElement>
            <Input id="search_input" defaultValue={searchText} placeholder="Search"
                   onChange={(ev) => inputChangeHandler(ev.target.value)}/>

            {(roleInfo === "DEFAULT ADMIN" || permissions?.search_button) &&
              <PopoverTrigger>
                <InputRightElement>
                  <IconButton
                    w='24px'
                    h='24px'
                    aria-label='more'
                    icon={<Image src='/img/dots-vertical.svg' alt='more'/>}
                    variant='ghost'
                    colorScheme='gray'
                    size='xs'
                  />
                </InputRightElement>
              </PopoverTrigger>
            }
          </InputGroup>

          <PopoverContent>
            <SearchParams
              checkedColumns={checkedColumns}
              setCheckedColumns={setCheckedColumns}
              columns={columnsForSearch}
              updateField={updateField}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>
            <IconButton aria-label='filter' icon={<Image src='/img/funnel.svg' alt='filter'/>} variant='ghost' colorScheme='gray' />
          </PopoverTrigger>
          <PopoverContent>
            <FastFilter
              view={view}
              fieldsMap={fieldsMap}
              isVertical
              selectedTabIndex={selectedTabIndex}
              visibleColumns={visibleColumns}
              visibleRelationColumns={visibleRelationColumns}
              visibleForm={visibleForm}
              setFilterVisible={setFilterVisible}
            />
          </PopoverContent>
        </Popover>
        <Button rightIcon={<ChevronDownIcon fontSize={20}/>}>
          Create item
        </Button>
        <IconButton aria-label='more' icon={<Image src='/img/dots-vertical.svg' alt='more'/>} variant='ghost'
                    colorScheme='gray' onClick={handleClick}/>
      </Flex>

      <Tabs direction={"ltr"} defaultIndex={0}>
        <TableCard type="withoutPadding">
          {tabs?.length > 0 && (
            <div className={style.tableCardHeader}>
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
        </TableCard>
      </Tabs>
    </ChakraProvider>
  );
};

export default ViewsWithGroups;
