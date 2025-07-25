import { createContext } from "react";

export const CalendarViewContext = createContext({});

export const CalendarViewProvider = ({ children, value }) => {
  return <CalendarViewContext.Provider value={value}>{children}</CalendarViewContext.Provider>;
}
