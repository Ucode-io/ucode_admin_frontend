import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import constructorViewService from "../../../services/constructorViewService";
import { applyDrag } from "../../../utils/applyDrag";
import { useProjectGetByIdQuery } from "../../../services/projectService";
import layoutService from "../../../services/layoutService";
import {
  useGetBoardMutation,
  useGetBoardStructureMutation,
} from "../../../services/boardViewService";
import { throttle } from "lodash-es";
import { flushSync } from "react-dom";

export const useBoardViewProps = ({
  view,
  fieldsMap,
  fieldsMapRel,
  visibleColumns,
  visibleRelationColumns,
  menuItem,
  searchText,
  // checkedColumns,
  columnsForSearch,
}) => {
  const searchableTypes = ["SINGLE_LINE", "MULTI_LINE"];
  const checkedColumns = columnsForSearch
    ?.filter((item) => item?.is_search && searchableTypes?.includes(item?.type))
    ?.map((item) => item?.slug);
  const navigate = useNavigate();
  const projectId = useSelector((state) => state.company?.projectId);

  const isFilterOpen = useSelector((state) => state.main?.tableViewFiltersOpen);
  const { tableSlug, appId } = useParams();

  const { new_list, list } = useSelector((state) => state.filter);

  const { t } = useTranslation();

  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];
  const isStatusType = selectedGroupField?.type === "STATUS";

  const boardRef = useRef(null);
  const fixedElement = useRef(null);
  const subGroupById = view?.attributes?.sub_group_by_id;
  const limit = 100;

  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [defaultValue, setDefaultValue] = useState(null);

  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [groupsCounts, setGroupsCounts] = useState({});
  const [openedGroups, setOpenedGroups] = useState([]);

  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  const [boardData, setBoardData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [offset, setOffset] = useState(0);

  const [count, setCount] = useState(0);
  const [subgroupsQueue, setSubgroupsQueue] = useState([]);
  const [currentSubgroupIndex, setCurrentSubgroupIndex] = useState(0);

  const [isOnTop, setIsOnTop] = useState(false);

  const subGroupField = fieldsMap[subGroupById];
  const subGroupFieldSlug = fieldsMap[subGroupById]?.slug;

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMapRel[groupFieldId];

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      return [...visibleColumns, ...visibleRelationColumns];
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  const smallestGroup = useMemo(() => {
    return boardData?.length > 0
      ? groups.reduce(
          (max, group) => (group.count < max.count ? group : max),
          groups[0]
        )
      : {};
  }, [groups, boardData]);

  const sortedBoardDataByLength = Object.entries(boardData)
    .sort((a, b) => a[1].length - b[1].length)
    .map(([name, value]) => ({ name, value }))
    .filter(
      (item) =>
        item?.value?.length <
        groups?.find((groupItem) => item?.name === groupItem?.name)?.count
    );

  const lastSubGroup = subGroups[subGroups.length - 1];
  const lastGroupArr = subGroupById
    ? boardData[lastSubGroup?.name]?.[smallestGroup?.name]
    : sortedBoardDataByLength[0]?.value;

  const lastGroupItem = useRef(null);

  const getSubgroupFieldLabel = (subGroup) => {
    return boardData?.[subGroup?.name]?.[groups[0]?.name]?.[0]?.[
      `${subGroupFieldSlug}_data`
    ]?.[fieldsMap?.[subGroupField?.relation_id]?.view_fields?.[0]?.slug];
  };

  const getGroupFieldLabel = (group) => {
    return boardData?.[group?.name]?.[0]?.[`${groupField?.slug}_data`]?.[
      fieldsMap?.[groupField?.relation_id]?.view_fields?.[0]?.slug
    ];
  };

  const navigateToEditPage = (el) => {
    setOpenDrawerModal(true);
    setSelectedRow(el);
    setDateInfo({});
    setDefaultValue({});
  };

  const navigateToCreatePage = ({ group }) => {
    setOpenDrawerModal(true);
    setSelectedRow(null);
    if (isStatusType) {
      setDefaultValue({
        field: selectedGroupField?.slug,
        value: group?.name,
      });
    } else {
      setDefaultValue({
        field: group.slug,
        value: group.name,
      });
    }
  };

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table.slug}`;
    navigate(url);
  };

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

  const handleToggle = (el) => {
    if (openedGroups.includes(el)) {
      setOpenedGroups(openedGroups.filter((item) => item !== el));
    } else {
      setOpenedGroups([...openedGroups, el]);
    }
  };

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

  const getColor = (el) =>
    subGroupField?.attributes?.options?.find((item) => item?.value === el)
      ?.color ?? "";

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };

  const boardSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

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

  const boardMutation = useGetBoardMutation(
    {
      onSuccess: (data) => {
        setCount(data?.data?.count ?? 0);
        if (offset === 0) {
          setBoardData(data?.data?.response ?? {});
        } else {
          const newData = data?.data?.response;
          if (!newData) return;

          setBoardData((prev) => {
            if (subGroupById) {
              return getMergedDataSubgroup({ newData, prev });
            } else {
              return getMergedDataGroup({ newData, prev });
            }
          });
        }

        setLoadingData(false);
      },
    },
    tableSlug
  );

  const mutateBoardData = (offsetProp) => {
    const fields = [
      ...visibleColumns
        ?.filter((item) => {
          if (item?.type === "LOOKUP" || item?.type === "LOOKUPS") {
            return view?.columns?.includes(item?.relation_id);
          } else {
            return view?.columns?.includes(item?.id);
          }
        })
        ?.map((el) => el?.slug),
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
        limit,
        offset: offsetProp ?? offset,
        fields: fields,
        search: boardSearch,
        view_fields: checkedColumns ?? [],
        ...list?.[tableSlug]?.[view?.id],
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
        setSubgroupsQueue([data?.data?.subgroups[0]] ?? []);
      },
    },
    tableSlug
  );

  const loader = boardStructureMutation.isLoading;

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
    if (subGroupById && currentSubgroupIndex < subgroupsQueue.length) {
      const currentSubgroup = subgroupsQueue[currentSubgroupIndex];

      if (boardData[currentSubgroup?.name]) {
        const dataLength = Object.values(
          boardData[currentSubgroup?.name]
        ).flat().length;

        if (dataLength >= currentSubgroup.count) {
          setCurrentSubgroupIndex((prev) => prev + 1);
        } else {
          setOffset((prev) => prev + limit);
        }
      }
    }
  }, [boardData]);

  const mutateBoardStructure = () => {
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
  };

  const refetchAfterChangeBoard = () => {
    mutateBoardStructure();
    setOffset(0);
  };

  useEffect(() => {
    mutateBoardStructure();
    setOffset(0);
  }, [subGroupById, groupFieldId]);

  // groupField, subGroupFieldSlug, subGroupById

  useEffect(() => {
    setOpenedGroups(subGroups?.map((el) => el?.name));
  }, [subGroups]);

  useEffect(() => {
    lastGroupItem.current = lastGroupArr?.[lastGroupArr?.length - 1];
  }, [lastGroupArr]);

  function isInViewportOrScrolledToTop(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.bottom <= 0 ||
      (rect.bottom > 0 &&
        rect.top <
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth))
    );
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.top <
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  const handleSetOffsetOnScroll = throttle(() => {
    const elSubGroups = boardRef.current?.querySelectorAll(`[data-sub-group]`);

    if (elSubGroups.length) {
      elSubGroups?.forEach((item, index) => {
        const subGroup = subGroups.find(
          (subGroupItem) => subGroupItem?.name === item?.dataset?.subGroup
        );

        const isElementInViewport = isInViewport(item);

        if (isElementInViewport) {
          flushSync(() => {
            setSubgroupsQueue((prev) => {
              if (prev?.find((item) => item?.name === subGroup?.name)) {
                return prev;
              } else {
                setOffset((prev) => prev + limit);
                return [...prev, subGroup];
              }
            });
          });
        }
      });
    }
  }, 1500);

  const handleSetOffsetOnScrollGroup = throttle(() => {
    const lastCard = boardRef.current?.querySelector(
      `[data-guid = "${lastGroupItem?.current?.guid}"]`
    );

    const isLastElementInViewport = isInViewportOrScrolledToTop(lastCard);

    const boardDataLength = Object.values(boardData).flat().length;

    if (isLastElementInViewport && !loadingData && boardDataLength < count) {
      setOffset((prev) => prev + limit);
      setLoadingData(true);
    }
  }, 1000);

  useEffect(() => {
    if (!subGroupById && boardStructureMutation.isSuccess) {
      mutateBoardData();
    }
  }, [
    offset,
    groupField,
    subGroupField,
    subGroupFieldSlug,
    boardStructureMutation.isSuccess,
  ]);

  const isFirstGet = useRef(true);

  useEffect(() => {
    if (
      subGroupById &&
      !isFirstGet.current &&
      boardStructureMutation.isSuccess
    ) {
      mutateBoardData();
    } else {
      isFirstGet.current = false;
    }
  }, [offset, groupField, subGroupField, subGroupFieldSlug, subgroupsQueue]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (offset === 0) {
      mutateBoardData();
    } else {
      setOffset(0);
    }
  }, [list, searchText]);

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

      if (subGroupById) {
        handleSetOffsetOnScroll();
      } else {
        handleSetOffsetOnScrollGroup();
      }
    };

    board.addEventListener("scroll", onScroll);

    return () => {
      board.removeEventListener("scroll", onScroll);
    };
  }, [boardRef.current, fixedElement.current, boardData]);

  // useEffect(() => {
  //   setOffset(0);
  // }, [subGroupById, groupFieldId]);

  return {
    loader,
    new_list,
    tableSlug,
    onDrop,
    groups,
    groupField,
    getGroupFieldLabel,
    navigateToCreatePage,
    groupsCounts,
    isFilterOpen,
    subGroupById,
    handleToggle,
    openedGroups,
    getColor,
    subGroupField,
    getSubgroupFieldLabel,
    setBoardData,
    computedColumnsFor,
    setOpenDrawerModal,
    setSelectedRow,
    setDateInfo,
    setDefaultValue,
    getGroupCounts,
    subGroupFieldSlug,
    projectInfo,
    openDrawerModal,
    selectedRow,
    layout,
    selectedViewType,
    setSelectedViewType,
    navigateToEditPage,
    dateInfo,
    defaultValue,
    fixedElement,
    boardRef,
    t,
    isOnTop,
    subGroups,
    boardData,
    refetchAfterChangeBoard,
  };
};

const getMergedDataSubgroup = ({ newData, prev }) => {
  const merged = { ...prev };

  for (const authorId in newData) {
    const newStatuses = newData[authorId];

    if (!merged[authorId]) {
      merged[authorId] = {};
    }

    for (const status in newStatuses) {
      const newItems = newStatuses[status];
      const existingItems = merged[authorId][status] || [];

      const combined = [...existingItems, ...newItems];

      merged[authorId][status] = combined;
    }
  }
  return merged;
};

const getMergedDataGroup = ({ newData, prev }) => {
  const merged = { ...prev };

  for (const statusKey in newData) {
    const existing = prev[statusKey] || [];
    const incoming = newData[statusKey] || [];

    merged[statusKey] = [...existing, ...incoming];
  }

  return merged;
};

// const queryGenerator = (groupField, filters = {}, lan) => {
//   if (!groupField)
//     return {
//       queryFn: () => {},
//     };

//   const filterValue = filters[groupField.slug];
//   const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

//   if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
//     return {
//       queryKey: ["GET_GROUP_OPTIONS", groupField.id],
//       queryFn: () =>
//         groupField?.attributes?.options?.map((el) => ({
//           label: el.label,
//           value: el.value,
//           slug: groupField?.slug,
//         })),
//     };
//   }
//   if (groupField?.type === "STATUS") {
//     return {
//       queryKey: ["GET_GROUP_OPTIONS", groupField.id],
//       queryFn: () => [
//         ...groupField?.attributes?.progress?.options?.map((el) => ({
//           label: el.label,
//           value: el.label,
//           slug: el.label,
//           color: el?.color,
//         })),
//         ...groupField?.attributes?.todo?.options?.map((el) => ({
//           label: el.label,
//           value: el.label,
//           slug: el.label,
//           color: el?.color,
//         })),
//         ...groupField?.attributes?.complete?.options?.map((el) => ({
//           label: el.label,
//           value: el.label,
//           slug: el.label,
//           color: el?.color,
//         })),
//       ],
//     };
//   }

//   if (groupField?.type === "LOOKUP") {
//     const queryFn = () =>
//       constructorObjectService.getListV2(groupField.table_slug, {
//         data: computedFilters ?? {},
//       });

//     return {
//       queryKey: [
//         "GET_OBJECT_LIST_ALL",
//         { tableSlug: groupField.table_slug, filters: computedFilters },
//       ],
//       queryFn,
//       select: (res) => {
//         return res?.data?.response?.map((el) => ({
//           label: getRelationFieldTabsLabel(groupField, el, lan),
//           value: el.guid,
//           slug: groupField?.slug,
//         }));
//       },
//     };
//   }
// };
