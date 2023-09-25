import { Description, MoreVertOutlined } from "@mui/icons-material";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import MultipleInsertButton from "./components/MultipleInsertForm";
import CustomActionsButton from "./components/CustomActionsButton";
import {
  ArrowDropDownCircleOutlined,
  Clear,
  Edit,
  Save,
} from "@mui/icons-material";
import { useFieldArray, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import HexagonIcon from "@mui/icons-material/Hexagon";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { Button, CircularProgress, Divider, Menu } from "@mui/material";
import { endOfMonth, startOfMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { CheckIcon } from "../../assets/icons/icon";
import CRangePickerNew from "../../components/DatePickers/CRangePickerNew";
import FiltersBlock from "../../components/FiltersBlock";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import useFilters from "../../hooks/useFilters";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import ColumnVisible from "./ColumnVisible";
import FinancialCalendarView from "./FinancialCalendarView/FinancialCalendarView";
import GroupByButton from "./GroupByButton";
import LanguagesNavbar from "./LanguagesNavbar";
import ShareModal from "./ShareModal/ShareModal";
import { menuActions } from "../../store/menuItem/menuItem.slice";
import TableView from "./TableView";
import TreeView from "./TreeView";
import ExcelButtons from "./components/ExcelButtons";
import FastFilterButton from "./components/FastFilter/FastFilterButton";
import FixColumnsTableView from "./components/FixColumnsTableView";
import SearchParams from "./components/ViewSettings/SearchParams";
import ViewTabSelector from "./components/ViewTypeSelector";
import style from "./style.module.scss";
import SortButton from "./SortButton";
import GroupColumnVisible from "./GroupColumnVisible";
import GroupTableView from "./TableView/GroupTableView";

const ViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap,
  menuItem,
}) => {
  const { t } = useTranslation();
  const { tableSlug } = useParams();
  const visibleForm = useForm();
  const dispatch = useDispatch();
  const { filters } = useFilters(tableSlug, view.id);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [shouldGet, setShouldGet] = useState(false);
  const [heightControl, setHeightControl] = useState(false);
  const [analyticsRes, setAnalyticsRes] = useState(null);
  const [isFinancialCalendarLoading, setIsFinancialCalendarLoading] =
    useState(false);
  const { navigateToForm } = useTabRouter();
  const [dataLength, setDataLength] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const navigate = useNavigate();
  const { appId } = useParams();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [defaultViewTab, setDefaultViewTab] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [checkedColumns, setCheckedColumns] = useState([]);
  const [tab, setTab] = useState();
  const [sortedDatas, setSortedDatas] = useState([]);
  const groupTable = view?.attributes.group_by_columns;

  console.log("tab", tab);
  console.log("view", view);
  console.log("groupTable", groupTable);

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

  const [anchorElHeightControl, setAnchorElHeightControl] = useState(null);
  const openHeightControl = Boolean(anchorElHeightControl);
  const handleClickHeightControl = (event) => {
    setAnchorElHeightControl(event.currentTarget);
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
    handleSubmit,
    watch,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "multi",
  });

  const getValue = useCallback((item, key) => {
    return typeof item?.[key] === "object" ? item?.[key].value : item?.[key];
  }, []);

  const { mutate: updateMultipleObject, isLoading } = useMutation(
    (values) =>
      constructorObjectService.updateMultipleObject(tableSlug, {
        data: {
          objects: values.multi.map((item) => ({
            ...item,
            guid: item?.guid ?? "",
            doctors_id_2: getValue(item, "doctors_id_2"),
            doctors_id_3: getValue(item, "doctors_id_3"),
            specialities_id: getValue(item, "specialities_id"),
          })),
        },
      }),
    {
      onSuccess: () => {
        setShouldGet((p) => !p);
        setFormVisible(false);
      },
    }
  );

  const onSubmit = (data) => {
    updateMultipleObject(data);
  };

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
    setHeightControl(false);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  const navigateToCreatePageWithInvite = () => {
    navigateToForm(tableSlug);
    dispatch(menuActions.setInvite(true));
  };

  function dateIsValid(date) {
    return date instanceof Date && !isNaN(date);
  }

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const { data: tabs } = useQuery(queryGenerator(groupField, filters));

  useEffect(() => {
    if (view?.type === "FINANCE CALENDAR" && dateIsValid(dateFilters?.$lt)) {
      setIsFinancialCalendarLoading(true);
      constructorObjectService
        .getFinancialAnalytics(tableSlug, {
          data: {
            start: dateFilters?.$gte,
            end: dateFilters?.$lt,
            view_id: view?.id,
          },
        })
        .then((res) => {
          setAnalyticsRes(res.data);
        })
        .finally(() => setIsFinancialCalendarLoading(false));
    }
  }, [dateFilters, tableSlug]);

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table.slug}`;
    navigate(url);
  };

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  const columnsForSearch = useMemo(() => {
    return Object.values(fieldsMap)?.filter(
      (el) =>
        el?.type === "SINGLE_LINE" ||
        el?.type === "MULTI_LINE" ||
        el?.type === "NUMBER" ||
        el?.type === "PHONE" ||
        el?.type === "EMAIL" ||
        el?.type === "INTERNATION_PHONE"
    );
  }, [view, fieldsMap]);

  const selectAll = () => {
    setCheckedColumns(columnsForSearch.map((el) => el.slug));
  };

  useEffect(() => {
    selectAll();
  }, []);

  const {
    data: { visibleViews, visibleColumns, visibleRelationColumns } = {
      visibleViews: [],
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isVisibleLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0 },
      });
    },
    {
      select: ({ data }) => {
        return {
          visibleViews: data?.views ?? [],
          visibleColumns: data?.fields ?? [],
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  return (
    <>
      <FiltersBlock
        extra={
          <>
            <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
              <ShareModal />
            </PermissionWrapperV2>

            <PermissionWrapperV2 tableSlug={tableSlug} type="language_btn">
              <LanguagesNavbar />
            </PermissionWrapperV2>

            <PermissionWrapperV2 tableSlug={tableSlug} type="automation">
              <Button variant="outlined">
                <HexagonIcon />
              </Button>
            </PermissionWrapperV2>

            <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
              <Button variant="outlined" onClick={navigateToSettingsPage}>
                <SettingsSuggestIcon />
              </Button>
            </PermissionWrapperV2>
          </>
        }
      >
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
          defaultViewTab={defaultViewTab}
          setTab={setTab}
        />
        {view?.type === "FINANCE CALENDAR" && (
          <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
        )}
      </FiltersBlock>

      <div className={style.extraNavbar}>
        <div className={style.extraWrapper}>
          <div className={style.search}>
            <FastFilterButton view={view} fieldsMap={fieldsMap} />
            <Divider orientation="vertical" flexItem />
            <SearchInput
              placeholder={"Search"}
              onChange={(e) => setSearchText(e)}
            />
            <button
              className={style.moreButton}
              onClick={handleClickSearch}
              style={{
                paddingRight: "10px",
              }}
            >
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
              }}
            >
              <SearchParams
                checkedColumns={checkedColumns}
                setCheckedColumns={setCheckedColumns}
                columns={columnsForSearch}
              />
            </Menu>
          </div>

          <div className={style.rightExtra}>
            <FixColumnsTableView selectedTabIndex={selectedTabIndex} />

            <Divider orientation="vertical" flexItem />

            <GroupByButton selectedTabIndex={selectedTabIndex} />

            <Divider orientation="vertical" flexItem />

            <ColumnVisible
              selectedTabIndex={selectedTabIndex}
              views={visibleViews}
              columns={visibleColumns}
              relationColumns={visibleRelationColumns}
              isLoading={isVisibleLoading}
              form={visibleForm}
            />

            <Divider orientation="vertical" flexItem />

            <SortButton
              selectedTabIndex={selectedTabIndex}
              sortDatas={sortedDatas}
              setSortedDatas={setSortedDatas}
            />
            <GroupColumnVisible
              selectedTabIndex={selectedTabIndex}
              views={visibleViews}
              columns={visibleColumns}
              relationColumns={visibleRelationColumns}
              isLoading={isVisibleLoading}
              form={visibleForm}
            />

            <Divider orientation="vertical" flexItem />

            {view.type === "TABLE" && (
              <>
                <button
                  className={style.moreButton}
                  onClick={handleClickHeightControl}
                >
                  <FormatLineSpacingIcon color="#A8A8A8" />
                  Line Height
                </button>

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
                  {/* <div className={style.menuBar}>
                    {tableHeightOptions.map((el) => (
                      <div key={el.value} className={style.heightControl_item} onClick={() => handleHeightControl(el.value)}>
                        {el.label}
                        {tableHeight === el.value ? <CheckIcon color="primary" /> : null}
                      </div>
                    ))}
                  </div> */}

                  <div className={style.menuBar}>
                    {tableHeightOptions.map((el) => (
                      <div
                        className={style.template}
                        onClick={() => handleHeightControl(el.value)}
                      >
                        <div
                          className={`${style.element} ${
                            selectedTabIndex === views?.length
                              ? style.active
                              : ""
                          }`}
                        >
                          {tableHeight === el.value ? (
                            <CheckIcon color="primary" />
                          ) : null}
                        </div>
                        <span>{el.label}</span>
                      </div>
                    ))}
                  </div>
                </Menu>
              </>

              // <div className={style.lineControl} onClick={() => setHeightControl(!heightControl)}>
              //   <div style={{ position: "relative" }}>
              //     <span className={style.buttonSpan}>
              //       <FormatLineSpacingIcon color="#A8A8A8" />
              //       Line Height
              //     </span>
              //     {heightControl && (
              //       <div className={style.heightControl}>
              //         {tableHeightOptions.map((el) => (
              //           <div key={el.value} className={style.heightControl_item} onClick={() => handleHeightControl(el.value)}>
              //             {el.label}
              //             {tableHeight === el.value ? <CheckIcon color="primary" /> : null}
              //           </div>
              //         ))}
              //       </div>
              //     )}
              //   </div>
              // </div>
            )}

            <button className={style.moreButton} onClick={handleClick}>
              <MoreVertOutlined
                style={{
                  color: "#888",
                }}
              />
            </button>

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
                <ExcelButtons fieldsMap={fieldsMap} view={view} />
                <div
                  className={style.template}
                  onClick={() => setSelectedTabIndex(views?.length)}
                >
                  <div
                    className={`${style.element} ${
                      selectedTabIndex === views?.length ? style.active : ""
                    }`}
                  >
                    <Description
                      className={style.icon}
                      style={{ color: "#6E8BB7" }}
                    />
                  </div>
                  <span>{t("template")}</span>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="title" style={{ marginRight: "20px" }}>
                  <h3>{view.table_label}</h3>
                </div>
                <TabList style={{ border: "none" }}>
                  {tabs?.map((tab) => (
                    <Tab
                      key={tab.value}
                      selectedClassName={style.activeTab}
                      className={`${style.disableTab} react-tabs__tab`}
                    >
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>
              </div>

              {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <PermissionWrapperV2 tableSlug={tableSlug} type="write">
                {invite && (
                  <Button
                    variant="contained"
                    onClick={navigateToCreatePageWithInvite}
                  >
                    Invite
                  </Button>
                )}
                <RectangleIconButton
                  color="success"
                  size="small"
                  onClick={navigateToCreatePage}
                >
                <Button variant="outlined" onClick={navigateToCreatePage}>
                  <AddIcon style={{ color: "#007AFF" }} />
                  Add object
                </Button>
                {formVisible ? (
                  <>
                    <RectangleIconButton
                      color="success"
                      size="small"
                      onClick={handleSubmit(onSubmit)}
                      loader={isLoading}
                    >
                      <Save color="success" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      color="error"
                      type="exit"
                      onClick={() => {
                        setFormVisible(false);
                        if (fields.length > dataLength) {
                          remove(
                            Array(fields.length - dataLength)
                              .fill("*")
                              .map((i, index) => fields.length - (index + 1))
                          );
                        }
                      }}
                    >
                      <Clear color="error" />
                    </RectangleIconButton>
                  </>
                ) : (
                  // <PermissionWrapperV2 tableSlug={tableSlug} type="update">
                  //   <RectangleIconButton
                  //     color="success"
                  //     className=""
                  //     size="small"
                  //     onClick={() => {
                  //       setFormVisible(true);
                  //     }}
                  //   >
                  //     <Edit color="primary" />
                  //   </RectangleIconButton>
                  // </PermissionWrapperV2>
                  ""
                )}
                <MultipleInsertButton
                  view={view}
                  fieldsMap={fieldsMap}
                  tableSlug={tableSlug}
                />
                <CustomActionsButton
                  selectedObjects={selectedObjects}
                  setSelectedObjects={setSelectedObjects}
                  tableSlug={tableSlug}
                />
              </PermissionWrapperV2>
            </div> */}
            </div>
          )}
          {
            <>
              {!tabs?.length && (
                <>
                  {view.type === "TABLE" && groupTable?.length ? (
                    <GroupTableView
                      setDataLength={setDataLength}
                      selectedTabIndex={selectedTabIndex}
                      shouldGet={shouldGet}
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
                    ) : view?.type === "FINANCE CALENDAR" ? (
                      <FinancialCalendarView
                        view={view}
                        filters={filters}
                        fieldsMap={fieldsMap}
                        tab={tab}
                        isLoading={isFinancialCalendarLoading}
                        financeDate={analyticsRes?.response || []}
                        financeTotal={analyticsRes?.total_amount || []}
                        totalBalance={analyticsRes?.balance}
                      />
                    ) : (
                      <TableView
                        control={control}
                        setFormVisible={setFormVisible}
                        formVisible={formVisible}
                        filters={filters}
                        view={view}
                        fieldsMap={fieldsMap}
                        setFormValue={setFormValue}
                        setSortedDatas={setSortedDatas}
                        tab={tab}
                        selectedObjects={selectedObjects}
                        setSelectedObjects={setSelectedObjects}
                        menuItem={menuItem}
                        setDataLength={setDataLength}
                        selectedTabIndex={selectedTabIndex}
                        shouldGet={shouldGet}
                        reset={reset}
                        sortedDatas={sortedDatas}
                        fields={fields}
                        checkedColumns={checkedColumns}
                        searchText={searchText}
                        selectedView={selectedView}
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
                  ) : view?.type === "FINANCE CALENDAR" ? (
                    <FinancialCalendarView
                      control={control}
                      view={view}
                      filters={filters}
                      fieldsMap={fieldsMap}
                      isLoading={isFinancialCalendarLoading}
                      financeDate={analyticsRes?.response || []}
                      financeTotal={analyticsRes?.total_amount || []}
                      totalBalance={analyticsRes?.balance || []}
                    />
                  ) : (
                    <TableView
                      setDataLength={setDataLength}
                      selectedTabIndex={selectedTabIndex}
                      shouldGet={shouldGet}
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
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

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
      constructorObjectService.getList(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.table_slug, filters: computedFilters },
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
