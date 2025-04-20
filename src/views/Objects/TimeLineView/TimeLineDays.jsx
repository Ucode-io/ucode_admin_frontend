import {format} from "date-fns";
import React, { useMemo, useRef, useState } from "react";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";

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
  const handleOpen = () => {
    setOpen(true);
    setSelectedRow("NEW");
  };
  const detectDayName = (date) => {
    const dayName = format(date, "EEEE");
    if (dayName === "Saturday" || dayName === "Sunday") return true;
    return false;
  };

  return (
    <>
      <div
        data-date={format(date, "dd.MM.yyyy")}
        // onClick={handleOpen}
        className={`${styles.rowItem} ${detectDayName(date) && selectedType !== "month" ? styles.dayOff : ""} ${selectedType === "month" ? styles.month : ""}`}
        style={{
          minWidth: `${zoomPosition * (selectedType === "month" ? 20 : 30)}px`,
          // cursor: "cell",
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

      <ModalDetailPage
        open={open}
        setOpen={setOpen}
        selectedRow={selectedRow}
      />
    </>
  );
}
