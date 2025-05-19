import {Add} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import constructorObjectService from "../../../services/constructorObjectService";
import { applyDrag } from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import useDebounce from "../../../hooks/useDebounce";

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
  setGroupCounts,
  searchText,
  searchField,
}) => {
  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];

  const isStatusType = selectedGroupField?.type === "STATUS";

  const { tableSlug, appId } = useParams();
  const queryClient = useQueryClient();

  const [index, setIndex] = useState();

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

  const { mutate } = useMutation(
    ({ data, index }) => {
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

  const mutateDrop = useDebounce(({ data, index }) => {
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
    let dropResultTemp = { ...dropResult };

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
    if (result) {
      setComputedData(result);
      if (!subGroupById) {
        setGroupCounts((prev) => {
          return {
            ...prev,
            [tab?.slug]: result.length,
          };
        });
      } else {
        if (dropResult?.removedIndex !== null) {
          setGroupCounts((prev) => {
            return {
              ...prev,
              [tab?.slug]: prev[tab?.slug] - 1,
            };
          });
        } else {
          setGroupCounts((prev) => {
            return {
              ...prev,
              [tab?.slug]: prev[tab?.slug] + 1,
            };
          });
        }
      }
    }
    setIndex(dropResult?.addedIndex);
    if (result?.length >= computedData?.length) {
      mutateDrop({ data: dropResult.payload, index: dropResult.addedIndex });
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

  const navigateToEditPage = (el) => {
    setOpenDrawerModal(true);
    setSelectedRow(el);
    setDateInfo({});
    setDefaultValue({});
  };
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
  const field = computedColumnsFor?.find((field) => field?.slug === tab?.slug);

  // const hasColor = tab?.color || field?.attributes?.has_color;
  const color =
    tab?.color ||
    field?.attributes?.options?.find((item) => item?.value === tab?.value)
      ?.color;

  // const refetch = () => {
  //   queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
  //   queryClient.refetchQueries(["GET_TABLE_INFO"]);
  // };

  const fixedElement = useRef(null);

  useEffect(() => {
    const board = boardRef.current;
    const el = fixedElement.current;
    if (!board || !el) return;

    const onScroll = () => {
      el.style.top = `${board.scrollTop}px`;
    };

    board.addEventListener("scroll", onScroll);

    return () => {
      board.removeEventListener("scroll", onScroll);
    };
  }, []);

  // const color =
  //   tab?.color ||
  //   field?.attributes?.options?.find((item) => item?.value === tab?.value)
  //     ?.color;

  const filteredComputedData = searchText
    ? computedData?.filter((item) =>
        item[searchField?.slug]
          ?.toLowerCase()
          .includes(searchText?.toLowerCase())
      )
    : computedData;

  return (
    <>
      <div
        className={styles.column}
        style={{
          backgroundColor: color ? color + "08" : "rgba(84, 72, 49, 0.04)",
        }}
      >
        {/* {!subGroupById && (
          
        )} */}
        {/* {(!subGroupById || subGroupIndex === 0) && (
          <ColumnHeaderBlock
            field={field}
            tab={tab}
            computedData={computedData}
            boardRef={boardRef}
            navigateToCreatePage={navigateToCreatePage}
            fixed
          />
        )} */}
        {/* <div
          ref={fixedElement}
          className={`${cls.columnHeaderBlock} column-header`}
        >
          <div className={cls.leftSide}>
            <div className={cls.title}>
              <span
                style={{
                  background: hasColor ? color + 33 : "rgb(139, 150, 160)",
                  color: hasColor ? color - 50 : "#fff",
                }}
                className={cls.tabBlockStatus}
              >
                <span
                  className={cls.dot}
                  style={{ background: color ? color : "rgb(78, 84, 90)" }}
                />
                {tab.label}
              </span>
            </div>
            <div className={cls.counter}>{computedData?.length || 0}</div>
          </div>
          <div className={cls.rightSide}>
            <IconButton
              className={cls.addButton}
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCreatePage({ tab });
              }}
            >
              <Add />
            </IconButton>
          </div>
        </div> */}

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
          animationDuration={300}
        >
          {filteredComputedData?.length > 0 ? (
            filteredComputedData.map((el) => (
              <Draggable
                key={el.guid}
                index={index}
                className={styles.cardWrapper}
              >
                <div
                  className={styles.card}
                  key={el.guid}
                  onClick={() => navigateToEditPage(el)}
                >
                  {viewFields.map((field) => (
                    <BoardPhotoGenerator
                      key={field.id}
                      field={field}
                      el={el}
                      imgProps={{
                        style: {
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                        },
                        width: "260",
                        height: "200",
                      }}
                      style={{
                        overflow: "hidden",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    />
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
                      showFieldLabel
                      hintPosition={columnIndex === 0 ? "top" : "left"}
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
            style={{ height: "41px" }}
            id={`addBoardItem`}
            variant="contain"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigateToCreatePage();
            }}
          >
            <Add /> Add new
          </Button>
        </div>
      </div>
      {/* <BoardModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      /> */}
    </>
  );
};

export default BoardColumn;
