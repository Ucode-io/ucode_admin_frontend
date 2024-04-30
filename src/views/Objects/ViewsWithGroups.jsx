import {Description, MoreVertOutlined} from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import {Backdrop, Badge, Button, Divider, Menu, Switch} from "@mui/material";
import {endOfMonth, startOfMonth} from "date-fns";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CRangePickerNew from "../../components/DatePickers/CRangePickerNew";
import FiltersBlock from "../../components/FiltersBlock";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import useFilters from "../../hooks/useFilters";
import constructorObjectService from "../../services/constructorObjectService";
import {tableSizeAction} from "../../store/tableSize/tableSizeSlice";
import {getRelationFieldTabsLabel} from "../../utils/getRelationFieldLabel";
import GroupByButton from "./GroupByButton";
import ShareModal from "./ShareModal/ShareModal";
import TableView from "./TableView";
import GroupTableView from "./TableView/GroupTableView";
import TableViewGroupByButton from "./TableViewGroupByButton";
import TreeView from "./TreeView";
import VisibleColumnsButton from "./VisibleColumnsButton";
import ExcelButtons from "./components/ExcelButtons";
import FixColumnsTableView from "./components/FixColumnsTableView";
import SearchParams from "./components/ViewSettings/SearchParams";
import ViewTabSelector from "./components/ViewTypeSelector";
import style from "./style.module.scss";
import {useFieldSearchUpdateMutation} from "../../services/constructorFieldService";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";

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
  const [checkedColumns, setCheckedColumns] = useState([]);
  const [sortedDatas, setSortedDatas] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const groupTable = view?.attributes.group_by_columns;
  const [anchorElHeightControl, setAnchorElHeightControl] = useState(null);
  const openHeightControl = Boolean(anchorElHeightControl);

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

  const selectAll = () => {
    setCheckedColumns(
      columnsForSearch
        .filter((item) => item.is_search === true)
        .map((item) => item.slug)
    );
  };

  useEffect(() => {
    selectAll();
  }, [view, fieldsMap]);

  return (
    <>
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

      <div
        className={style.extraNavbar}
        style={{
          minHeight: "42px",
        }}>
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
              color="primary">
              <FilterAltOutlinedIcon color={"#A8A8A8"} />
            </Badge>

            <Divider orientation="vertical" flexItem />
            <SearchInput
              placeholder={"Search"}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchText(e);
              }}
            />
            <button
              className={style.moreButton}
              onClick={handleClickSearch}
              style={{
                paddingRight: "10px",
              }}>
              <MoreHorizIcon />
            </button>

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
              }}>
              <SearchParams
                checkedColumns={checkedColumns}
                setCheckedColumns={setCheckedColumns}
                columns={columnsForSearch}
                updateField={updateField}
              />
            </Menu>
          </div>

          <div className={style.rightExtra}>
            <FixColumnsTableView view={view} fieldsMap={fieldsMap} />
            <Divider orientation="vertical" flexItem />
            <GroupByButton
              selectedTabIndex={selectedTabIndex}
              view={view}
              fieldsMap={fieldsMap}
              relationColumns={visibleRelationColumns}
            />
            <Divider orientation="vertical" flexItem />
            <VisibleColumnsButton currentView={view} fieldsMap={fieldsMap} />
            <Divider orientation="vertical" flexItem />
            <TableViewGroupByButton currentView={view} fieldsMap={fieldsMap} />
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
                  }}>
                  <div className={style.menuBar}>
                    {tableHeightOptions.map((el) => (
                      <div
                        className={style.template}
                        onClick={() => handleHeightControl(el.value)}>
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
            <Button
              onClick={handleClick}
              variant="text"
              style={{
                color: "#A8A8A8",
                borderColor: "#A8A8A8",
                minWidth: "auto",
              }}>
              <MoreVertOutlined
                style={{
                  color: "#888",
                }}
              />
            </Button>

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
              }}>
              <div className={style.menuBar}>
                <ExcelButtons fieldsMap={fieldsMap} view={view} />
                <div
                  className={style.template}
                  onClick={() => setSelectedTabIndex(views?.length)}>
                  <div
                    className={`${style.element} ${
                      selectedTabIndex === views?.length ? style.active : ""
                    }`}>
                    <Description
                      className={style.icon}
                      style={{color: "#6E8BB7"}}
                    />
                  </div>
                  <span>Template</span>
                </div>
              </div>
            </Menu>
          </div>
        </div>
      </div>

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
                    />
                  )}
                </>
              ) : null}
            </>
          }
        </TableCard>
      </Tabs>
    </>
  );
};

const queryGenerator = (groupField, filters = {}) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? {[groupField.slug]: filterValue} : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el?.label ?? el.value,
          value: el?.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getListV2(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {tableSlug: groupField.table_slug, filters: computedFilters},
      ],
      queryFn,
      select: (res) =>
        res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
    };
  }
};

export default ViewsWithGroups;
