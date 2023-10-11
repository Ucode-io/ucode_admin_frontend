import { Box, Typography } from "@mui/material";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { format } from "date-fns";
import style from "./style.module.scss";
import CDatePicker from "../../../components/DatePickers/CDatePicker";

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

      <Typography variant="h5" mr={1} ml={1}>
        {datesList?.length ? format(currentDay, "d MMMM yyyy") : ""}
      </Typography>
      <Box>
        <CDatePicker
          value={currentDay}
          mask={"99.99.9999"}
          onChange={(val) => {
            setCurrentDay(val);
          }}
        />
      </Box>
    </Box>
  );
};

export default CalendarDayRange;
