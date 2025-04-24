import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Popover, Typography } from "@mui/material";
import { eachDayOfInterval, format, isValid } from "date-fns";
import clsx from "clsx";

export default function TimeLineDayBlock({
  day,
  zoomPosition,
  selectedType,
  focusedDays,
  month,
  scrollToToday,
  year,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const splittedDay = day?.split("/");
  const splittedMonth = month?.split(" ")[0];
  const splittedYear = month?.split(" ")[1];

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

    if (isValid(start) && isValid(end)) {
      const dateRange = eachDayOfInterval({ start, end });
      return dateRange;
    }

    return [];
  }

  const [isFocusedDay, setIsFocusedDay] = useState(false);

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
  // }, [focusedDays, day]);

  const date = `${splittedDay[0]} ${splittedMonth}, ${year || splittedYear}`;
  // console.log({ date });

  // const isFocusedDay = () => {
  //   if (focusedDays?.length) return null;

  //   return generateDateRange(focusedDays?.[0], focusedDays?.[1])
  //     .map((date) => {
  //       if (!date) return null;
  //       return format(date, "dd/EEEE");
  //     })
  //     .includes(day);
  // };
  const dateRange = generateDateRange(focusedDays?.[0], focusedDays?.[1]);

  const selectedRangeDates = dateRange.map((date) => {
    if (!date) return null;
    return format(date, "dd.MM.yyyy");
  });

  const fullDate = format(new Date(date), "dd.MM.yyyy");
  const dayBlockRef = useRef(null);
  const today = format(new Date(), "dd.MM.yyyy");
  const isToday = fullDate === today;

  const isSelected = selectedRangeDates.includes(fullDate);
  const isDayOff =
    (splittedDay[1] === "Saturday" || splittedDay[1] === "Sunday") &&
    selectedType !== "month";

  useEffect(() => {
    if (isToday && dayBlockRef.current) {
      requestAnimationFrame(() => {
        scrollToToday(dayBlockRef.current);
      });
    }
  }, [selectedType]);

  return (
    <>
      {/* <div
        style={{
          minWidth: `${zoomPosition * 30}px`,
          visibility: selectedType === "month" ? "hidden" : "",
          backgroundColor: isFocusedDay() ? "#007AFF !important" : "",
          color: isFocusedDay() ? "#fff !important" : "",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={`${styles.dayBlock} ${(splittedDay[1] === "Saturday" || splittedDay[1] === "Sunday") && selectedType !== "month" ? styles.dayOff : ""}`}
      >
        {splittedDay[0]}
      </div> */}

      <div
        className={styles.dayBlockWrapper}
        style={{
          justifyContent: selectedType === "week" ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            minWidth: `${zoomPosition * 30}px`,
            visibility: selectedType === "month" ? "hidden" : "visible",
            backgroundColor: isSelected ? "rgb(247, 247, 247)" : "transparent",
            position: "relative",
          }}
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          data-date={fullDate}
          ref={dayBlockRef}
          className={clsx(styles.dayBlock, {
            [styles.dayOff]: isDayOff && selectedType !== "month",
            [styles.firstSelectedDay]:
              isSelected && selectedRangeDates[0] === fullDate,
            [styles.lastSelectedDay]:
              isSelected &&
              selectedRangeDates[selectedRangeDates.length - 1] === fullDate,
            [styles.todayTopRow]: isToday,
          })}
        >
          <span className={styles.day}>{splittedDay[0]}</span>
        </div>
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
}
