import { Box, IconButton } from "@mui/material";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorViewService from "../../../services/constructorViewService";
import { applyDrag } from "../../../utils/applyDrag";
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel";
import FastFilter from "../components/FastFilter";
import BoardColumn from "./BoardColumn";
import styles from "./style.module.scss";
import { ColumnHeaderBlock } from "./components/ColumnHeaderBlock";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import clsx from "clsx";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import DrawerDetailPage from "../DrawerDetailPage";
import { useProjectGetByIdQuery } from "../../../services/projectService";
import layoutService from "../../../services/layoutService";
import { FIELD_TYPES } from "../../../utils/constants/fieldTypes";
import { Add } from "@mui/icons-material";
import {
  useGetBoardMutation,
  useGetBoardStructureMutation,
} from "../../../services/boardViewService";

const BoardView = ({
  view,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  fieldsMap,
  fieldsMapRel,
  selectedTable,
  menuItem,
  visibleColumns,
  visibleRelationColumns,
  layoutType,
  setLayoutType,
  searchText,
  columnsForSearch,
}) => {
  const navigate = useNavigate();
  const projectId = useSelector((state) => state.company?.projectId);
  const isFilterOpen = useSelector((state) => state.main?.tableViewFiltersOpen);
  const { tableSlug, appId } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const id = useId();
  const { t, i18n } = useTranslation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterTab, setFilterTab] = useState(null);
  const [boardTab, setBoardTab] = useState(view?.attributes?.tabs ?? null);

  const [selectedView, setSelectedView] = useState(null);
  const { filters } = useFilters(tableSlug, view.id);

  const boardRef = useRef(null);
  const fixedElement = useRef(null);
  const subGroupById = view?.attributes?.sub_group_by_id;

  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [defaultValue, setDefaultValue] = useState(null);

  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [groupsCounts, setGroupsCounts] = useState({});

  const subGroupField = fieldsMap[subGroupById];
  const subGroupFieldSlug = fieldsMap[subGroupById]?.slug;

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMapRel[groupFieldId];

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const {
    data: { layout } = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const navigateToEditPage = (el) => {
    setOpenDrawerModal(true);
    setSelectedRow(el);
    setDateInfo({});
    setDefaultValue({});
  };

  // const navigateToCreatePage = ({ tab }) => {
  //   setOpenDrawerModal(true);
  //   setSelectedRow({});
  //   if (isStatusType) {
  //     setDefaultValue({
  //       field: selectedGroupField?.slug,
  //       value: [tab?.label],
  //     });
  //   } else {
  //     setDefaultValue({
  //       field: tab.slug,
  //       value: [tab.value],
  //     });
  //   }
  // };

  const navigateToCreatePage = ({ tab }) => {
    setOpenDrawerModal(true);
    setSelectedRow(null);
    if (isStatusType) {
      setDefaultValue({
        field: selectedGroupField?.slug,
        value: [tab?.label],
      });
    } else {
      setDefaultValue({
        field: tab.slug,
        value: [tab.value],
      });
    }
  };

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table.slug}`;
    navigate(url);
  };

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  // const {
  //   data: boardDataContent = [],
  //   isLoading: boardDataContentLoader,
  //   refetch: refetchBoardDataContent,
  // } = useQuery(
  //   ["GET_OBJECT_LIST_ALL", { tableSlug, id, filters, filterTab }],
  //   () => {
  //     return constructorObjectService.getListV2(tableSlug, {
  //       data: {
  //         ...filters,
  //         limit: 300,
  //         offset: 0,
  //       },
  //     });
  //   },
  //   {
  //     select: ({ data }) => data?.response ?? [],
  //   }
  // );
  // console.log({ boardDataContent });
  const dataLoader = false;
  const refetch = () => {};
  const data = useMemo(() => {
    return [];
  }, []);

  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [boardData, setBoardData] = useState([]);

  const boardMutation = useGetBoardMutation(
    {
      onSuccess: (data) => {
        setBoardData(data?.data?.response ?? []);
      },
    },
    tableSlug
  );

  const mutateBoardData = () => {
    const fields = [
      ...visibleColumns?.map((el) => el?.slug),
      "guid",
      "board_order",
    ] ?? ["guid", "board_order"];
    boardMutation.mutate({
      data: {
        group_by: {
          field: groupField.slug,
        },
        subgroup_by: {
          field: subGroupFieldSlug,
        },
        limit: 300,
        offset: 0,
        fields: fields,
      },
    });
  };

  const boardStructureMutation = useGetBoardStructureMutation(
    {
      onSuccess: (data) => {
        const attributesTabs = view?.attributes?.tabs;

        if (attributesTabs?.length === data?.data?.groups?.length) {
          setGroups(() => {
            const tempGroups = data?.data?.groups?.map((item) => ({
              ...item,
              order: attributesTabs?.find((el) => el?.name === item?.name)
                ?.order,
            }));
            tempGroups.sort((a, b) => a?.order - b?.order);
            return tempGroups;
          });
        } else {
          setGroups(data?.data?.groups ?? []);
        }
        setSubGroups(data?.data?.subgroups ?? []);
        mutateBoardData();
      },
    },
    tableSlug
  );

  const groupMutationForCounts = useGetBoardStructureMutation(
    {
      onSuccess: (data) => {
        const result = {};
        data?.data?.groups?.forEach((el) => {
          result[el?.name] = el?.count;
        });
        setGroupsCounts(result);
      },
    },
    tableSlug
  );

  useEffect(() => {
    const mutateBody = {
      data: {
        group_by: {
          field: groupField.slug,
        },
      },
    };

    if (subGroupById) {
      mutateBody.data.subgroup_by = {
        field: subGroupFieldSlug,
      };
    }

    boardStructureMutation.mutate(mutateBody);
  }, [groupField, subGroupFieldSlug, subGroupById]);

  const updateView = (tabs) => {
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        tabs,
      },
    };
    constructorViewService.update(tableSlug, computedData).then((res) => {
      // queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const { data: tabs, isLoading: tabsLoader } = useQuery(
    queryGenerator(groupField, filters, i18n?.language)
  );

  // const loader = dataLoader || tabsLoader;
  const loader = boardStructureMutation.isLoading;

  // const navigateToCreatePage = () => {
  //   navigateToForm(tableSlug);
  // };

  const onDrop = (dropResult) => {
    const result = applyDrag(groups, dropResult);
    const orderedResult = result.map((el, index) => ({
      ...el,
      order: index + 1,
    }));
    setGroups(orderedResult);
    if (orderedResult) {
      updateView(orderedResult);
    }
  };

  // const {
  //   data: {visibleViews, visibleColumns, visibleRelationColumns} = {
  //     visibleViews: [],
  //     visibleColumns: [],
  //     visibleRelationColumns: [],
  //   },
  //   isVisibleLoading,
  // } = useQuery({
  //   queryKey: [
  //     "GET_TABLE_INFO",
  //     {
  //       tableSlug,
  //     },
  //   ],
  //   queryFn: () => {
  //     return constructorTableService.getTableInfo(tableSlug, {
  //       data: {},
  //     });
  //   },
  //   select: (res) => {
  //     return {
  //       visibleViews: res?.data?.views ?? [],
  //       visibleColumns: res?.data?.fields ?? [],
  //       visibleRelationColumns:
  //         res?.data?.relation_fields?.map((el) => ({
  //           ...el,
  //           label: `${el.label} (${el.table_label})`,
  //         })) ?? [],
  //     };
  //   },
  // });

  useEffect(() => {
    const updatedTabs = view?.attributes?.tabs;
    setBoardTab(updatedTabs);
    if (tabs?.length === updatedTabs?.length && view?.type === "BOARD") {
      setBoardTab(updatedTabs);
    } else {
      setBoardTab(tabs);
    }
  }, [tabs, view, selectedTabIndex]);

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      return [...visibleColumns, ...visibleRelationColumns];
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  const [subBoardData, setSubBoardData] = useState({});

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  useEffect(() => {
    setSubBoardData({});
    if (subGroupById) {
      data?.forEach((item) => {
        const key =
          subGroupField?.type === FIELD_TYPES.LOOKUP
            ? item?.[subGroupFieldSlug + "_data"]?.[subGroupField?.table_slug]
            : item?.[subGroupFieldSlug];
        setSubBoardData((prev) => {
          return {
            ...prev,
            [key]: [
              ...data?.filter((el) => {
                if (Array.isArray(el?.[subGroupFieldSlug])) {
                  return (
                    el?.[subGroupFieldSlug]?.[0] ===
                    item?.[subGroupFieldSlug]?.[0]
                  );
                }
                return el?.[subGroupFieldSlug] === item?.[subGroupFieldSlug];
              }),
            ],
          };
        });
      });
    }
  }, [data, view]);

  const [openedGroups, setOpenedGroups] = useState([]);

  const handleToggle = (el) => {
    if (openedGroups.includes(el)) {
      setOpenedGroups(openedGroups.filter((item) => item !== el));
    } else {
      setOpenedGroups([...openedGroups, el]);
    }
  };

  useEffect(() => {
    setOpenedGroups(subGroups?.map((el) => el?.name));
  }, [subGroups]);

  const getGroupCounts = () => {
    const mutateBody = {
      data: {
        group_by: {
          field: groupField.slug,
        },
      },
    };
    groupMutationForCounts.mutate(mutateBody);
  };

  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];
  const isStatusType = selectedGroupField?.type === "STATUS";

  const statusGroupCounts = useMemo(() => {
    const result = {};
    if (subGroupById) {
      Object.entries(subBoardData)?.forEach(([key, value]) => {
        value?.forEach((item) => {
          if (result[item?.[groupField?.slug]]) {
            result[item?.[groupField?.slug]] += 1;
          } else {
            result[item?.[groupField?.slug]] = 1;
          }
        });
      });
    } else {
      data?.forEach((item) => {
        if (result[item?.[groupField?.slug]]) {
          result[item?.[groupField?.slug]] += 1;
        } else {
          result[item?.[groupField?.slug]] = 1;
        }
      });
    }

    return result;
  }, [subBoardData, groupField, data, view]);

  const getColor = (el) =>
    subGroupField?.attributes?.options?.find((item) => item?.value === el)
      ?.color ?? "";

  const [groupCounts, setGroupCounts] = useState({});

  const [isOnTop, setIsOnTop] = useState(false);

  useEffect(() => {
    setGroupCounts(statusGroupCounts);
  }, [data, subBoardData, statusGroupCounts]);

  useEffect(() => {
    const board = boardRef.current;
    const el = fixedElement.current;
    if (!board || !el) return;

    const onScroll = () => {
      if (board.scrollTop > 0) {
        setIsOnTop(true);
        el.style.transform = `translateY(${board.scrollTop}px)`;
      } else {
        setIsOnTop(false);
        el.style.transform = "none";
      }
    };

    board.addEventListener("scroll", onScroll);

    return () => {
      board.removeEventListener("scroll", onScroll);
    };
  }, [boardRef.current, fixedElement.current]);

  return (
    <div className={styles.container} ref={boardRef}>
      {loader ? (
        <PageFallback />
      ) : (
        <div className={styles.wrapper}>
          {(view?.quick_filters?.length > 0 ||
            (new_list[tableSlug] &&
              new_list[tableSlug].some((i) => i.checked))) && (
            <div
              className={
                filterVisible ? styles.filters : styles.filtersVisiblitiy
              }
            >
              <Box className={styles.block}>
                <p>{t("filters")}</p>
                <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
              </Box>
            </div>
          )}
          <div className={styles.boardHeader} ref={fixedElement}>
            <Container
              lockAxis="x"
              onDrop={onDrop}
              getChildPayload={(i) => groups[i]}
              orientation="horizontal"
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              autoScrollEnabled={false}
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
              style={{
                display: "flex",
                // padding: "0 16px",
              }}
            >
              {groups?.map((tab, tabIndex) => (
                <Draggable
                  key={tabIndex}
                  style={{
                    borderBottom: isOnTop
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : "none",
                    padding: "0 16px",
                    paddingLeft: tabIndex === 0 ? "16px" : "8px",
                    paddingRight:
                      tabIndex === groups?.length - 1 ? "16px" : "0",
                  }}
                >
                  <ColumnHeaderBlock
                    field={computedColumnsFor?.find(
                      (field) => field?.label === tab?.name
                    )}
                    tab={tab}
                    groupField={groupField}
                    navigateToCreatePage={navigateToCreatePage}
                    counts={groupsCounts}
                  />
                </Draggable>
              ))}
            </Container>
          </div>
          <div
            className={styles.board}
            style={{
              height: isFilterOpen
                ? "calc(100vh - 121px)"
                : "calc(100vh - 91px)",
              paddingTop: "50px",
            }}
          >
            {subGroupById ? (
              <div className={styles.boardSubGroupWrapper}>
                {subGroups?.map((subGroup, subGroupIndex) => (
                  <div key={subGroup?.name}>
                    <button
                      className={styles.boardSubGroupBtn}
                      onClick={() => handleToggle(subGroup?.name)}
                    >
                      <span
                        className={clsx(styles.boardSubGroupBtnInner, {
                          [styles.selected]: openedGroups.includes(
                            subGroup?.name
                          ),
                        })}
                      >
                        <span className={styles.iconWrapper}>
                          <span className={styles.icon}>
                            <PlayArrowRoundedIcon fontSize="small" />
                          </span>
                        </span>
                        <span
                          className={styles.boardSubGroupBtnLabel}
                          style={{
                            color: getColor(subGroup?.name),
                            background: getColor(subGroup?.name) + 33,
                          }}
                        >
                          {subGroup?.name}
                        </span>
                      </span>
                    </button>
                    {openedGroups?.includes(subGroup?.name) && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        {groups?.map((group, index) => (
                          <BoardColumn
                            mutateBoardData={mutateBoardData}
                            boardData={boardData[subGroup?.name]?.[group?.name]}
                            computedColumnsFor={computedColumnsFor}
                            key={group.value}
                            group={group}
                            tab={group}
                            data={[]}
                            fieldsMap={fieldsMap}
                            view={view}
                            menuItem={menuItem}
                            layoutType={layoutType}
                            setLayoutType={setLayoutType}
                            refetch={refetch}
                            boardRef={boardRef}
                            index={index}
                            subGroupIndex={subGroupIndex}
                            subGroupById={subGroupById}
                            subGroupData={subBoardData[subGroup?.name]}
                            subItem={subGroup?.name}
                            subGroupFieldSlug={subGroupFieldSlug}
                            searchText={searchText}
                            columnsForSearch={columnsForSearch}
                            setDateInfo={setDateInfo}
                            setDefaultValue={setDefaultValue}
                            setOpenDrawerModal={setOpenDrawerModal}
                            setSelectedRow={setSelectedRow}
                            setGroupCounts={setGroupCounts}
                            groupSlug={groupField.slug}
                            getGroupCounts={getGroupCounts}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                {groups?.map((group, index) => (
                  <div key={group.value} className={styles.draggable}>
                    <BoardColumn
                      mutateBoardData={mutateBoardData}
                      boardData={boardData?.[group?.name]}
                      computedColumnsFor={computedColumnsFor}
                      key={group.value}
                      group={group}
                      tab={group}
                      data={[]}
                      fieldsMap={fieldsMap}
                      view={view}
                      menuItem={menuItem}
                      layoutType={layoutType}
                      setLayoutType={setLayoutType}
                      refetch={refetch}
                      boardRef={boardRef}
                      index={index}
                      searchText={searchText}
                      columnsForSearch={columnsForSearch}
                      setDateInfo={setDateInfo}
                      setDefaultValue={setDefaultValue}
                      setOpenDrawerModal={setOpenDrawerModal}
                      setSelectedRow={setSelectedRow}
                      setGroupCounts={setGroupCounts}
                      groupSlug={groupField.slug}
                      getGroupCounts={getGroupCounts}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div
            className={styles.board}
            style={{
              height: isFilterOpen
                ? "calc(100vh - 121px)"
                : "calc(100vh - 91px)",
              paddingTop: "50px",
              // ? subGroupById
              //   ? "calc(100vh - 171px)"
              //   : "calc(100vh - 121px)"
              // : subGroupById
              //   ? "calc(100vh - 133px)"
              //   : "calc(100vh - 83px)",
            }}
          >
            {subGroupById ? (
              <div className={styles.boardSubGroupWrapper}>
                {subGroups?.map((el, subGroupIndex) => (
                  <div key={el}>
                    <button
                      className={styles.boardSubGroupBtn}
                      onClick={() => handleToggle(el)}
                    >
                      <span
                        className={clsx(styles.boardSubGroupBtnInner, {
                          [styles.selected]: openedGroups.includes(el),
                        })}
                      >
                        <span className={styles.iconWrapper}>
                          <span className={styles.icon}>
                            <PlayArrowRoundedIcon fontSize="small" />
                          </span>
                        </span>
                        <span
                          className={styles.boardSubGroupBtnLabel}
                          style={{
                            color: getColor(el),
                            background: getColor(el) + 33,
                          }}
                        >
                          {el}
                        </span>
                      </span>
                    </button>
                    {openedGroups?.includes(el) && (
                      <div
                        // lockAxis="x"
                        // onDrop={onDrop}
                        // orientation="horizontal"
                        // dragHandleSelector=".column-header"
                        // dragClass="drag-card-ghost"
                        // dropClass="drag-card-ghost-drop"
                        // dropPlaceholder={{
                        //   animationDuration: 150,
                        //   showOnTop: true,
                        //   className: "drag-cards-drop-preview",
                        // }}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          // paddingTop: "48px",
                          // position: "static",
                        }}
                      >
                        {groups?.map((tab, index) => (
                          // <Draggable
                          //   key={tab.value}
                          //   className={styles.draggable}
                          // >
                          <BoardColumn
                            computedColumnsFor={computedColumnsFor}
                            key={tab.value}
                            tab={tab}
                            data={data}
                            fieldsMap={fieldsMap}
                            view={view}
                            menuItem={menuItem}
                            layoutType={layoutType}
                            setLayoutType={setLayoutType}
                            refetch={refetch}
                            boardRef={boardRef}
                            index={index}
                            subGroupIndex={subGroupIndex}
                            subGroupById={subGroupById}
                            subGroupData={subBoardData[el]}
                            subItem={el}
                            subGroupFieldSlug={subGroupFieldSlug}
                            searchText={searchText}
                            columnsForSearch={columnsForSearch}
                            setDateInfo={setDateInfo}
                            setDefaultValue={setDefaultValue}
                            setOpenDrawerModal={setOpenDrawerModal}
                            setSelectedRow={setSelectedRow}
                            setGroupCounts={setGroupCounts}
                          />
                          // </Draggable>
                        ))}
                      </div>
                      // </Container>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                // lockAxis="x"
                // onDrop={onDrop}
                // orientation="horizontal"
                // dragHandleSelector=".column-header"
                // dragClass="drag-card-ghost"
                // dropClass="drag-card-ghost-drop"
                // dropPlaceholder={{
                //   animationDuration: 150,
                //   showOnTop: true,
                //   className: "drag-cards-drop-preview",
                // }}
                style={{ display: "flex", gap: 8 }}
              >
                {boardTab?.map((tab, index) => (
                  // <Draggable key={tab.value} className={styles.draggable}>
                  <div key={tab.value} className={styles.draggable}>
                    <BoardColumn
                      computedColumnsFor={computedColumnsFor}
                      key={tab.value}
                      tab={tab}
                      data={data}
                      fieldsMap={fieldsMap}
                      view={view}
                      menuItem={menuItem}
                      // navigateToCreatePage={navigateToCreatePage}
                      layoutType={layoutType}
                      setLayoutType={setLayoutType}
                      refetch={refetch}
                      boardRef={boardRef}
                      index={index}
                      subGroupById={subGroupById}
                      subGroupData={subBoardData.current}
                      setOpenDrawerModal={setOpenDrawerModal}
                      setDateInfo={setDateInfo}
                      setDefaultValue={setDefaultValue}
                      setSelectedRow={setSelectedRow}
                      subGroupFieldSlug={subGroupFieldSlug}
                      setGroupCounts={setGroupCounts}
                      searchText={searchText}
                      columnsForSearch={columnsForSearch}
                    />
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>
      )}
      <MaterialUIProvider>
        <DrawerDetailPage
          projectInfo={projectInfo}
          open={openDrawerModal}
          setOpen={setOpenDrawerModal}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToEditPage}
          dateInfo={dateInfo}
          defaultValue={defaultValue}
        />
      </MaterialUIProvider>
    </div>
  );
};

const queryGenerator = (groupField, filters = {}, lan) => {
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
          label: el.label,
          value: el.value,
          slug: groupField?.slug,
        })),
    };
  }
  if (groupField?.type === "STATUS") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () => [
        ...groupField?.attributes?.progress?.options?.map((el) => ({
          label: el.label,
          value: el.label,
          slug: el.label,
          color: el?.color,
        })),
        ...groupField?.attributes?.todo?.options?.map((el) => ({
          label: el.label,
          value: el.label,
          slug: el.label,
          color: el?.color,
        })),
        ...groupField?.attributes?.complete?.options?.map((el) => ({
          label: el.label,
          value: el.label,
          slug: el.label,
          color: el?.color,
        })),
      ],
    };
  }

  if (groupField?.type === "LOOKUP") {
    const queryFn = () =>
      constructorObjectService.getListV2(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.table_slug, filters: computedFilters },
      ],
      queryFn,
      select: (res) => {
        return res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el, lan),
          value: el.guid,
          slug: groupField?.slug,
        }));
      },
    };
  }
};

export default BoardView;
