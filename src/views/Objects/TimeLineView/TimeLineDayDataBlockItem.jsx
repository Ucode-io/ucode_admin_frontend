import { addDays, format } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Moveable from "react-moveable";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import { showAlert } from "../../../store/alert/alert.thunk";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";
import CellElementGenerator from "../../../components/ElementGenerators/CellElementGenerator";
import { generateID } from "../../../utils/generateID";

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
}) {
  const ref = useRef();
  const { tableSlug } = useParams();
  const [target, setTarget] = useState();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
    setSelectedRow(data);
  };

  const levelGroupByOne = useMemo(() => {
    if (groupbyFields?.[0]?.type === "SINGLE_LINE") {
      const a = groupByList?.find((group) => group?.label === data?.[groupbyFields?.[0]?.slug]);

      return groupByList?.indexOf(a);
    } else {
      const a = groupByList?.find((group) => group?.guid === data?.[`${groupbyFields?.[0]?.table_slug}_id_data`]?.guid);

      return groupByList?.indexOf(a);
    }
  }, [groupByList, data, groupbyFields]);

  const levelGroupByTwo = useMemo(() => {
    let qty = 0;

    groupByList?.forEach((group) => {
      qty++;
      group?.options?.forEach((option) => {
        qty++;
        if (option?.guid === data?.[`${groupbyFields?.[1]?.table_slug}_id_data`]?.guid) {
          return qty;
        }
      });
    });

    return qty;
  }, [groupByList, data, groupbyFields]);

  const level = useMemo(() => {
    if (view?.group_fields?.length === 0) {
      return levelIndex;
    } else if (view?.group_fields?.length === 1) {
      return levelGroupByOne;
    } else if (view?.group_fields?.length === 2) {
      return levelGroupByTwo - 1;
    }
  }, [levelIndex, levelGroupByOne, levelGroupByTwo, view]);

  const [frame] = useState({
    translate: [0, 0],
  });

  const startDate = useMemo(() => {
    return datesList && calendar_from_slug
      ? datesList.findIndex((date) => format(new Date(date), "dd.MM.yyyy") === format(new Date(data[calendar_from_slug]), "dd.MM.yyyy"))
      : null;
  }, [datesList, calendar_from_slug, data]);

  const differenceInDays = useMemo(() => {
    const days = Math.ceil((new Date(data[calendar_to_slug]) - new Date(data[calendar_from_slug])) / (1000 * 60 * 60 * 24));
    return days;
  }, [data, calendar_from_slug, calendar_to_slug]);

  useEffect(() => {
    if (!ref.current) return null;
    setTarget(ref.current);
  }, [ref, view, data, calendar_from_slug, calendar_to_slug, groupbyFields, visible_field, groupByList, levelGroupByOne, levelGroupByTwo, levelIndex, datesList, zoomPosition]);

  const onDragEndToUpdate = (position, width) => {
    if (!position) return null;

    let newDatePosition = [];

    if (position.translate[0] < 0) {
      newDatePosition = [
        addDays(new Date(data[calendar_from_slug]), (-position.translate[0] * -1) / (zoomPosition * 30)),
        addDays(new Date(data[calendar_to_slug]), (-position.translate[0] * -1) / (zoomPosition * 30)),
      ];
    } else if (position.translate[0] > 0) {
      newDatePosition = [
        addDays(new Date(data[calendar_from_slug]), position.translate[0] / (zoomPosition * 30)),
        addDays(new Date(data[calendar_to_slug]), position.translate[0] / (zoomPosition * 30)),
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
        dispatch(showAlert("Успешно обновлено", "success"));
      });
  };

  const onResizeEndToUpdate = (position, width) => {
    if (!position) return null;
    let newDatePosition = [datesList[position.drag.left / (zoomPosition * 30)], addDays(datesList[position.drag.left / (zoomPosition * 30)], width / (zoomPosition * 30))];
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
        dispatch(showAlert("Успешно обновлено", "success"));
      });
  };

  const onDrag = ({ target, beforeTranslate }) => {
    if (beforeTranslate[1] < 0) return null;
    const [x, y] = beforeTranslate;
    target.style.transform = `translate(${x}px, 0)`;
    setFocusedDays([datesList[startDate + Math.round(x / (zoomPosition * 30))], addDays(datesList[startDate + Math.round(x / (zoomPosition * 30))], differenceInDays - 1)]);
  };

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate;
      onDragEndToUpdate(lastEvent, lastEvent.width);
      setFocusedDays([]);
    }
  };

  // ----------RESIZE ACTIONS----------------------

  const onResize = ({ target, width, drag }) => {
    const beforeTranslate = drag.beforeTranslate;
    if (beforeTranslate[1] < 0) return null;
    target.style.width = `${width}px`;
    target.style.transform = `translateX(${beforeTranslate[0]}px)`;
    setFocusedDays([
      datesList[startDate + Math.round(beforeTranslate[0] / (zoomPosition * 30))],
      addDays(datesList[startDate + Math.round(beforeTranslate[0] / (zoomPosition * 30))], width / (zoomPosition * 30) - 1),
    ]);
  };

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate;
      onResizeEndToUpdate(lastEvent, lastEvent.width);
      setFocusedDays([]);
    }
  };
console.log('first', data)
  return (
    <>
      <div
        className={styles.dataBlock}
        style={{
          top: `${level * 32 + 64}px`,
          left: `${startDate * (zoomPosition * 30)}px`,
          width: `${zoomPosition * 30 * differenceInDays}px`,
          cursor: "pointer",
          display: startDate === -1 || level === -1 ? "none" : "block",
        }}
        onClick={handleOpen}
        ref={ref}
        key={data?.id_order}
      >
        <div
        className={styles.dataBlockInner}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {/* <p>{data[visible_field]}</p> */}
          <CellElementGenerator row={data} field={computedColumnsFor?.find((field) => field?.slug === visible_field)} />
        </div>
      </div>
      <ModalDetailPage open={open} setOpen={setOpen} selectedRow={selectedRow} />

      {startDate === -1 || level === -1 ? (
        ""
      ) : (
        <Moveable
          target={target}
          className="moveable3"
          key={`${zoomPosition}${data?.guid}`}
          draggable
          resizable
          throttleDrag={zoomPosition * 30}
          throttleResize={zoomPosition * 30}
          keepRatio={false}
          origin={false}
          renderDirections={["w", "e"]}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      )}
    </>
  );
}
