import { useCalendarViewContext } from "../../Providers";

export const useCalendarMonthRangeProps = () => {

  const {
      calendarRef = {},
      currentDay = new Date(),
      setCurrentDay = () => {},
    } = useCalendarViewContext();
  
    const nextMonth = () => {
      const nextMonthStart = new Date(currentDay);
      nextMonthStart.setMonth(currentDay.getMonth() + 1);
  
      if (nextMonthStart.getDay() !== 0) {
        nextMonthStart.setDate(1 - nextMonthStart.getDay() + 7);
      }
      setCurrentDay(nextMonthStart);
    };
  
    const prevMonth = () => {
      const prevMonthStart = new Date(currentDay);
      prevMonthStart.setMonth(currentDay.getMonth() - 1);
  
      if (prevMonthStart.getDay() !== 0) {
        prevMonthStart.setDate(1 - prevMonthStart.getDay() + 7);
      }
      setCurrentDay(prevMonthStart);
    };
  
    const handleScrollToToday = () => {
      const today = new Date();
      setCurrentDay(today);
      
      setTimeout(() => {
        if (calendarRef?.current) {
          const elToday = calendarRef?.current.querySelector(
            "[data-is-today = true]"
          );
          if (elToday) {
            elToday.scrollIntoView({ behavior: "smooth", inline: "center" });
          }
        }
      }, 100);
    };

  return {
    nextMonth,
    prevMonth,
    handleScrollToToday,
    currentDay,
  }
}
