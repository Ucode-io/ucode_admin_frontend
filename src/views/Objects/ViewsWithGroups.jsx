import {Description, MoreVertOutlined} from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Backdrop,
  Badge,
  Box,
  Button,
  Divider,
  Menu,
  Switch,
} from "@mui/material";
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
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import useDebounce from "../../hooks/useDebounce";
import useFilters from "../../hooks/useFilters";
import {useFieldSearchUpdateMutation} from "../../services/constructorFieldService";
import {tableSizeAction} from "../../store/tableSize/tableSizeSlice";
import {
  getSearchText,
  openDB,
  saveOrUpdateSearchText,
} from "../../utils/indexedDb.jsx";
import {queryGenerator} from "../../utils/queryGenerator";
import AgGridTableView from "./AgGridTableView";
import GroupByButton from "./GroupByButton";
import ShareModal from "./ShareModal/ShareModal";
import TableView from "./TableView";
import GroupTableView from "./TableView/GroupTableView";
import TableViewGroupByButton from "./TableViewGroupByButton";
import TreeView from "./TreeView";
import VisibleColumnsButton from "./VisibleColumnsButton";
import WebsiteView from "./WebsiteView";
import ExcelButtons from "./components/ExcelButtons";
import FixColumnsTableView from "./components/FixColumnsTableView";
import SearchParams from "./components/ViewSettings/SearchParams";
import ViewTabSelector from "./components/ViewTypeSelector";
import style from "./style.module.scss";
import {mergeStringAndState} from "../../utils/jsonPath";
import useTabRouter from "../../hooks/useTabRouter";
import TimeLineView from "./TimeLineView/index.jsx";
import {generateGUID} from "../../utils/generateID";
import {ExtraNavbar} from "./components/ExtraNavbar/ExtraNavbar.jsx";
import {useGetLang} from "../../hooks/useGetLang.js";

