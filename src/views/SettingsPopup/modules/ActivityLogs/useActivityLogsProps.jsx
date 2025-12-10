import { useState } from "react";
import { endOfMonth, startOfMonth } from "date-fns";
import { useGetLang } from "@/hooks/useGetLang";

export const useActivityLogsProps = () => {
  const activityLan = useGetLang("Activity Logs");

  const defaultTabIndex =
    Number(sessionStorage.getItem("activityLogsTabIndex")) || 0;

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

  const [tabIndex, setTabIndex] = useState(defaultTabIndex);

  const [histories, setHistories] = useState(null);
  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lte: endOfMonth(new Date()),
  });

  const onTabChange = (index) => {
    setTabIndex(index);
    sessionStorage.setItem("activityLogsTabIndex", index);
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
};
