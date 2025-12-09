import { useState } from "react";
import {endOfMonth, startOfMonth} from "date-fns";
import { useGetLang } from "@/hooks/useGetLang";

export const useActivityLogsProps = () => {

  const activityLan = useGetLang("Activity Logs")

  const tabs = [
    {
      name: "Activity Logs",
      guid: "activity-logs",
    },
    {
      name: "Function Logs",
      guid: "function-logs",
    },
  ];

  const [actionValue, setActionValue] = useState({});
  const [actionType, setActionType] = useState({});

  const [tabIndex, setTabIndex] = useState(0);

  const [histories, setHistories] = useState(null);
  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lte: endOfMonth(new Date()),
  });

  const onTabChange = (index) => {
    setTabIndex(index);
  };

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
    tabIndex,
    onTabChange,
    tabs,
  };
}
