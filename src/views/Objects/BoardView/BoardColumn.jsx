import {Add} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import constructorObjectService from "../../../services/constructorObjectService";
import { applyDrag, applyDragIndex } from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import BoardModalDetailPage from "./components/BoardModaleDetailPage";
import MultiselectCellColoredElement from "../../../components/ElementGenerators/MultiselectCellColoredElement";
import DrawerDetailPage from "../DrawerDetailPage";
import { useProjectGetByIdQuery } from "../../../services/projectService";
import { useSelector } from "react-redux";
import layoutService from "../../../services/layoutService";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import useDebounce from "../../../hooks/useDebounce";
import { getColumnIcon } from "../../table-redesign/icons";
import { ColumnHeaderBlock } from "./components/ColumnHeaderBlock";

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
}) => {
  const projectId = useSelector((state) => state.company?.projectId);
  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];

  const isStatusType = selectedGroupField?.type === "STATUS";

  const { tableSlug, appId } = useParams();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState();
  const [index, setIndex] = useState();

  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [defaultValue, setDefaultValue] = useState(null);

  const [openDrawerModal, setOpenDrawerModal] = useState(false);
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

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

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
    if (result) setComputedData(result);
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
  // const color =
  //   tab?.color ||
  //   field?.attributes?.options?.find((item) => item?.value === tab?.value)
  //     ?.color;

  // const refetch = () => {
  //   queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
  //   queryClient.refetchQueries(["GET_TABLE_INFO"]);
  // };

  // const fixedElement = useRef(null);

  // useEffect(() => {
  //   const board = boardRef.current;
  //   const el = fixedElement.current;
  //   if (!board || !el) return;

  //   const onScroll = () => {
  //     el.style.top = `${board.scrollTop}px`;
  //   };

  //   board.addEventListener("scroll", onScroll);

  //   return () => {
  //     board.removeEventListener("scroll", onScroll);
  //   };
  // }, []);

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
        }}
      >
        {!subGroupById && (
          <ColumnHeaderBlock
            field={field}
            tab={tab}
            computedData={computedData}
            boardRef={boardRef}
            navigateToCreatePage={navigateToCreatePage}
            fixed
          />
        )}

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
          {computedData?.length > 0 ? (
            computedData.map((el) => (
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
          navigateToEditPage={() => {}}
          dateInfo={dateInfo}
          defaultValue={defaultValue}
        />
      </MaterialUIProvider>
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
