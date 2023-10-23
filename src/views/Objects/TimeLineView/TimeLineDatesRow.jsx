import { format } from "date-fns";
import React, { useMemo } from "react";
import styles from "./styles.module.scss";
import TimeLineDayBlock from "./TimeLineDayBlock";

export default function TimeLineDatesRow({ datesList, zoomPosition }) {
  const computedDatesList = useMemo(() => {
    const result = {};
    datesList.forEach((date) => {
      const month = format(date, "MMMM yyyy");

      const day = format(date, "dd/EEEE");

      if (result[month]) result[month].days.push(day);
      else
        result[month] = {
          month,
          days: [day],
        };
    });

    return Object.values(result);
  }, [datesList]);

  return (
    <div className={styles.datesRow}>
      {/* <div className={styles.mockBlock} /> */}

      {computedDatesList.map(({ month, days }) => (
        <div className={styles.dateBlock}>
          <div className={styles.monthBlock}>
            <span className={styles.monthText}>{month}</span>
          </div>

          <div className={styles.daysRow}>
            {days?.map((day) => (
              <TimeLineDayBlock day={day} zoomPosition={zoomPosition}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