const ViewsWithGroups = ({
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
  const {navigateToForm} = useTabRouter();
  const {appId} = useParams();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [layoutType, setLayoutType] = useState("SimpleLayout");

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

  const tableLan = useGetLang("Table");

  const paginiationCount = useMemo(() => {
    const getObject = paginationCount.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageCount ?? 1;
  }, [paginationCount, tableSlug]);

  const [currentPage, setCurrentPage] = useState(paginiationCount);

  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);

  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lte: endOfMonth(new Date()),
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
  console.log({checkedColumns});
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

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;
      let query = urlTemplate;

      const variablePattern = /\{\{\$\.(.*?)\}\}/g;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`, {
        state: {
          roleInfo: roleInfo,
        },
      });
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  const navigateToEditPage = (row) => {
    if (layoutType === "PopupLayout") {
      setOpen(true);
    } else {
      navigateToDetailPage(row);
    }
  };

  useEffect(() => {
    initDB();
  }, [tableSlug]);

  useEffect(() => {
    selectAll();
  }, [view, fieldsMap]);

  return (
    <>
      {view?.type === "WEBSITE" ? (
        <>
          <FiltersBlock
            extra={
              <>
                <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                  <ShareModal />
                </PermissionWrapperV2>

                <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                  <Button
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
                  </Button>
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
      ) : view?.type === "GRID" ? (
        <Box>
          <FiltersBlock
            extra={
              <>
                <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                  <ShareModal />
                </PermissionWrapperV2>

                <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                  <Button
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
                  </Button>
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
          <ExtraNavbar
            filterCount={filterCount}
            setFilterVisible={setFilterVisible}
            inputChangeHandler={inputChangeHandler}
            handleClickSearch={handleClickSearch}
            inputKey={inputKey}
            searchText={searchText}
            openSearch={openSearch}
            anchorElSearch={anchorElSearch}
            handleCloseSearch={handleCloseSearch}
            roleInfo={roleInfo}
            permissions={permissions}
            checkedColumns={checkedColumns}
            setCheckedColumns={setCheckedColumns}
            columnsForSearch={columnsForSearch}
            updateField={updateField}
            view={view}
            fieldsMap={fieldsMap}
            selectedTabIndex={selectedTabIndex}
            visibleRelationColumns={visibleRelationColumns}
            openHeightControl={openHeightControl}
            handleCloseHeightControl={handleCloseHeightControl}
            anchorElHeightControl={anchorElHeightControl}
            tableHeightOptions={tableHeightOptions}
            handleHeightControl={handleHeightControl}
            handleClick={handleClick}
            open={open}
            handleClose={handleClose}
            anchorEl={anchorEl}
            computedVisibleFields={computedVisibleFields}
            setSelectedTabIndex={setSelectedTabIndex}
            views={views}
            tableHeight={tableHeight}
            tableSlug={tableSlug}
            isRelationTable={false}
            navigateToForm={navigateToForm}
          />
          <AgGridTableView
            navigateToEditPage={navigateToEditPage}
            selectedTabIndex={selectedTabIndex}
            view={view}
            mainForm={mainForm}
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
            setLayoutType={setLayoutType}
            searchText={searchText}
            layoutType={layoutType}
            viewFields={visibleColumns}
            setFilterVisible={setFilterVisible}
            filterVisible={filterVisible}
          />
        </Box>
      ) : (
        <Box>
          {updateLoading && (
            <Backdrop
              sx={{zIndex: (theme) => theme.zIndex.drawer + 999}}
              open={true}>
              <RingLoaderWithWrapper />
            </Backdrop>
          )}
          <FiltersBlock
            extra={
              <>
                <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
                  <ShareModal />
                </PermissionWrapperV2>

                <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
                  <Button
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
                  </Button>
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

          {view?.type !== "TIMELINE" && (
            <ExtraNavbar
              filterCount={filterCount}
              setFilterVisible={setFilterVisible}
              inputChangeHandler={inputChangeHandler}
              handleClickSearch={handleClickSearch}
              inputKey={inputKey}
              searchText={searchText}
              openSearch={openSearch}
              anchorElSearch={anchorElSearch}
              handleCloseSearch={handleCloseSearch}
              roleInfo={roleInfo}
              permissions={permissions}
              checkedColumns={checkedColumns}
              setCheckedColumns={setCheckedColumns}
              columnsForSearch={columnsForSearch}
              updateField={updateField}
              view={view}
              fieldsMap={fieldsMap}
              selectedTabIndex={selectedTabIndex}
              visibleRelationColumns={visibleRelationColumns}
              openHeightControl={openHeightControl}
              handleCloseHeightControl={handleCloseHeightControl}
              anchorElHeightControl={anchorElHeightControl}
              tableHeightOptions={tableHeightOptions}
              handleHeightControl={handleHeightControl}
              handleClick={handleClick}
              open={open}
              handleClose={handleClose}
              anchorEl={anchorEl}
              computedVisibleFields={computedVisibleFields}
              setSelectedTabIndex={setSelectedTabIndex}
              views={views}
              tableHeight={tableHeight}
            />
          )}

          {/* {view?.type !== "TIMELINE" && (
            <div
              className={style.extraNavbar}
              style={{
                minHeight: "42px",
              }}
            >
              <div className={style.extraWrapper}>
                <div className={style.search}>
                  <Badge
                    sx={{
                      width: "35px",
                      paddingLeft: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setFilterVisible((prev) => !prev);
                    }}
                    badgeContent={filterCount}
                    color="primary"
                  >
                    <FilterAltOutlinedIcon color={"#A8A8A8"} />
                  </Badge>

                  <Divider orientation="vertical" flexItem />
                  <SearchInput
                    key={inputKey}
                    defaultValue={searchText}
                    placeholder={"Search"}
                    onChange={(e) => {
                      inputChangeHandler(e);
                    }}
                  />
                  {(roleInfo === "DEFAULT ADMIN" ||
                    permissions?.search_button) && (
                    <button
                      className={style.moreButton}
                      onClick={handleClickSearch}
                      style={{
                        paddingRight: "10px",
                      }}
                    >
                      <MoreHorizIcon />
                    </button>
                  )}

                  <Menu
                    open={openSearch}
                    onClose={handleCloseSearch}
                    anchorEl={anchorElSearch}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          // width: 100,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <SearchParams
                      checkedColumns={checkedColumns}
                      setCheckedColumns={setCheckedColumns}
                      columns={columnsForSearch}
                      updateField={updateField}
                    />
                  </Menu>
                </div>

                <div className={style.rightExtra}>
                  {(roleInfo === "DEFAULT ADMIN" ||
                    permissions?.fix_column) && (
                    <FixColumnsTableView view={view} fieldsMap={fieldsMap} />
                  )}
                  <Divider orientation="vertical" flexItem />
                  {(roleInfo === "DEFAULT ADMIN" || permissions?.group) && (
                    <GroupByButton
                      selectedTabIndex={selectedTabIndex}
                      view={view}
                      fieldsMap={fieldsMap}
                      relationColumns={visibleRelationColumns}
                    />
                  )}
                  <Divider orientation="vertical" flexItem />
                  {(roleInfo === "DEFAULT ADMIN" || permissions?.columns) && (
                    <VisibleColumnsButton
                      currentView={view}
                      fieldsMap={fieldsMap}
                    />
                  )}
                  <Divider orientation="vertical" flexItem />
                  {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) && (
                    <TableViewGroupByButton
                      currentView={view}
                      fieldsMap={fieldsMap}
                    />
                  )}
                  {view.type === "TABLE" && (
                    <>
                      <Menu
                        open={openHeightControl}
                        onClose={handleCloseHeightControl}
                        anchorEl={anchorElHeightControl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              // width: 100,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&:before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        }}
                      >
                        <div className={style.menuBar}>
                          {tableHeightOptions.map((el) => (
                            <div
                              className={style.template}
                              onClick={() => handleHeightControl(el.value)}
                            >
                              <span>{el.label}</span>

                              <Switch
                                size="small"
                                checked={tableHeight === el.value}
                                onChange={() => handleHeightControl(el.value)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </Menu>
                    </>
                  )}
                  <Divider orientation="vertical" flexItem />
                  {permissions?.excel_menu && (
                    <Button
                      onClick={handleClick}
                      variant="text"
                      style={{
                        color: "#A8A8A8",
                        borderColor: "#A8A8A8",
                        minWidth: "auto",
                      }}
                    >
                      <MoreVertOutlined
                        style={{
                          color: "#888",
                        }}
                      />
                    </Button>
                  )}

                  <Menu
                    open={open}
                    onClose={handleClose}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          // width: 100,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <div className={style.menuBar}>
                      <ExcelButtons
                        computedVisibleFields={computedVisibleFields}
                        fieldsMap={fieldsMap}
                        view={view}
                        searchText={searchText}
                        checkedColumns={checkedColumns}
                      />
                      <div
                        className={style.template}
                        onClick={() => setSelectedTabIndex(views?.length)}
                      >
                        <div
                          className={`${style.element} ${
                            selectedTabIndex === views?.length
                              ? style.active
                              : ""
                          }`}
                        >
                          <Description
                            className={style.icon}
                            style={{ color: "#6E8BB7" }}
                          />
                        </div>
                        <span>Template</span>
                      </div>
                    </div>
                  </Menu>
                </div>
              </div>
            </div>
          )} */}

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
                  {view?.type === "TIMELINE" && (
                    <TimeLineView
                      view={view}
                      // selectedTable={selectedTable}
                      setViews={() => {}}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                      isViewLoading={false}
                      setLayoutType={setLayoutType}
                    />
                  )}
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
                            navigateToEditPage={navigateToEditPage}
                            setLayoutType={setLayoutType}
                            layoutType={layoutType}
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
                          navigateToEditPage={navigateToEditPage}
                          setLayoutType={setLayoutType}
                          layoutType={layoutType}
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
        </Box>
      )}
    </>
  );
};

export default ViewsWithGroups;
