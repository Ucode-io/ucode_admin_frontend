import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { useEffect, useMemo } from "react";
import styles from "./styles.module.scss";
import TimeLineDayBlock from "./TimeLineDayBlock";
import TimelineMonthBlock from "./TimeLineMonth";
import { useSelector } from "react-redux";

export default function TimeLineDatesRow({
  datesList,
  zoomPosition,
  selectedType,
  focusedDays,
  months,
  scrollToToday,
  sidebarIsOpen,
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
          month: format(date, "MMMM yyyy"),
        };
    });

    return Object.values(result);
  }, [datesList]);

  // const computedWeekListV2 = useMemo(() => {
  //   const result = [];
  //   months.forEach((month) => {
  //     const splittedMonth = month?.month?.split(" ");

  //     const innerDays = {};
  //     month.days.forEach((day) => {
  //       const splittedDay = day?.split("/");
  //       const date = new Date(
  //         `${splittedDay[0]} ${splittedMonth[0]}, ${splittedMonth[1]}`
  //       );

  //       const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  //       const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

  //       const formattedDay = format(date, "dd/EEEE");

  //       if (innerDays[weekStart]) innerDays[weekStart].days.push(formattedDay);
  //       else
  //         innerDays[weekStart] = {
  //           week: format(weekStart, "w"),
  //           days: [formattedDay],
  //           weekDays: [weekStart, weekEnd],
  //           month: format(date, "MMMM yyyy"),
  //           year: format(date, "yyyy"),
  //         };
  //     });

  //     result.push({
  //       month: splittedMonth[0],
  //       days: Object.values(innerDays),
  //     });
  //   });

  //   return result;
  // }, [months]);

  // console.log({ computedWeekList, computedWeekListV2, months });

  const { timelineSidebarWidth } = useSelector((state) => state.main);

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
        zIndex: 20,
      }}
    >
      {/* <div className={styles.mockBlock} /> */}
      {selectedType === "week"
        ? computedWeekList.map(({ week, days, weekDays, month }, index) => (
            <div className={styles.weekBlockWrapper}>
              {/* {days?.map(({ weekDays, days, year }) => ( */}
              <div className={styles.weekBlock} key={`${month}-${index}`}>
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
                    borderLeft: "1px solid #e0e0e0",
                    borderBottom: "1px solid #e0e0e0",
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
                    <TimeLineDayBlock
                      day={day}
                      month={month}
                      // year={year}
                      focusedDays={focusedDays}
                      scrollToToday={scrollToToday}
                      selectedType={selectedType}
                      zoomPosition={zoomPosition}
                    />
                  ))}
                </div>
              </div>
              {/* ))} */}
            </div>
          ))
        : months.map(({ month, days }, index) => (
            <div
              key={`${selectedType}-${index}`}
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
                    <span
                      className={styles.monthText}
                      style={{
                        left: sidebarIsOpen
                          ? `${timelineSidebarWidth + 10}px`
                          : "60px",
                      }}
                    >
                      {month}
                    </span>
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
                        month={month}
                        scrollToToday={scrollToToday}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.monthBlock}>
                    <span
                      className={styles.monthText}
                      style={{ left: sidebarIsOpen ? "216px" : "16px" }}
                    >
                      {month}
                    </span>
                  </div>

                  <div
                    className={styles.daysRow}
                    style={
                      {
                        // height: selectedType === "month" ? 0 : "auto",
                        // boxShadow: "rgb(233, 233, 231) 0px -1px 0px 0px inset",
                      }
                    }
                  >
                    {days?.map((day) => (
                      <TimelineMonthBlock
                        day={day}
                        month={month}
                        focusedDays={focusedDays}
                        zoomPosition={zoomPosition}
                        selectedType={selectedType}
                        scrollToToday={scrollToToday}
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
