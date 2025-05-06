import { addDays, format } from "date-fns";
import React from "react";
import styles from "./styles.module.scss";
import { useTimelineBlockContext } from "./providers/TimelineBlockProvider";

export default function TimeLineDays({ date, zoomPosition, selectedType }) {
  const {
    setSelectedRow,
    setOpenDrawerModal,
    calendar_from_slug,
    calendar_to_slug,
  } = useTimelineBlockContext();

  const { setFocusedDays } = useTimelineBlockContext();
  const handleOpen = () => {
    setOpenDrawerModal(true);
    const data = {
      [calendar_from_slug]: new Date(date),
      [calendar_to_slug]: addDays(new Date(date), 5),
      IS_NEW: true,
      FROM_DATE_SLUG: calendar_from_slug,
      TO_DATE_SLUG: calendar_to_slug,
    };
    setSelectedRow(data);
  };
  const detectDayName = (date) => {
    const dayName = format(date, "EEEE");
    if (dayName === "Saturday" || dayName === "Sunday") return true;
    return false;
  };

  const handleMouseEnter = (e) => {
    setFocusedDays([
      new Date(e.target.dataset.date),
      addDays(new Date(e.target.dataset.date), 5),
    ]);
  };

  return (
    <>
      <div
        data-date={date}
        onClick={handleOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setFocusedDays([]);
        }}
        className={`${styles.rowItem} ${detectDayName(date) && selectedType !== "month" ? styles.dayOff : ""} ${selectedType === "month" ? styles.month : ""}`}
        style={{
          minWidth: `${zoomPosition * (selectedType === "month" ? 20 : 30)}px`,
          cursor: "crosshair",
          borderRight:
            selectedType === "month" && format(date, "dd") === "31"
              ? "1px solid #e0e0e0"
              : "",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            color: "rgb(211, 79, 67)",
            transform: "rotate(90deg)",
          }}
        >
          {format(new Date(), "dd.MM.yyyy") === format(date, "dd.MM.yyyy") &&
            "Today"}
        </div>
        {format(new Date(), "dd.MM.yyyy") === format(date, "dd.MM.yyyy") && (
          <div className={styles.today} id="todayDate" />
        )}
      </div>
    </>
  );
}
