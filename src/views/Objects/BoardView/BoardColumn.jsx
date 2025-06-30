import {Add} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import constructorObjectService from "../../../services/constructorObjectService";
import { applyDrag } from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import useDebounce from "../../../hooks/useDebounce";
import { FIELD_TYPES } from "../../../utils/constants/fieldTypes";

const BoardColumn = ({
  group,
  boardData = [],
  fieldsMap,
  view = {},
  computedColumnsFor,
  boardRef,
  index: columnIndex,
  subGroupById,
  subItem,
  subGroupFieldSlug,
  setOpenDrawerModal,
  setSelectedRow,
  setDateInfo,
  setDefaultValue,
  searchText,
  columnsForSearch,
  groupSlug,
  getGroupCounts,
  setBoardData,
  groupItem,
  groupField,
}) => {
  const [computedBoardData, setComputedBoardData] = useState(boardData);

  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];

  const isStatusType = groupField?.type === FIELD_TYPES.STATUS;

  const { tableSlug } = useParams();

  const [index, setIndex] = useState();

  const mutateDrop = useDebounce((mutateData) => {
    constructorObjectService
      .update(tableSlug, {
        data: mutateData,
      })
      .then(() => {
        getGroupCounts();
      });
  }, 0);

  const onDrop = (dropResult) => {
    let dropResultTemp = { ...dropResult };

    const payload = dropResultTemp.payload;

    if (dropResult?.addedIndex !== null && subGroupById) {
      payload[subGroupFieldSlug] = subItem === "Unassigned" ? null : subItem;
    }

    payload["color"] = color;

    if (subGroupById && payload[subGroupFieldSlug] !== subItem) {
      payload[subGroupFieldSlug] = subItem === "Unassigned" ? null : subItem;
    }

    if (
      groupField?.type === FIELD_TYPES.LOOKUP ||
      groupField?.type === FIELD_TYPES.LOOKUPS
    ) {
      payload[groupField?.slug] =
        group?.name === "Unassigned" ? null : group?.name;
    } else if (groupField?.type === FIELD_TYPES.MULTISELECT) {
      payload[groupSlug] = group?.name === "Unassigned" ? null : [group?.name];
    } else {
      payload[groupSlug] = group?.name === "Unassigned" ? null : group?.name;
    }

    const result = applyDrag(boardData, dropResultTemp);

    setIndex(dropResult?.addedIndex);

    if (result) {
      setComputedBoardData(result);

      if (subGroupById) {
        setBoardData((prev) => {
          return {
            ...prev,
            [subItem]: {
              ...prev[subItem],
              [groupItem]: result,
            },
          };
        });
      } else {
        setBoardData((prev) => {
          return {
            ...prev,
            [groupItem]: result,
          };
        });
      }
    }

    if (
      result?.length >= boardData?.length &&
      dropResult?.addedIndex !== dropResult?.removedIndex
    ) {
      const mutateData = {
        ...dropResult.payload,
        board_order: dropResult.addedIndex + 1,
      };

      mutateDrop(mutateData);
    }
  };

  const viewFields = useMemo(() => {
    return view.columns?.map((id) => fieldsMap[id]).filter((el) => el) ?? [];
  }, [view, fieldsMap]);

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
        value: group?.name,
      });
    } else {
      setDefaultValue({
        field: group.name,
        value: group.name,
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
  const field = computedColumnsFor?.find((field) => field?.slug === groupSlug);

  const color = isStatusType
    ? field?.attributes?.todo?.options?.find(
        (item) => item?.label === group?.name
      )?.color ||
      field?.attributes?.complete?.options?.find(
        (item) => item?.label === group?.name
      )?.color ||
      field?.attributes?.progress?.options?.find(
        (item) => item?.label === group?.name
      )?.color
    : field?.attributes?.options?.find((item) => item?.label === group?.name)
        ?.color;

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

  // const filteredComputedData = viewSearch({
  //   columnsForSearch,
  //   computedData,
  //   searchText,
  // });

  const photoViewFields = viewFields.filter(
    (field) => field?.type === FIELD_TYPES.PHOTO
  );

  useEffect(() => {
    if (boardData?.length !== computedBoardData?.length) {
      setComputedBoardData(boardData);
    }
  }, [boardData]);

  return (
    <>
      <div
        className={styles.column}
        style={{
          backgroundColor: color ? color + "08" : "rgba(84, 72, 49, 0.04)",
        }}
      >
        <Container
          groupName="subtask"
          getChildPayload={(i) => computedBoardData[i]}
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
          {computedBoardData?.length > 0 ? (
            computedBoardData.map((el, boardDataIndex) => (
              <Draggable
                key={el.guid}
                index={index}
                className={styles.cardWrapper}
              >
                <div
                  className={styles.card}
                  key={el.guid}
                  onClick={() => navigateToEditPage(el)}
                  data-guid={el.guid}
                >
                  {photoViewFields.map((field) => (
                    <BoardPhotoGenerator
                      key={field.id}
                      field={field}
                      el={el}
                      imgProps={{
                        style: {
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
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
                    <>
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
                    </>
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
    </>
  );
};

export default BoardColumn;
