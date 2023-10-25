import { addDays } from "date-fns";
import React, { useRef, useState } from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import TimeLineDayDataBlock from "./TimeLineDayDataBlocks";
import styles from "./styles.module.scss";

export default function TimeLineBlock({
  data,
  fieldsMap,
  datesList,
  view,
  tabs,
  zoomPosition,
  setDateFilters,
  dateFilters,
  selectedType,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
}) {
  const scrollContainerRef = useRef(null);
  const [focusedDays, setFocusedDays] = useState([]);
console.log('focusedDays', focusedDays)
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
    <div
      className={styles.gantt}
      ref={scrollContainerRef}
      // onScroll={handleScroll}
    >
      <TimeLineDatesRow focusedDays={focusedDays} datesList={datesList} zoomPosition={zoomPosition} selectedType={selectedType} />

      <TimeLineDayDataBlock
      setFocusedDays={setFocusedDays}
        selectedType={selectedType}
        zoomPosition={zoomPosition}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        tabs={tabs}
        datesList={datesList}
        calendar_from_slug={calendar_from_slug}
        calendar_to_slug={calendar_to_slug}
        visible_field={visible_field}
      />
    </div>
  );
}
