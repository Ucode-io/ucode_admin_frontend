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
import {Popover, Typography} from "@mui/material";
import TimelineMonthBlock from "./TimeLineMonth";

const tempData = [
  {
    month: "January 2025",
    days: [
      "01/Wednesday",
      "02/Thursday",
      "03/Friday",
      "04/Saturday",
      "05/Sunday",
      "06/Monday",
      "07/Tuesday",
      "08/Wednesday",
      "09/Thursday",
      "10/Friday",
      "11/Saturday",
      "12/Sunday",
      "13/Monday",
      "14/Tuesday",
      "15/Wednesday",
      "16/Thursday",
      "17/Friday",
      "18/Saturday",
      "19/Sunday",
      "20/Monday",
      "21/Tuesday",
      "22/Wednesday",
      "23/Thursday",
      "24/Friday",
      "25/Saturday",
      "26/Sunday",
      "27/Monday",
      "28/Tuesday",
      "29/Wednesday",
      "30/Thursday",
      "31/Friday",
    ],
  },
  {
    month: "February 2025",
    days: [
      "01/Saturday",
      "02/Sunday",
      "03/Monday",
      "04/Tuesday",
      "05/Wednesday",
      "06/Thursday",
      "07/Friday",
      "08/Saturday",
      "09/Sunday",
      "10/Monday",
      "11/Tuesday",
      "12/Wednesday",
      "13/Thursday",
      "14/Friday",
      "15/Saturday",
      "16/Sunday",
      "17/Monday",
      "18/Tuesday",
      "19/Wednesday",
      "20/Thursday",
      "21/Friday",
      "22/Saturday",
      "23/Sunday",
      "24/Monday",
      "25/Tuesday",
      "26/Wednesday",
      "27/Thursday",
      "28/Friday",
    ],
  },
  {
    month: "March 2025",
    days: [
      "01/Saturday",
      "02/Sunday",
      "03/Monday",
      "04/Tuesday",
      "05/Wednesday",
      "06/Thursday",
      "07/Friday",
      "08/Saturday",
      "09/Sunday",
      "10/Monday",
      "11/Tuesday",
      "12/Wednesday",
      "13/Thursday",
      "14/Friday",
      "15/Saturday",
      "16/Sunday",
      "17/Monday",
      "18/Tuesday",
      "19/Wednesday",
      "20/Thursday",
      "21/Friday",
      "22/Saturday",
      "23/Sunday",
      "24/Monday",
      "25/Tuesday",
      "26/Wednesday",
      "27/Thursday",
      "28/Friday",
      "29/Saturday",
      "30/Sunday",
      "31/Monday",
    ],
  },
  {
    month: "April 2025",
    days: [
      "01/Tuesday",
      "02/Wednesday",
      "03/Thursday",
      "04/Friday",
      "05/Saturday",
      "06/Sunday",
      "07/Monday",
      "08/Tuesday",
      "09/Wednesday",
      "10/Thursday",
      "11/Friday",
      "12/Saturday",
      "13/Sunday",
      "14/Monday",
      "15/Tuesday",
      "16/Wednesday",
      "17/Thursday",
      "18/Friday",
      "19/Saturday",
      "20/Sunday",
      "21/Monday",
      "22/Tuesday",
      "23/Wednesday",
      "24/Thursday",
      "25/Friday",
      "26/Saturday",
      "27/Sunday",
      "28/Monday",
      "29/Tuesday",
      "30/Wednesday",
    ],
  },
  {
    month: "May 2025",
    days: [
      "01/Thursday",
      "02/Friday",
      "03/Saturday",
      "04/Sunday",
      "05/Monday",
      "06/Tuesday",
      "07/Wednesday",
      "08/Thursday",
      "09/Friday",
      "10/Saturday",
      "11/Sunday",
      "12/Monday",
      "13/Tuesday",
      "14/Wednesday",
      "15/Thursday",
      "16/Friday",
      "17/Saturday",
      "18/Sunday",
      "19/Monday",
      "20/Tuesday",
      "21/Wednesday",
      "22/Thursday",
      "23/Friday",
      "24/Saturday",
      "25/Sunday",
      "26/Monday",
      "27/Tuesday",
      "28/Wednesday",
      "29/Thursday",
      "30/Friday",
      "31/Saturday",
    ],
  },
  {
    month: "June 2025",
    days: [
      "01/Sunday",
      "02/Monday",
      "03/Tuesday",
      "04/Wednesday",
      "05/Thursday",
      "06/Friday",
      "07/Saturday",
      "08/Sunday",
      "09/Monday",
      "10/Tuesday",
      "11/Wednesday",
      "12/Thursday",
      "13/Friday",
      "14/Saturday",
      "15/Sunday",
      "16/Monday",
      "17/Tuesday",
      "18/Wednesday",
      "19/Thursday",
      "20/Friday",
      "21/Saturday",
      "22/Sunday",
      "23/Monday",
      "24/Tuesday",
      "25/Wednesday",
      "26/Thursday",
      "27/Friday",
      "28/Saturday",
      "29/Sunday",
      "30/Monday",
    ],
  },
  {
    month: "July 2025",
    days: [
      "01/Tuesday",
      "02/Wednesday",
      "03/Thursday",
      "04/Friday",
      "05/Saturday",
      "06/Sunday",
      "07/Monday",
      "08/Tuesday",
      "09/Wednesday",
      "10/Thursday",
      "11/Friday",
      "12/Saturday",
      "13/Sunday",
      "14/Monday",
      "15/Tuesday",
      "16/Wednesday",
      "17/Thursday",
      "18/Friday",
      "19/Saturday",
      "20/Sunday",
      "21/Monday",
      "22/Tuesday",
      "23/Wednesday",
      "24/Thursday",
      "25/Friday",
      "26/Saturday",
      "27/Sunday",
      "28/Monday",
      "29/Tuesday",
      "30/Wednesday",
      "31/Thursday",
    ],
  },
  {
    month: "August 2025",
    days: [
      "01/Friday",
      "02/Saturday",
      "03/Sunday",
      "04/Monday",
      "05/Tuesday",
      "06/Wednesday",
      "07/Thursday",
      "08/Friday",
      "09/Saturday",
      "10/Sunday",
      "11/Monday",
      "12/Tuesday",
      "13/Wednesday",
      "14/Thursday",
      "15/Friday",
      "16/Saturday",
      "17/Sunday",
      "18/Monday",
      "19/Tuesday",
      "20/Wednesday",
      "21/Thursday",
      "22/Friday",
      "23/Saturday",
      "24/Sunday",
      "25/Monday",
      "26/Tuesday",
      "27/Wednesday",
      "28/Thursday",
      "29/Friday",
      "30/Saturday",
      "31/Sunday",
    ],
  },
  {
    month: "September 2025",
    days: [
      "01/Monday",
      "02/Tuesday",
      "03/Wednesday",
      "04/Thursday",
      "05/Friday",
      "06/Saturday",
      "07/Sunday",
      "08/Monday",
      "09/Tuesday",
      "10/Wednesday",
      "11/Thursday",
      "12/Friday",
      "13/Saturday",
      "14/Sunday",
      "15/Monday",
      "16/Tuesday",
      "17/Wednesday",
      "18/Thursday",
      "19/Friday",
      "20/Saturday",
      "21/Sunday",
      "22/Monday",
      "23/Tuesday",
      "24/Wednesday",
      "25/Thursday",
      "26/Friday",
      "27/Saturday",
      "28/Sunday",
      "29/Monday",
      "30/Tuesday",
    ],
  },
];

