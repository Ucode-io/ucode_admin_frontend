import { format } from "date-fns";
import cls from "./styles.module.scss";
import { Box, Typography } from "@mui/material";
import { useCalendarMonthRangeProps } from "./useCalendarMonthRangeProps"
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";

export const CalendarMonthRange = () => {

  const {
    prevMonth,
    handleScrollToToday,
    nextMonth,
    currentDay,
  } = useCalendarMonthRangeProps()

  return <Box className={cls.date}>
    <Typography variant="h5">{format(currentDay, "MMMM yyyy")}</Typography>
    <div className={cls.rangeContainer}>
      <button className={cls.rangeBtn} onClick={prevMonth}>
        <span>
          <ArrowLeft fontSize="small" />
        </span>
      </button>
      <button className={cls.time} onClick={handleScrollToToday}>
        Today
      </button>
      <button className={cls.rangeBtn} onClick={nextMonth}>
        <span>
          <ArrowRight fontSize="small" />
        </span>
      </button>
    </div>
  </Box>
}
