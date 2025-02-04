import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, {useMemo} from "react";
import styles from "./styles.module.scss";
import TimeLineDayBlock from "./TimeLineDayBlock";

export default function TimeLineDatesRow({
  datesList,
  zoomPosition,
  selectedType,
  focusedDays,
}) {
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

  const computedWeekList = useMemo(() => {
    const result = {};
    datesList.forEach((date) => {
      const weekStart = startOfWeek(date, {weekStartsOn: 1});
      const weekEnd = endOfWeek(date, {weekStartsOn: 1});

      const day = format(date, "dd/EEEE");

      if (result[weekStart]) result[weekStart].days.push(day);
      else
        result[weekStart] = {
          week: format(weekStart, "w"),
          days: [day],
          weekDays: [weekStart, weekEnd],
        };
    });

    return Object.values(result);
  }, [datesList]);

  const computedMonthList = useMemo(() => {
    const result = {};
    const referenceDate = datesList.length ? datesList[0] : new Date();

    for (let i = -1; i <= 2; i++) {
      const monthStart = startOfMonth(addMonths(referenceDate, i));
      const monthEnd = endOfMonth(monthStart);
      const month = format(monthStart, "MMMM yyyy");

      result[month] = {
        month,
        monthDays: [monthStart.toISOString(), monthEnd.toISOString()],
      };
    }

    return Object.values(result);
  }, [datesList]);

  console.log("selectedType", selectedType);
  return (
    <div
      className={styles.datesRow}
      style={{
        borderRight:
          selectedType === "month" ? "1px solid #e0e0e0" : "1px solid #e0e0e0",
        position: "sticky",
        left: 0,
        top: 0,
        background: "#fff",
        zIndex: 4,
      }}>
      {/* <div className={styles.mockBlock} /> */}

      {computedDatesList.map(({month, days}) => (
        <div
          className={styles.dateBlock}
          style={{
            display: selectedType === "day" ? "block" : "flex",
          }}>
          {selectedType === "day" || selectedType === "month" ? (
            <>
              <div className={styles.monthBlock}>
                <span className={styles.monthText}>{month}</span>
              </div>

              <div
                className={styles.daysRow}
                style={{
                  height: selectedType === "month" ? 0 : "auto",
                }}>
                {days?.map((day) => (
                  <TimeLineDayBlock
                    day={day}
                    focusedDays={focusedDays}
                    zoomPosition={zoomPosition}
                    selectedType={selectedType}
                  />
                ))}
              </div>
            </>
          ) : selectedType === "week" ? (
            computedWeekList.map(({week, days, weekDays}) => (
              <div className={styles.weekBlock}>
                <div
                  className={styles.weekNumber}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "32px",
                    width: `${days.length > 2 ? "100%" : zoomPosition * 30}px`,
                    border: "1px solid #e0e0e0",
                  }}>
                  {days.length > 2 ? (
                    `${format(weekDays[0], "dd/EEEE") + " - " + format(weekDays[1], "dd/EEEE")}`
                  ) : (
                    <marquee>
                      {format(weekDays[0], "dd/EEEE") +
                        " - " +
                        format(weekDays[1], "dd/EEEE")}
                    </marquee>
                  )}
                </div>
                <div className={styles.daysRow}>
                  {days?.map((day) => (
                    <TimeLineDayBlock day={day} zoomPosition={zoomPosition} />
                  ))}
                </div>
              </div>
            ))
          ) : selectedType === "month" ? (
            computedMonthList.map(({month, monthDays}) => (
              <div key={month} className={styles.monthBlock}>
                <div
                  className={styles.monthHeader}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    borderBottom: "1px solid #e0e0e0",
                  }}>
                  {month}
                </div>
                <div className={styles.monthDays}>
                  {format(new Date(monthDays[0]), "dd/EEEE") +
                    " - " +
                    format(new Date(monthDays[1]), "dd/EEEE")}
                </div>
              </div>
            ))
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}