export default function TimeLineDatesRow({
  datesList,
  zoomPosition,
  selectedType,
  focusedDays,
}) {
  const computedDatesList = useMemo(() => {
    const result = {};

    if (selectedType === "month") {
      const referenceDate = datesList.length ? datesList[0] : new Date();

      const currentMonth = startOfMonth(referenceDate);
      const lastMonth = endOfMonth(
        new Date(referenceDate.getFullYear(), 11, 1)
      );

      let monthCursor = currentMonth;
      while (monthCursor <= lastMonth) {
        const monthStart = startOfMonth(monthCursor);
        const monthEnd = endOfMonth(monthStart);
        const month = format(monthStart, "MMMM yyyy");

        result[month] = {
          month,
          days: Array.from({ length: monthEnd.getDate() }, (_, index) => {
            const dayDate = new Date(monthStart);
            dayDate.setDate(index + 1);
            return format(dayDate, "dd/EEEE");
          }),
        };

        monthCursor = addMonths(monthCursor, 1);
      }
    } else {
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
    }

    return Object.values(result);
  }, [datesList, selectedType]);

  const computedWeekList = useMemo(() => {
    const result = {};
    datesList.forEach((date) => {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

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

  console.log({ computedDatesList });

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
      }}
    >
      {/* <div className={styles.mockBlock} /> */}

      {tempData.map(({ month, days }) => (
        <div
          className={styles.dateBlock}
          style={{
            display:
              selectedType === "day" || selectedType === "month"
                ? "block"
                : "flex",
          }}
        >
          {selectedType === "day" ? (
            <>
              <div className={styles.monthBlock}>
                <span className={styles.monthText}>{month}</span>
              </div>

              <div
                className={styles.daysRow}
                style={{
                  height: selectedType === "month" ? 0 : "auto",
                }}
              >
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
            computedWeekList.map(({ week, days, weekDays }) => (
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
                  }}
                >
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
          ) : (
            <>
              <div className={styles.monthBlock}>
                <span className={styles.monthText}>{month}</span>
              </div>

              <div
                className={styles.daysRow}
                style={{
                  height: selectedType === "month" ? 0 : "auto",
                }}
              >
                {days?.map((day) => (
                  <TimelineMonthBlock
                    day={day}
                    focusedDays={focusedDays}
                    zoomPosition={zoomPosition}
                    selectedType={selectedType}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
