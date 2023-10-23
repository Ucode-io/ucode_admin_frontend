import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { format } from "date-fns";
import Moveable from "react-moveable";

export default function TimeLineDayDataBlock({ data, fieldsMap, view, tabs, datesList, zoomPosition }) {
  const detectDayName = (date) => {
    const dayName = format(date, "EEEE");
    if (dayName === "Saturday" || dayName === "Sunday") return true;
    return false;
  };

  const [frame] = useState({
    translate: [0, 0],
  });

  const ref = useRef();

  const [target, setTarget] = useState();

  useEffect(() => {
    if (!ref?.current) return null;
    setTarget(ref.current);
  }, [ref]);

  const onPositionChange = (position, width) => {
    if (!position || position.translate[1] < 0) return null;

    const beginIndex = Math.floor((position.translate[1] + 2) / 40);
    const endIndex = Math.ceil((position.translate[1] + width) / 40);

    // const startTime = computeTime(beginIndex);
    // const endTime = computeTime(endIndex);

    // const computedData = {
    //   ...info,
    //   [view.calendar_from_slug]: startTime,
    //   [view.calendar_to_slug]: endTime,
    //   calendar: {
    //     ...info.calendar,
    //     elementFromTime: startTime,
    //     elementToTime: endTime,
    //   },
    // };

    // constructorObjectService
    //   .update(tableSlug, {
    //     data: computedData,
    //   })
    //   .then((res) => {
    //     setInfo(computedData);
    //   });
  };

  const onDragStart = (e) => {
    e.set([0, frame.translate[1] > 0 ? frame.translate[1] : 0]);
  };

  const onDrag = ({ target, beforeTranslate }) => {
    if (beforeTranslate[1] < 0) return null;
    target.style.transform = `translateX(${beforeTranslate[1]}px)`;
  };

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate;
      onPositionChange(lastEvent, lastEvent.height);
    }
  };

  // ----------RESIZE ACTIONS----------------------

  const onResizeStart = (e) => {
    e.setOrigin(["%", "%"]);
    e.dragStart && e.dragStart.set(frame.translate);
  };

  const onResize = ({ target, width, drag }) => {
    const beforeTranslate = drag.beforeTranslate;
    if (beforeTranslate[1] < 0) return null;
    target.style.width = `${width}px`;
    // target.style.transform = `translateX(${beforeTranslate[1]}px)`;
    // if (height <= 40) setIsSingleLine(true);
    // else setIsSingleLine(false);
  };

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate;
      onPositionChange(lastEvent.drag, lastEvent.height);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.days}
          style={{
            display: "flex",
          }}
        >
          {datesList &&
            datesList.map((date) => (
              <div
                className={`${styles.rowItem} ${detectDayName(date) ? styles.dayOff : ""}`}
                style={{
                  minWidth: `${zoomPosition * 30}px`,
                }}
              >
                {format(new Date(), "dd.MM.yyyy") === format(date, "dd.MM.yyyy") && <div className={styles.today} />}
              </div>
            ))}
        </div>

        <div className={styles.datas}>
          <div className={styles.dataBlock} ref={ref}>
            title
          </div>
        </div>
      </div>

      <Moveable
        target={target}
        className="moveable3"
        draggable
        resizable
        throttleDrag={60}
        throttleResize={60}
        keepRatio={false}
        origin={false}
        renderDirections={["w", "e"]}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
    </>
  );
}
