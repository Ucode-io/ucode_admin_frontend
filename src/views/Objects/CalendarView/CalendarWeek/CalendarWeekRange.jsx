import { Box, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import style from "../style.module.scss";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";

const CalendarWeekRange = ({
  currentWeekIndex,
  setCurrentWeekIndex,
  formatDate,
  date,
  weekData,
  setCurrentDay,
  currentDay,
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

      <Typography variant="h5"> Week</Typography>
    </Box>
  );
};

export default CalendarWeekRange;
