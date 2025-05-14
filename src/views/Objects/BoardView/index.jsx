import { Box } from "@mui/material";
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
}) => {
  const navigate = useNavigate();
  const projectId = useSelector((state) => state.company?.projectId);
  const isFilterOpen = useSelector((state) => state.main?.tableViewFiltersOpen);
  const { tableSlug, appId } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const id = useId();
  const { t, i18n } = useTranslation();
  const [isChanged, setIsChanged] = useState(false);
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

  const {
    data = [],
    isLoading: dataLoader,
    refetch,
  } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug, id, filters, filterTab }],
    () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          ...filters,
          limit: 100,
          offset: 0,
        },
      });
    },
    {
      select: ({ data }) => data?.response ?? [],
    }
  );

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

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMapRel[groupFieldId];

  const { data: tabs, isLoading: tabsLoader } = useQuery(
    queryGenerator(groupField, filters, i18n?.language)
  );

  const loader = dataLoader || tabsLoader;

  // const navigateToCreatePage = () => {
  //   navigateToForm(tableSlug);
  // };

  const onDrop = (dropResult) => {
    const result = applyDrag(boardTab, dropResult);
    setBoardTab(result);
    if (result) {
      updateView(result);
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
    // if (tabs?.length === updatedTabs?.length && view?.type === "BOARD") {
    //   setBoardTab(updatedTabs);
    // } else {
    //   setBoardTab(tabs);
    // }
  }, [tabs, view, selectedTabIndex]);

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      return [...visibleColumns, ...visibleRelationColumns];
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  const [subBoardData, setSubBoardData] = useState({});
  const subGroupField = fieldsMap[subGroupById];
  const subGroupFieldSlug = fieldsMap[subGroupById]?.slug;

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
          subGroupField?.type === "LOOKUP"
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
    setOpenedGroups(Object.keys(subBoardData));
  }, [subBoardData]);

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
  }, [subBoardData, groupField, data, boardTab, view]);

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
      // el.style.top = `${board.scrollTop}px`;
      if (board.scrollTop > 0) {
        setIsOnTop(true);
      } else {
        setIsOnTop(false);
      }
      el.style.transform = `translateY(${board.scrollTop}px)`;
    };

    board.addEventListener("scroll", onScroll);

    return () => {
      board.removeEventListener("scroll", onScroll);
    };
  }, [boardRef.current, fixedElement.current]);

  console.log({ subBoardData });

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

          {/* {subGroupById && ( */}
          {/* <div className={styles.header}>
            {boardTab?.map((tab) => (
              <ColumnHeaderBlock
                key={tab.value}
                tab={tab}
                computedData={subBoardData[tab.value]}
                counts={statusGroupCounts}
                navigateToCreatePage={navigateToCreatePage}
                field={computedColumnsFor?.find(
                  (field) => field?.slug === tab?.slug
                )}
              />
            ))}
          </div> */}
          {/* )} */}

          <div
            className={styles.boardHeader}
            ref={fixedElement}
            style={{
              boxShadow: isOnTop ? "rgba(0, 0, 0, 0.1) 0px 0px 2px 0px" : "",
            }}
          >
            <Container
              lockAxis="x"
              onDrop={onDrop}
              orientation="horizontal"
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
              style={{
                display: "flex",
                gap: 8,
                padding: "0 16px",
              }}
            >
              {boardTab?.map((tab, tabIndex) => (
                <Draggable key={tabIndex}>
                  <ColumnHeaderBlock
                    field={tab}
                    tab={tab}
                    // computedData={computedData}
                    // boardRef={boardRef}
                    navigateToCreatePage={navigateToCreatePage}
                    counts={groupCounts}
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
              paddingTop: "48px",
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
                {Object.keys(subBoardData)?.map((el, subGroupIndex) => (
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
                        {boardTab?.map((tab, index) => (
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
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
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
          // refetch={refetch}
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
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        }));
      },
    };
  }
};

export default BoardView;
