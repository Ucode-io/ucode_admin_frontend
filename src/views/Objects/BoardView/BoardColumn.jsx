import {Add} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import useDebounce from "../../../hooks/useDebounce";
import constructorObjectService from "../../../services/constructorObjectService";
import {groupFieldActions} from "../../../store/groupField/groupField.slice";
import {applyDrag} from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";
import {useDispatch, useSelector} from "react-redux";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";

const BoardColumn = ({
  tab,
  data = [],
  fieldsMap,
  view = {},
  computedColumnsFor,
  menuItem,
  layoutType,
  setLayoutType,
  refetch: refetchListQueries,
  boardRef,
  index: columnIndex,
  subGroupById,
  subGroupData,
  subItem,
  subGroupFieldSlug,
  setOpenDrawerModal,
  setSelectedRow,
  setDateInfo,
  setDefaultValue,
  tableSlug,
  selectedView,
  projectInfo,
  setLoadings = () => {},
  setSelectedView = () => {},
}) => {
  const dispatch = useDispatch();
  const {menuId} = useParams();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState();
  const [searchParams] = useSearchParams();
  const viewId = searchParams.get("v") ?? view?.id;
  const new_router = localStorage.getItem("new_router") === "true";
  const initialTableInf = useSelector((state) => state.drawer.tableInfo);
  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];
  const isStatusType = selectedGroupField?.type === "STATUS";

  const [computedData, setComputedData] = useState(
    (subGroupById ? subGroupData : data).filter((el) => {
      if (isStatusType) {
        return el?.[selectedGroupField?.slug];
      } else {
        if (Array.isArray(el[tab.slug]))
          return el[tab.slug].includes(tab.value);
        return el[tab.slug] === tab.value;
      }
    })
  );

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  const {mutate} = useMutation(
    ({data, index}) => {
      const mutateData = {
        ...data,
        board_order: index + 1,
      };

      if (isStatusType) {
        mutateData[selectedGroupField?.slug] = tab.value;
      } else {
        mutateData[tab.slug] = tab.value;
      }

      return constructorObjectService.update(tableSlug, {
        data: mutateData,
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
      },
    }
  );

  const mutateDrop = useDebounce(({data, index}) => {
    const mutateData = {
      ...data,
      board_order: index + 1,
    };

    if (isStatusType) {
      mutateData[selectedGroupField?.slug] = tab.value;
    } else {
      mutateData[tab.slug] = tab.value;
    }

    constructorObjectService
      .update(tableSlug, {
        data: mutateData,
      })
      .then(() => {
        // queryClient.refetchListQueriesQueries(["GET_OBJECT_LIST_ALL"]);
        // refetchListQueries();
      });
  }, 0);

  // const {
  //   data: { layout } = {
  //     layout: [],
  //   },
  // } = useQuery({
  //   queryKey: [
  //     "GET_LAYOUT",
  //     {
  //       tableSlug,
  //     },
  //   ],
  //   queryFn: () => {
  //     return layoutService.getLayout(tableSlug, appId);
  //   },
  //   select: (data) => {
  //     return {
  //       layout: data ?? {},
  //     };
  //   },
  //   onError: (error) => {
  //     console.error("Error", error);
  //   },
  // });

  const onDrop = (dropResult) => {
    let dropResultTemp = {...dropResult};

    const payload = dropResultTemp.payload;

    if (dropResult?.addedIndex !== null && subGroupById) {
      payload[subGroupFieldSlug] = subItem;
    }

    if (isStatusType) {
      payload[selectedGroupField?.slug] = tab?.label;
    } else {
      if (Array.isArray(payload[tab.slug]))
        payload[tab.slug].includes(tab.value);
      payload[tab.slug] = tab.value;
    }

    payload["color"] = tab?.color || color;

    const result = applyDrag(computedData, dropResultTemp);
    if (result) setComputedData(result);
    setIndex(dropResult?.addedIndex);
    if (result?.length >= computedData?.length) {
      mutateDrop({data: dropResult.payload, index: dropResult.addedIndex});
    }
  };

  // const timerRef = useRef(null);

  // useEffect(() => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //   }

  //   if (onDropData) {
  //     const { dropResult, result } = onDropData;

  //     timerRef.current = setTimeout(() => {
  //       if (result?.length >= computedData?.length) {
  //         console.log("MUTATE");
  //         mutateDrop({
  //           data: dropResult.payload,
  //           index: dropResult.addedIndex,
  //         });
  //       }
  //     }, 2000);
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   };
  // }, [onDropData, computedData]);

  const viewFields = useMemo(() => {
    return view.columns?.map((id) => fieldsMap[id]).filter((el) => el) ?? [];
  }, [view, fieldsMap, data]);

  useEffect(() => {
    setComputedData(
      (subGroupById ? subGroupData : data).filter((el) => {
        if (isStatusType) {
          return el?.[selectedGroupField?.slug] === tab?.label;
        } else {
          if (Array.isArray(el[tab.slug]))
            return el[tab.slug].includes(tab.value);
          return el[tab.slug] === tab.value;
        }
      })
    );
  }, [data, subGroupById, subGroupData]);

  const navigateToCreatePage = (slug) => {
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

    if (subGroupById) {
      setDefaultValue((prev) => [
        prev,
        {
          field: subGroupFieldSlug,
          value: subItem,
        },
      ]);
    }
  };

  const navigateToEditPage = (row) => {
    setLoadings(true);
    setDateInfo({});
    setDefaultValue({});
    if (Boolean(view?.relation_table_slug)) {
      queryClient.refetchQueries([
        "GET_TABLE_VIEWS_LIST_RELATION",
        view?.relation_table_slug,
      ]);
      dispatch(
        groupFieldActions.addView({
          id: view?.id,
          label: view?.table_label,
          table_slug: view?.table_slug,
          relation_table_slug: view.relation_table_slug ?? null,
          is_relation_view: view?.is_relation_view,
          detailId: row?.guid,
        })
      );
      setSelectedView(view);
      setSelectedRow(row);
      dispatch(detailDrawerActions.setDrawerTabIndex(0));
      updateQueryWithoutRerender("p", row?.guid);
    } else {
      if (Boolean(new_router === "true")) {
        updateQueryWithoutRerender("p", row?.guid);
        if (view?.attributes?.url_object) {
          navigateToDetailPage(row);
        } else if (projectInfo?.new_layout) {
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          if (layoutType === "PopupLayout") {
            setSelectedRow(row);
            dispatch(detailDrawerActions.openDrawer());
          } else {
            navigateToDetailPage(row);
          }
        }
      } else {
        if (view?.attributes?.url_object) {
          navigateToDetailPage(row);
        } else if (projectInfo?.new_layout) {
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          if (layoutType === "PopupLayout") {
            setSelectedRow(row);
            dispatch(detailDrawerActions.openDrawer());
          } else {
            navigateToDetailPage(row);
          }
        }
      }
    }
  };

  // const navigateCreatePage = (row) => {
  //   if (projectInfo?.new_layout) {
  //     setSelectedRow(row);
  //     dispatch(detailDrawerActions.openDrawer());
  //   } else {
  //     if (layoutType === "PopupLayout") {
  //       setSelectedRow(row);
  //       dispatch(detailDrawerActions.openDrawer());
  //     } else {
  //       navigateToForm(tableSlug, "CREATE", {}, {}, menuId);
  //     }
  //   }
  // };

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

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      if (Boolean(new_router === "true"))
        navigate(`/${menuId}/detail?p=${row?.guid}`, {
          state: {
            viewId,
            tableSlug,
          },
        });
      else navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  const field = computedColumnsFor?.find((field) => field?.slug === tab?.slug);

  const color =
    tab?.color ||
    field?.attributes?.options?.find((item) => item?.value === tab?.value)
      ?.color;

  return (
    <>
      <div
        className={styles.column}
        style={{
          backgroundColor: color ? color + "08" : "rgba(84, 72, 49, 0.04)",
        }}>
        {/* {!subGroupById && (
          <ColumnHeaderBlock
            field={field}
            tab={tab}
            computedData={computedData}
            boardRef={boardRef}
            navigateToCreatePage={navigateToCreatePage}
            fixed
          />
        )} */}

        <Container
          groupName="subtask"
          getChildPayload={(i) => computedData[i]}
          onDrop={(e) => {
            onDrop(e);
          }}
          dropPlaceholder={{
            className: "drag-row-drop-preview",
            showOnTop: true,
            animationDuration: 150,
          }}
          style={{
            padding: "10px 8px 0 8px",
          }}
          animationDuration={300}>
          {computedData?.length > 0 ? (
            computedData.map((el) => (
              <Draggable
                key={el.guid}
                index={index}
                className={styles.cardWrapper}>
                <div
                  className={styles.card}
                  key={el.guid}
                  onClick={() => navigateToEditPage(el)}>
                  {viewFields.map((field) => (
                    <BoardPhotoGenerator key={field.id} field={field} el={el} />
                  ))}
                  {viewFields.map((field) => (
                    <BoardCardRowGenerator
                      key={field.id}
                      isStatus={field?.type === "STATUS"}
                      field={field}
                      el={el}
                      fieldsMap={fieldsMap}
                      slug={selectedGroupField?.slug}
                      columnIndex={columnIndex}
                    />
                  ))}
                </div>
              </Draggable>
            ))
          ) : (
            <Draggable
              key="placeholder"
              className={styles.draggablePlaceholder}
            />
          )}
        </Container>

        <div className={styles.columnFooterBlock}>
          <Button
            style={{height: "41px"}}
            id={`addBoardItem`}
            variant="contain"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigateToCreatePage();
            }}>
            <Add /> Add new
          </Button>
        </div>
      </div>
    </>
  );
};

export default BoardColumn;
