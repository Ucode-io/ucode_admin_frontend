import { Box, Typography } from "@mui/material";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { format } from "date-fns";
import style from "./style.module.scss";

const CalendarDayRange = ({
  datesList,
  formatDate,
  date,
  currentDay,
  setCurrentDay,
}) => {
  const goToNext = () => {
    const nextDay = new Date(currentDay);
    nextDay.setDate(currentDay.getDate() + 1);
    currentDay.setDate(nextDay.getDate());
    setCurrentDay(nextDay);
  };

  const goToPrevious = () => {
    const previousDay = new Date(currentDay);
    previousDay.setDate(currentDay.getDate() - 1);
    currentDay.setDate(previousDay.getDate());
    setCurrentDay(previousDay);
  };

  return (
    <Box className={style.date}>
      <RectangleIconButton onClick={goToPrevious}>
        <ArrowLeft />
      </RectangleIconButton>
      <Box className={style.time}>
        {formatDate.find((item) => item.value === date).label}
      </Box>
      <RectangleIconButton onClick={goToNext}>
        <ArrowRight />
      </RectangleIconButton>

      <Typography variant="h5">
        {datesList?.length ? format(currentDay, "d MMMM yyyy") : ""}
      </Typography>
    </Box>
  );
};

export default CalendarDayRange;
