import { useContext } from "react";
import { CalendarViewContext } from "./CalendarViewProvider";

export const useCalendarViewContext = () => {
  return useContext(CalendarViewContext);
}
