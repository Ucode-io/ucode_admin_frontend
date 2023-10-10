import { Box, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import style from "../style.module.scss";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { format } from "date-fns";
import { dateValidFormat } from "../../../../utils/dateValidFormat";
import { useEffect, useState } from "react";

const CalendarWeekRange = ({
  formatDate,
  date,
  setCurrentDay,
  currentDay,
  weekDates,
  setFirstDate,
  firstDate,
  setLastDate,
  lastDate,
}) => {
  //   const nextWeek = () => {
  //     if (currentWeekIndex < weekData.length - 1) {
  //       setCurrentWeekIndex(currentWeekIndex + 1);
  //     }
  //   };

  //   const previousWeek = () => {
  //     if (currentWeekIndex > 0) {
  //       setCurrentWeekIndex(currentWeekIndex - 1);
  //     }
  //   };

  useEffect(() => {
    setFirstDate(weekDates[0]);
    setLastDate(weekDates[weekDates.length - 1]);
  }, [weekDates]);

  const nextWeek = () => {
    const nextMonday = new Date(currentDay);
    nextMonday.setDate(currentDay.getDate() + 7);
    setCurrentDay(nextMonday);
  };

  const prevWeek = () => {
    const prevMonday = new Date(currentDay);
    prevMonday.setDate(currentDay.getDate() - 7);
    setCurrentDay(prevMonday);
  };
  const formattedDifference =
    firstDate && format(firstDate, "dd") + " - " + format(lastDate, "dd");

  return (
    <Box className={style.date}>
      <RectangleIconButton onClick={prevWeek}>
        <ArrowLeft />
      </RectangleIconButton>
      <Box className={style.time}>
        {formatDate.find((item) => item.value === date).label}
      </Box>
      <RectangleIconButton onClick={nextWeek}>
        <ArrowRight />
      </RectangleIconButton>

      <Typography variant="h5">
        {firstDate && formattedDifference} {format(currentDay, "MMMM yyyy")}
      </Typography>
    </Box>
  );
};

export default CalendarWeekRange;
