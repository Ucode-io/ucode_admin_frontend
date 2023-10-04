import { Box, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import style from "../style.module.scss";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";

const CalendarMonthRange = ({
  currentWeekIndex,
  setCurrentWeekIndex,
  formatDate,
  date,
  weekData,
}) => {
  const nextWeek = () => {
    if (currentWeekIndex < weekData.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const previousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  return (
    <Box className={style.date}>
      <RectangleIconButton onClick={previousWeek}>
        <ArrowLeft />
      </RectangleIconButton>
      <Box className={style.time}>
        {formatDate.find((item) => item.value === date).label}
      </Box>
      <RectangleIconButton onClick={nextWeek}>
        <ArrowRight />
      </RectangleIconButton>

      <Typography variant="h5">{currentWeekIndex + 1} - Week</Typography>
    </Box>
  );
};

export default CalendarMonthRange;
