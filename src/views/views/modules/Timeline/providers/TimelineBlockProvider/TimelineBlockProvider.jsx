import { createContext } from "react";

export const TimelineBlockContext = createContext()

export const TimelineBlockProvider = ({children, state}) => <TimelineBlockContext.Provider value={state}>{children}</TimelineBlockContext.Provider>
