import { addDays, format } from "date-fns";
import React, { useMemo, useRef, useState } from "react";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";
import { useTimelineBlockContext } from "./providers/TimelineBlockProvider";
import { TimelineRowNewDateLine } from "./components/TimelineRowNewDateLine";
import { position } from "@chakra-ui/react";

export default function TimeLineDays({
  date,
  zoomPosition,
  selectedType,
  index,
  data,
  noDates,
  view,
  calendarRef,
}) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");

  const [cursorPosition, setCursorPosition] = useState(0);
  const [hoveredDate, setHoveredDate] = useState(null);

  const { setFocusedDays } = useTimelineBlockContext();
  const handleOpen = () => {
    setOpen(true);
    setSelectedRow("NEW");
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
    console.log(e.clientX);
    setCursorPosition({ x: e.clientX, y: e.clientY });
    setHoveredDate(new Date(e.target.dataset.date));
  };

  return (
    <>
      <div
        data-date={date}
        onClick={handleOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setHoveredDate(null);
          setFocusedDays([]);
        }}
        className={`${styles.rowItem} ${detectDayName(date) && selectedType !== "month" ? styles.dayOff : ""} ${selectedType === "month" ? styles.month : ""}`}
        style={{
          minWidth: `${zoomPosition * (selectedType === "month" ? 20 : 30)}px`,
          cursor: "cell",
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

        {/* <TimelineRowNewDateLine
          hoveredDate={hoveredDate}
          left={"0px"}
          width={`${zoomPosition * (selectedType === "month" ? 20 : 30) * 5}px`}
          style={{
            height: "32px",
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
          }}
        /> */}
      </div>

      <ModalDetailPage
        open={open}
        setOpen={setOpen}
        selectedRow={selectedRow}
      />
    </>
  );
}
