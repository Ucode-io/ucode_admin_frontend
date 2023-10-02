import { Box, Typography } from "@mui/material";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { format } from "date-fns";
import style from "./style.module.scss";

const CalendarDayRange = ({
  currentIndex,
  setCurrentIndex,
  datesList,
  formatDate,
  date,
}) => {
  const goToNext = () => {
    if (currentIndex < datesList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
        {datesList?.length
          ? format(new Date(datesList[currentIndex]), "d MMMM yyyy")
          : ""}
      </Typography>
    </Box>
  );
};

export default CalendarDayRange;
