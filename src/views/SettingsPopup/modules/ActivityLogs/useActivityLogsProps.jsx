import { useState } from "react";
import {endOfMonth, startOfMonth} from "date-fns";
import { useGetLang } from "@/hooks/useGetLang";

export const useActivityLogsProps = () => {

  const activityLan = useGetLang("Activity Logs")

  const [actionValue, setActionValue] = useState({});
  const [actionType, setActionType] = useState({});

  const [histories, setHistories] = useState(null);
  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lt: endOfMonth(new Date()),
  });

  return {
    histories,
    setHistories,
    dateFilters,
    setDateFilters,
    activityLan,
    actionValue,
    setActionValue,
    actionType,
    setActionType,
  };
}
