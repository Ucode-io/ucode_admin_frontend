import React, { useRef } from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import styles from "./styles.module.scss";
import TimeLineDayDataBlock from "./TimeLineDayDataBlock";
import { addDays, setDate } from "date-fns";

export default function TimeLineBlock({ data, fieldsMap, datesList, view, tabs, zoomPosition, setDateFilters, dateFilters }) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;

    if (scrollLeft + clientWidth >= scrollWidth) {
      // console.log("ssssssss End of scrolling");
      const newDate = [dateFilters[0], addDays(dateFilters[1], 10)];
      setDateFilters(newDate);
    }

    // if (scrollLeft === 0) {
    //   // console.log("ssssssss Start of scrolling");
    //   const newDate = [addDays(dateFilters[0], -10), dateFilters[1]];
    //   setDateFilters(newDate);
    // }
  };

  return (
    <div className={styles.gantt} ref={scrollContainerRef} onScroll={handleScroll}>
      <TimeLineDatesRow datesList={datesList} zoomPosition={zoomPosition} />

      <TimeLineDayDataBlock zoomPosition={zoomPosition} data={data} fieldsMap={fieldsMap} view={view} tabs={tabs} datesList={datesList} />
    </div>
  );
}
