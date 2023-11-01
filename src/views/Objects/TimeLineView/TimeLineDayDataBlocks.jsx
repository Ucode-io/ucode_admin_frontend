import React from "react";
import TimeLineDayDataBlockItem from "./TimeLineDayDataBlockItem";
import TimeLineDays from "./TimeLineDays";
import styles from "./styles.module.scss";

export default function TimeLineDayDataBlock({
  data,
  fieldsMap,
  setFocusedDays,
  view,
  tabs,
  computedColumnsFor,
  datesList,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  groupbyFields,
  visible_field,
  selectedType,
  groupByList,
}) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.days}>{datesList && datesList.map((date) => <TimeLineDays date={date} zoomPosition={zoomPosition} selectedType={selectedType} />)}</div>

        {calendar_from_slug && calendar_to_slug && (
          <div className={styles.datas}>
            {data.map((item, index) => (
              <TimeLineDayDataBlockItem
                computedColumnsFor={computedColumnsFor}
                groupbyFields={groupbyFields}
                data={item}
                levelIndex={index}
                groupByList={groupByList}
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
