import { useContext } from "react"
import { TimelineBlockContext } from "./TimelineBlockProvider"

export const useTimelineBlockContext = () => {
  return useContext(TimelineBlockContext)
}
