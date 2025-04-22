import {Popover, Typography} from "@mui/material";
import {
  eachDayOfInterval,
  format,
  getDay,
  isValid,
  isWithinInterval,
} from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

const TimelineMonthBlock = ({
  day,
  zoomPosition,
  selectedType,
  focusedDays,
  month,
  scrollToToday,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const dayBlockRef = useRef(null);

  const splittedDay = day.split("/");
  const splittedMonth = month?.split(" ")[0];
  const splittedYear = month?.split(" ")[1];

  const today = format(new Date(), "dd.MM.yyyy");

  const date = `${splittedDay[0]} ${splittedMonth}, ${splittedYear}`;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  function generateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateRange = eachDayOfInterval({ start, end });
    return dateRange;
  }

  // const [isFocusedDay, setIsFocusedDay] = useState(false);

  // useEffect(() => {
  //   if (!focusedDays?.length) {
  //     setIsFocusedDay(false);
  //     return;
  //   }
  //   const dateRange = generateDateRange(focusedDays?.[0], focusedDays?.[1]);
  //   setIsFocusedDay(
  //     dateRange
  //       .map((date) => {
  //         if (!date) return null;
  //         return format(date, "dd/EEEE");
  //       })
  //       .includes(day)
  //   );

  //   setIsFocusedDay();
  // }, [focusedDays]);

  const targetDate = new Date(date);
  const [start, end] = focusedDays;

  const isInFocus =
    isValid(targetDate) &&
    isValid(start) &&
    isValid(end) &&
    isWithinInterval(targetDate, { start, end });

  const isMonday = getDay(new Date(format(new Date(date), "yyyy-MM-dd"))) === 1;
  const formattedDate = format(new Date(date), "dd.MM.yyyy");

  const isFirstSelectedDay =
    isValid(start) && format(start, "dd.MM.yyyy") === formattedDate;
  const isLastSelectedDay =
    isValid(end) && format(end, "dd.MM.yyyy") === formattedDate;

  const isVisible =
    today === format(new Date(date), "dd.MM.yyyy") ||
    isMonday ||
    isLastSelectedDay ||
    isFirstSelectedDay;

  useEffect(() => {
    if (formattedDate === today && dayBlockRef.current) {
      requestAnimationFrame(() => {
        console.log("Month effect");
        scrollToToday(dayBlockRef.current);
      });
    }
  }, [selectedType]);

  return (
    <>
      <div
        ref={dayBlockRef}
        style={{
          minWidth: `${zoomPosition * 20}px`,
          color: isInFocus ? "#fff" : "rgba(70, 68, 64, 0.45)",
          position: "relative",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={clsx(styles.monthBlockDay, {
          [styles.monthBlockFocused]: isInFocus,
          [styles.firstSelectedDay]: isFirstSelectedDay,
          [styles.lastSelectedDay]: isLastSelectedDay,
          [styles.todayTopRow]: today === format(new Date(date), "dd.MM.yyyy"),
        })}
      >
        <span
          style={{
            visibility: isVisible ? "visible" : "hidden",
            position: "relative",
            zIndex: 20,
          }}
        >
          {splittedDay[0]}
        </span>
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1, background: "#384147", color: "#fff" }}>
          {splittedDay[0] + " / " + splittedDay[1]}
        </Typography>
      </Popover>
    </>
  );
};

export default TimelineMonthBlock;
