import {addDays, format} from "date-fns";
import React, {useEffect, useMemo, useRef, useState} from "react";
import Moveable from "react-moveable";
import { useParams } from "react-router-dom";
import CellElementGenerator from "@/components/ElementGenerators/CellElementGenerator";
import constructorObjectService from "@/services/constructorObjectService";
import styles from "./styles.module.scss";
import { useQueryClient } from "react-query";
import useFilters from "@/hooks/useFilters";

const getTranslateXFromMatrix = (element) => {
  const transform = window.getComputedStyle(element).transform;
  if (transform === "none") return 0;

  const match = transform.match(/matrix.*\(([^,]+),[^,]+,[^,]+,[^,]+,([^,]+),/);
  return match ? parseFloat(match[2]) : 0;
};

export default function TimeLineDayDataBlockItem({
  data,
  levelIndex,
  setFocusedDays,
  datesList,
  groupbyFields,
  view,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  computedColumnsFor,
  visible_field,
  groupByList,
  selectedType,
  dateFilters,
  menuItem,
  fieldsMapPopup: fieldsMap,
  refetch = () => {},
  setLayoutType,
  navigateToDetailPage,
  setSelectedRow,
  setOpenDrawerModal,
}) {
  const ref = useRef();
  const { tableSlug, appId } = useParams();
  const { filters } = useFilters(tableSlug, view.id);
  const [target, setTarget] = useState();
  const queryClient = useQueryClient();
  const innerStartDate = useRef(null);

  const handleOpen = () => {
    setOpenDrawerModal(true);
    setSelectedRow(data);
  };

  const level = useMemo(() => {
    return levelIndex;
  }, [levelIndex]);

  const [frame] = useState({
    translate: [0, 0],
  });

  const startDate = useMemo(() => {
    return datesList && calendar_from_slug
      ? datesList?.findIndex((date) => {
          const currentDate = date ? new Date(date) : null;
          const selectedDate = data?.[calendar_from_slug]
            ? new Date(data?.[calendar_from_slug])
            : null;
          const isValidCurrentDate =
            currentDate instanceof Date && !isNaN(currentDate);
          const isValidSelectedDate =
            selectedDate instanceof Date && !isNaN(selectedDate);

          if (isValidCurrentDate && isValidSelectedDate) {
            return (
              format(currentDate, "dd.MM.yyyy") ===
              format(selectedDate, "dd.MM.yyyy")
            );
          }

          return false;
        })
      : null;
  }, [datesList, calendar_from_slug, data]);

  const datesListObj = useMemo(
    () =>
      Object.fromEntries(
        datesList.map((key) => [format(key, "dd.MM.yyyy"), key])
      ),
    [datesList]
  );

  const differenceInDays = useMemo(() => {
    const days = Math.ceil(
      (new Date(data?.[calendar_to_slug]) -
        new Date(data?.[calendar_from_slug])) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  }, [data, calendar_from_slug, calendar_to_slug]);

  useEffect(() => {
    if (!target && ref.current) {
      setTarget(ref.current);
    }
  }, [
    ref,
    view,
    data,
    calendar_from_slug,
    calendar_to_slug,
    groupbyFields,
    visible_field,
    groupByList,
    levelIndex,
    datesList,
    zoomPosition,
    target,
  ]);

  const targetRef = useRef(null);

  const onDragEndToUpdate = (position, width) => {
    if (!position) return null;

    let newDatePosition = [];

    if (position.translate[0] < 0) {
      newDatePosition = [
        addDays(
          new Date(data[calendar_from_slug]),
          (-position.translate[0] * -1) /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
        addDays(
          new Date(data[calendar_to_slug]),
          (-position.translate[0] * -1) /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
      ];
    } else if (position.translate[0] > 0) {
      newDatePosition = [
        addDays(
          new Date(data[calendar_from_slug]),
          position.translate[0] /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
        addDays(
          new Date(data[calendar_to_slug]),
          position.translate[0] /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
      ];
    }

    const computedData = {
      ...data,
      [calendar_from_slug]: newDatePosition[0],
      [calendar_to_slug]: newDatePosition[1],
    };

    constructorObjectService
      .update(tableSlug, {
        data: computedData,
      })
      .then((res) => {
        // dispatch(showAlert("Успешно обновлено", "success"));
        // queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
        queryClient.setQueryData(
          [
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            { tableSlug, filters, dateFilters, view },
          ],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.guid === computedData.guid ? computedData : item
              ),
            };
          }
        );
      });
  };

  const onResizeEndToUpdate = (position, width) => {
    if (!position) return null;
    let newDatePosition = [
      datesList[
        position.drag.left /
          (zoomPosition * (selectedType === "month" ? 20 : 30))
      ],
      addDays(
        datesList[
          position.drag.left /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ],
        width / (zoomPosition * (selectedType === "month" ? 20 : 30))
      ),
    ];
    const computedData = {
      ...data,
      [calendar_from_slug]: newDatePosition[0],
      [calendar_to_slug]: newDatePosition[1],
    };

    constructorObjectService.update(tableSlug, {
      data: computedData,
    });
    // .then((res) => {
    //   dispatch(showAlert("Успешно обновлено", "success"));
    // });
  };

  const onResizeEndToUpdate1 = (position, width) => {
    const x = getTranslateXFromMatrix(targetRef.current);
    if (!position) return null;
    let newDatePosition = [
      datesList[x / (zoomPosition * (selectedType === "month" ? 20 : 30))],
      addDays(
        datesList[x / (zoomPosition * (selectedType === "month" ? 20 : 30))],
        width / (zoomPosition * (selectedType === "month" ? 20 : 30))
      ),
    ];
    const computedData = {
      ...data,
      [calendar_from_slug]: newDatePosition[0],
      [calendar_to_slug]: newDatePosition[1],
    };

    constructorObjectService.update(tableSlug, {
      data: computedData,
    });
    // .then((res) => {
    //   dispatch(showAlert("Успешно обновлено", "success"));
    // });
  };

  const onDrag = ({ target, width, beforeTranslate }) => {
    if (beforeTranslate[1] < 0) return null;
    const [x] = beforeTranslate;
    target.style.transform = `translate(${x}px, 0)`;

    const roundedAppendDays = Math.round(
      beforeTranslate[0] / (zoomPosition * (selectedType === "month" ? 20 : 30))
    );

    innerStartDate.current = startDate + roundedAppendDays;

    setFocusedDays([
      datesList[startDate + roundedAppendDays],
      addDays(
        datesList[startDate + roundedAppendDays],
        width / (zoomPosition * 30) - 1
      ),
    ]);
  };

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate;
      onDragEndToUpdate(lastEvent, lastEvent.width);
      setFocusedDays([]);
    }
  };

  // ----------RESIZE ACTIONS----------------------

  const onResize = ({ target, width, drag, direction }) => {
    const beforeTranslate = drag.beforeTranslate;

    const minWidth = selectedType === "month" ? 20 : 60;

    if (beforeTranslate[1] < 0 || width < minWidth) return null;

    target.style.width = `${width}px`;

    if (direction[0] === -1) {
      target.style.transform = `translateX(${beforeTranslate[0]}px)`;
    }

    const roundedAppendDays = Math.round(
      beforeTranslate[0] / (zoomPosition * (selectedType === "month" ? 20 : 30))
    );

    innerStartDate.current = startDate + roundedAppendDays;

    setFocusedDays([
      datesList[innerStartDate.current || startDate + roundedAppendDays],
      addDays(
        datesList[innerStartDate.current || startDate + roundedAppendDays],
        width / (zoomPosition * 30) - 1
      ),
    ]);
  };

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      // frame.translate = lastEvent.drag.beforeTranslate;
      onResizeEndToUpdate1(lastEvent, lastEvent.width);
      setFocusedDays([]);
    }
  };

  const handleMouseEnter = () => {
    if (selectedType === "month") {
      setFocusedDays([
        datesList[innerStartDate.current || startDate],
        datesList[startDate + differenceInDays],
      ]);
    } else {
      setFocusedDays([
        datesList[innerStartDate.current || startDate],
        addDays(
          datesList[
            innerStartDate.current ||
              startDate +
                Math.round(
                  frame.translate[0] /
                    (zoomPosition * (selectedType === "month" ? 20 : 30))
                )
          ],
          ref.current.offsetWidth / (zoomPosition * 30) - 1
        ),
      ]);
    }
  };

  const handleMouseEnter1 = () => {
    if (selectedType === "month") {
      setFocusedDays([
        datesList[innerStartDate.current || startDate],
        datesList[startDate + differenceInDays],
      ]);
    } else {
      setFocusedDays([
        datesList[innerStartDate.current || startDate],
        addDays(
          datesList[
            (innerStartDate.current || startDate) +
              Math.round(
                frame.translate[0] /
                  (zoomPosition * (selectedType === "month" ? 20 : 30))
              )
          ],
          targetRef.current.offsetWidth / (zoomPosition * 30) - 1
        ),
      ]);
    }
  };

  const transformRef = useRef(
    startDate * (zoomPosition * (selectedType === "month" ? 20 : 30))
  );

  const initialRef = useRef({
    width: 0,
    transformX: 0,
  });

  const onDrag1 = ({ target, width, beforeTranslate, transform }) => {
    if (beforeTranslate[1] < 0) return null;
    const [x] = beforeTranslate;
    target.style.transform = `${transform?.split(" ")[0]} translateY(0) translate(${x}px, 0)`;

    const roundedAppendDays = Math.round(
      beforeTranslate[0] / (zoomPosition * (selectedType === "month" ? 20 : 30))
    );

    const style = window.getComputedStyle(target);

    const matrix = new DOMMatrixReadOnly(style.transform);

    initialRef.current = {
      width: target.offsetWidth,
      transformX: matrix.m41 || 0,
    };

    innerStartDate.current = Math.floor(initialRef.current.transformX / 60);

    setFocusedDays([
      datesList[startDate + roundedAppendDays],
      addDays(
        datesList[startDate + roundedAppendDays],
        width / (zoomPosition * 30) - 1
      ),
    ]);
  };

  const onResizeStart = ({ target }) => {
    const style = window.getComputedStyle(target);
    const matrix = new DOMMatrixReadOnly(style.transform);

    initialRef.current = {
      width: target.offsetWidth,
      transformX: matrix.m41 || 0,
    };
  };

  const onResize1 = ({ target, width, direction }) => {
    const { width: initialWidth, transformX } = initialRef.current;

    if (direction[0] === -1) {
      const dx = initialWidth - width;
      target.style.transform = `translateX(${transformX + dx}px)`;
      innerStartDate.current = (transformX + dx) / 60;
    }

    target.style.width = `${width}px`;
  };

  // if (data?.title === "Dropdown menu not displaying options") {
  //   console.log({
  //     width:
  //       zoomPosition * (selectedType === "month" ? 20 : 30) * differenceInDays,
  //   });
  //   console.log({ selectedType, differenceInDays, startDate });
  // }

  return (
    <>
      <div
        ref={targetRef}
        style={{
          visibility: startDate === -1 || level === -1 ? "hidden" : "visible",
          height: "100%",
          transform: `translateX(${startDate * (zoomPosition * (selectedType === "month" ? 20 : 30))}px)`,
          width: `${zoomPosition * (selectedType === "month" ? 20 : 30) * differenceInDays}px`,
        }}
      >
        <div
          className={styles.dataBlockInner}
          onClick={handleOpen}
          onMouseEnter={handleMouseEnter1}
        >
          {visible_field?.split("/")?.length > 1 ? (
            visible_field
              ?.split("/")
              ?.map((fieldItem) => (
                <CellElementGenerator
                  isTimelineVariant
                  row={data}
                  field={computedColumnsFor?.find(
                    (field) => field?.slug === fieldItem
                  )}
                  multiSelectClassName={styles.multiSelectBadge}
                />
              ))
          ) : (
            <CellElementGenerator
              isTimelineVariant
              row={data}
              field={computedColumnsFor?.find(
                (field) => field?.slug === visible_field?.split("/")?.[0]
              )}
            />
          )}
        </div>

        <Moveable
          className="moveable3"
          target={targetRef}
          draggable
          resizable
          edgeDraggable={false}
          startDragRotate={0}
          throttleDragRotate={0}
          throttleDrag={zoomPosition * (selectedType === "month" ? 20 : 30)}
          throttleResize={zoomPosition * (selectedType === "month" ? 20 : 30)}
          keepRatio={false}
          origin={false}
          renderDirections={["w", "e"]}
          onDrag={onDrag1}
          onDragEnd={onDragEnd}
          onResizeStart={onResizeStart}
          onResize={onResize1}
          onResizeEnd={onResizeEnd}
        />
      </div>

      {/* <div
        className={styles.dataBlock}
        style={{
          top:
            view?.attributes?.group_by_columns?.length === 0 &&
            `${level * 32}px`,
          left: `${startDate * (zoomPosition * (selectedType === "month" ? 20 : 30))}px`,
          width: `${zoomPosition * (selectedType === "month" ? 20 : 30) * differenceInDays}px`,
          cursor: "pointer",
          display: startDate === -1 || level === -1 ? "none" : "block",
        }}
        onClick={handleOpen}
        ref={ref}
        key={data?.id_order}
        onMouseEnter={handleMouseEnter}
      >
        <div className={styles.dataBlockInner}>
          {visible_field?.split("/")?.length > 1 ? (
            visible_field
              ?.split("/")
              ?.map((fieldItem) => (
                <CellElementGenerator
                  isTimelineVariant
                  row={data}
                  field={computedColumnsFor?.find(
                    (field) => field?.slug === fieldItem
                  )}
                  multiSelectClassName={styles.multiSelectBadge}
                />
              ))
          ) : (
            <CellElementGenerator
              isTimelineVariant
              row={data}
              field={computedColumnsFor?.find(
                (field) => field?.slug === visible_field?.split("/")?.[0]
              )}
            />
          )}
        </div>
      </div>
      {startDate === -1 || level === -1 ? (
        ""
      ) : (
        <Moveable
          target={target}
          className="moveable3"
          key={`${zoomPosition}${data?.guid}`}
          draggable
          resizable
          throttleDrag={zoomPosition * (selectedType === "month" ? 20 : 30)}
          throttleResize={zoomPosition * (selectedType === "month" ? 20 : 30)}
          keepRatio={false}
          origin={false}
          renderDirections={["w", "e"]}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      )} */}
    </>
  );
}
