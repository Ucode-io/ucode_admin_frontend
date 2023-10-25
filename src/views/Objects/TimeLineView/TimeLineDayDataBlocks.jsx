import { format } from "date-fns";
import React, { useState } from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import styles from "./styles.module.scss";
import CustomPopoverForTimeLine from "./CustomPopoverForTimeLine";
import TimeLineDays from "./TimeLineDays";

export default function TimeLineDayDataBlock({
  data,
  fieldsMap,
  setFocusedDays,
  view,
  tabs,
  datesList,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  selectedType,
}) {
  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.days}
          style={{
            display: "flex",
          }}
        >
          {datesList && datesList.map((date) => <TimeLineDays date={date} zoomPosition={zoomPosition} selectedType={selectedType} />)}
        </div>

        {calendar_from_slug && calendar_to_slug && (
          <div className={styles.datas}>
            {data.map((item, index) => (
              <TimeLineDayDataBlockItem
                data={item}
                level={index}
                setFocusedDays={setFocusedDays}
                datesList={datesList}
                view={view}
                zoomPosition={zoomPosition}
                calendar_from_slug={calendar_from_slug}
                calendar_to_slug={calendar_to_slug}
                visible_field={visible_field}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
